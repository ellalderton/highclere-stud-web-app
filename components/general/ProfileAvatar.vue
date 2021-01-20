<template>
	<div style="margin-bottom: 80px;">
        <div class="profile__user text-center">
			<input
	            type="file"
	            class="attachment-upload__input"
	            name="avatar-input"
	            id="avatar-input"
	            @change="fileInputChange"
	            v-if="!uploading"
	        >
			<label ref="avatarInput" for="avatar-input">
				<div
					v-if="hasAvatar"
					class="profile__avatar profile__avatar--has-image"
					:style="`background-image: url('${avatarPath}?w=200')`"
				>
					<div class="profile__avatar-update-btn">
					    <edit-icon-svg/>
					    <span class="sr-only">Click to update your profile image</span>
					</div>
				</div>

				<div v-else class="profile__avatar">
					<span class="profile__avatar-initials">{{ userInitials | uppercase }}</span>
					<div class="profile__avatar-update-btn">
					    <plus-icon-svg/>
					    <span class="sr-only">Click to update your profile image</span>
					</div>
	            </div>
			</label>

			<h3 class="[ heading--3 ] [ text-center ] [ font-weight-normal ]">{{ user.first_name }} {{ user.last_name }}</h3>
	        <div class="[ text--lg text-center ]">
	            <p>{{ user.email }}</p>
	        </div>
        </div>

        <template v-if="uploading && !failed">
            <div class="attachment-progress my-3" v-if="!uploadingComplete">
                <div class="attachment-progress__bar" v-bind:style="{width: fileProgress + '%' }"></div>
            </div>
        </template>
    </div>
</template>

<script>
	import EditIconSvg from '@/assets/svg/edit.svg';
	import PlusIconSvg from '@/assets/svg/plus.svg';

	export default {
		data() {
			return {
				hasAvatar: false,
				avatarPath: this.user.avatar_url,
				uploading: false,
                file: null,
                uploadingComplete: false,
                failed: false,
                fileProgress: 0,
                allowedFileExtensions: [
                	'jpeg','jpg','png','gif'
                ]
			}
		},
		props: {
			user: {
				required: true
			}
		},
		components: {
			EditIconSvg,
			PlusIconSvg
		},
		created() {
			if(this.user.avatar_url) {
				this.hasAvatar = true;
			}
		},
		computed: {
			userInitials() {
				return `${this.user.first_name.charAt(0)}${this.user.last_name.charAt(0)}`;
			}
		},
		methods: {
			fileInputChange() {
			    this.file = document.getElementById('avatar-input').files[0];

			    if(this.file) {
                	const fileExtension = this.file.name.split('.').pop().toLowerCase();
                	if(!this.validateFileExtension(fileExtension)) {
                		this.uploading = true;
					       this.failed = false;

					       let form = new FormData();

					       form.append('image', this.file);

					       form.append('fileExtension', this.file.name.split('.').pop().toLowerCase());

					       const uploadProgress = this.uploadProgress;

					       let config = {
					           onUploadProgress(progressEvent) {
					               let percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);

					               uploadProgress(percentCompleted);

					               return percentCompleted;
					           }
					       };

					       this.$axios.$post(`${process.client ? window.location.origin : ''}/w-api/api/me/avatar`, form, config)
					       .then((result) => {
					          this.uploadingComplete = true;
					          this.uploading = false;
					          // update vuex user avatar_url
					          this.$store.commit('auth/setAvatar', result.avatar_url);

					          this.avatarPath = result.avatar_url;
					          this.hasAvatar = true;
					       }, () => {
					           this.failed = true;
					       });
                	}
                }
			},
			uploadProgress(percent) {
                this.fileProgress = percent;
            },
            async remove() {
            	let result = await axios.delete(`/avatar/${this.userId}`);

            	this.avatarPath = result.data;
			    this.hasAvatar = false;
			    this.file = null;
			    this.uploading = false;
			    this.uploadingComplete = false;
			    this.fileProgress = 0;
            },
            validateFileExtension(fileExtension) {
            	if(this.allowedFileExtensions.indexOf(fileExtension) <= -1) {
            		this.$swal({
                       	type: 'error',
                       	text: 'File type not allowed',
                       	backdrop: `
    						rgba(12, 12, 12, 0.68);
    					`
                   	});
					this.file = null;

					return true;
            	}
            	return false;
            },
            openUpload() {
            	this.$refs.avatarInput.click();
            }
		}
	}
</script>

<style>
	.attachment-upload__input {
		width: 0.1px;
		height: 0.1px;
		opacity: 0;
		overflow: hidden;
		position: absolute;
		z-index: -1;
	}
</style>