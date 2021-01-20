import AddAttachment from '@/components/notes/AddAttachment';

const addNoteMixin = {
	components: {
			AddAttachment
	},
	props: {
		isComment: {
			required: false,
			type: Boolean,
			default: false
		}
	},
	data() {
		return {
			form: {
				body: '',
				private: 0,
				title: '',
			},
			hasAttachment: false,
			attachment: null,
			file: {
				uploading: false,
				uploadingComplete: false,
                failed: false,
                fileProgress: 0,           
			},
			posting: false
		}
	},
	computed: {
		disabledButton() {
			if(this.form.title === '' || this.posting) return true;

			if(this.form.body === '') {
				return true;
			}

			// if hasAttachment must have a title and a url or file.
			if(this.hasAttachment) {
				if(!this.attachment) {
					return true;
				} else if (!this.attachment.title || (!this.attachment.url && !this.attachment.file)) {
					return true;
				}
			}

			return false;
		},
	},
	methods: {
		submit() {
			if(!this.attachment) {
				this.post();
			} else {
				if(this.attachment.type.includes('url')) {
					this.postWithUrl();
				}
				else {
					this.postWithFile();
				}
			}
		},
		async post() {
			try {
					let comment = await this.$axios.$post(this.postUrl, this.form);

					this.$emit('posted');
					this.resetForm();
				} catch(err) {
					this.uploadFailed(err);
				}		
		},
		async postWithUrl() {
			try {
				let form = this.form;
				form.type = this.attachment.type;
				form.external_url = this.attachment.url;

				let comment = await this.$axios.$post(this.postUrl, this.form);

				this.$emit('posted');
				this.resetForm();
			} catch(err) {
				this.uploadFailed(err);
			}		
		},
		postWithFile() {
			this.file.uploading = true;
            this.file.failed = false;

            let form = new FormData();

            form.append('title', this.form.title);
            form.append('type', this.attachment.type);
            form.append('file', this.attachment.file);
            form.append('body', this.form.body);
            form.append('private', this.form.private);
            form.append('attachment_title', this.attachment.title);
            form.append('recipient_id', this.form.recipient_id);

            const uploadProgress = this.uploadProgress;

            let config = {
               	onUploadProgress(progressEvent) {
                   let percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);

                   uploadProgress(percentCompleted);

                   return percentCompleted;
               	}
           	};

           	this.posting = true;

           	let comment = this.$axios.$post(this.postUrl, form, config)
               	.then((res) => {
                   this.file.uploadingComplete = true;

                   this.$emit('posted');
                   this.posting = false;
                   this.resetForm();
                   
               	}).catch(err => {
               		// console.log(err);
                   this.uploadFailed(err);
                   this.posting = false;
               	}); 
		},
		uploadProgress(percent) {
            this.file.fileProgress = percent;
        },
        uploadFailed(err) {
        	this.$swal({
               	type: 'error',
               	text: 'The was an error posting your message, please try again.',
               	backdrop: `
					rgba(12, 12, 12, 0.68);
				`
           });
        },
		resetForm() {
			this.form.body = "";
			this.form.title = this.isComment ? 'reply' : '';
			this.form.private = 0;
			this.attachment = null;
			this.hasAttachment = false;
			this.file.uploading = false;
			this.file.uploadingComplete = false;
            this.file.fileProgress = 0;
            this.$emit('cancelled');
		},
		attachmentAdded(attachment) {
			this.attachment = attachment;
		},
		attachmentRemove() {
			this.attachment = null;
			this.hasAttachment = false;
		}
	}
};

export default addNoteMixin;