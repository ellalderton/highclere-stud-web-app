<template>
	<div v-if="hasAttachment">
		<template v-if="!attachmentAdded">
			<template v-if="attachment.type === 'text'">
	    		<h3 class="[ heading--3 ] [ text-center ] [ mt-3 ]">Choose type of media</h3>

	    		<div class="[ media-upload-options ] [ grid--2 grid--sm-3 grid--lg-6 ] [ mt-3 ]">
                    <div>
                        <button type="button" class="media-upload-options__option" @click.prevent="selectMedia('image')">
                            <span class="media-upload-options__icon">
                                <image-icon-svg/>
                            </span>
                            <span class="media-upload-options__label">Image</span>
                        </button>
                    </div>
                    <div>
                        <button type="button" class="media-upload-options__option" @click.prevent="selectMedia('audio')">
                            <span class="media-upload-options__icon">
                                <audio-icon-svg/>
                            </span>
                            <span class="media-upload-options__label">Audio</span>
                        </button>
                    </div>
                    <div>
                        <button type="button" class="media-upload-options__option" @click.prevent="selectMedia('audio-url')">
                            <span class="media-upload-options__icon">
                                <external-audio-icon-svg/>
                            </span>
                            <span class="media-upload-options__label">Audio URL</span>
                        </button>
                    </div>
                    <div>
                        <button type="button" class="media-upload-options__option" @click.prevent="selectMedia('video')">
                            <span class="media-upload-options__icon">
                                <video-icon-svg/>
                            </span>
                            <span class="media-upload-options__label">Video</span>
                        </button>
                    </div>
                    <div>
                        <button type="button" class="media-upload-options__option" @click.prevent="selectMedia('video-url')">
                            <span class="media-upload-options__icon">
                                <external-video-icon-svg/>
                            </span>
                            <span class="media-upload-options__label">Video URL</span>
                        </button>
                    </div>
                    <div>
                        <button type="button" class="media-upload-options__option" @click.prevent="selectMedia('document')">
                            <span class="media-upload-options__icon">
                                <file-icon-svg/>
                            </span>
                            <span class="media-upload-options__label">Document</span>
                        </button>
                    </div>
                </div>

                <hr>

	    		<app-button white block v-on:btn-click="cancelAttachment">Cancel Media</app-button>
	    		
	    	</template>

	        <template v-if="attachment.type !== 'text'">
	        	<h3 class="[ heading--3 ] [ text-center ] [ mt-3 ]">{{ uploadHeading }}</h3>

	        	<template v-if="attachment.file === null && attachmentTypeIsFile">
					<input
						style="display: none;" 
						accept="video/*|image/*" 
						class="attachment-upload__input"
		                type="file" 
		                name="attachment" 
		                :id="fileInputId"
		                @change="fileInputChange"
		            >
		            <label class="btn btn-white btn-block [ mt-3 mb-4 ]" :for="fileInputId">Choose {{ attachment.type }}</label>
		        </template>

		       <!--  <div v-if="attachment.file" class="upload-details [ mb-2 mt-3 ]">
		        	<div class="media-upload-options__icon [ mr-3 mb-0 ]">
		        		<image-icon-svg v-if="attachment.type === 'image'"/>
			        	<audio-icon-svg v-if="attachment.type === 'audio'"/>
			        	<video-icon-svg v-if="attachment.type === 'video'"/>
			        	<file-icon-svg v-if="attachment.type === 'document'"/>
		        	</div>
		        	<div>
		        		<p>{{ attachment.file.name }}</p>
    					<p>{{ attachment.file.size | bytesToKilobytes }}kb</p>
		        	</div>        	
		        </div> -->

	        	<label class="add-new-note__label" for="newPassword">{{ inputLabel }} Title</label>
	        	<input 
	        		class="form-control form-control-lg add-new-note__input" 
	        		type="text" 
	        		v-model="attachment.title" 
	        		placeholder="Enter title"
	        	>
				
				<template v-if="attachmentTypeIsUrl">
					<label class="add-new-note__label" for="newPassword">{{ inputLabel }} URL</label>
	        		<input 
	        			class="form-control form-control-lg add-new-note__input" 
	        			type="text" 
	        			v-model="attachment.url" 
	        			placeholder="Enter URL">
				</template>
	       

		        <!-- <app-button 
		        	primary block
					:disabled="disabledButton()"
					v-on:btn-click="addAttachment"
				>Add {{ attachment.type | hyphenToSpaces }}</app-button> -->

				<app-button
					style="margin-top: 15px;" 
					block white 
					v-on:btn-click="resetAttachment"
				>Step Back</app-button>

	        </template>
		</template>
    	<template v-else>
    		<app-button white block v-on:btn-click="cancelAttachment">Remove Media</app-button>
    	</template>
    </div>
</template>

<script>
	import { attachmentTypes }  from '~/siteConfig';
	import { find as _find } from 'underscore';
	import AudioIconSvg from '@/assets/svg/audio.svg';
	import ExternalAudioIconSvg from '@/assets/svg/audio-www.svg';
	import FileIconSvg from '@/assets/svg/file.svg';
	import VideoIconSvg from '@/assets/svg/video.svg';
	import ExternalVideoIconSvg from '@/assets/svg/video-www.svg';
	import ImageIconSvg from '@/assets/svg/image.svg';


	export default {
		data() {
			return {
				hasAttachment: false,
				attachmentTypes: null,
				attachment: {
					title: '',
					type: 'text',
					file: null,
					url: '',
				},
				attachmentAdded: false,
				allowedFileExtensions: {
                	image: ['jpg','jpeg','png'],
                	audio: ['m4a','mp4a','mpga','aac','mp3'],
                	video: ['mov','mp4','m4v','avi','mkv','mpeg','wmv'],
                	document: ['pdf']
                }
			}
		},
		props: {
			fileInputId: {
				required: true,
				type: String
			},
			show: {
				required: true,
				type: Boolean
			}
		},
		components: {
			AudioIconSvg,
			ExternalAudioIconSvg,
			FileIconSvg,
			VideoIconSvg,
			ExternalVideoIconSvg,
			ImageIconSvg
		},
		created() {
			this.attachmentTypes = attachmentTypes;
			this.hasAttachment = this.show;
		},
		computed: {
			attachmentTypeIsUrl() {
				if(!this.attachment.type) return false;

				return this.attachment.type.indexOf('url') !== -1;
			},
			attachmentTypeIsFile() {
				if(!this.attachment.type) return false;

				return this.attachment.type.indexOf('url') === -1 && this.attachment.type !== 'text';
			},
			attachmentTypeName() {
				const attachmentType = _find(this.attachmentTypes, (type) => {
					return type.type === this.attachment.type;
				});

				return attachmentType.name;
			},
			uploadHeading() {
				if(!this.attachment.type || this.attachment.type === 'text') return '';

				if(this.attachment.type === 'image') return 'Upload image';
				if(this.attachment.type === 'audio') return 'Upload audio';
				if(this.attachment.type === 'video') return 'Upload video';
				if(this.attachment.type === 'document') return 'Upload file';

				if(this.attachment.type === 'audio-url') return 'Add audio url';
				if(this.attachment.type === 'video-url') return 'Add video url';
			},
			inputLabel() {
				let label = this.attachment.type.split("-")[0];
				return  label.charAt(0).toUpperCase() + label.slice(1);
			}
		},
		watch: {
			show(val) {
				this.hasAttachment = val;
				if(!val) {
					this.resetAttachment();
				}
			},
			attachment: {
				handler(val) {
					this.$emit('added-attachment', this.attachment);
				},
				deep: true
			}
		},
		methods: {
			disabledButton() {
				if(this.attachment.title === '') return true;

				if(this.attachment.type.includes('url') && this.attachment.url === '') return true;

				if(!this.attachment.type.includes('url') && !this.attachment.file) return true;

				return false;
			},
			fileInputChange() {
                this.attachment.file = document.getElementById(this.fileInputId).files[0];

                const fileExtension = this.attachment.file.name.split('.').pop().toLowerCase();
                this.validateFileExtension(fileExtension);

                if(this.attachment.file) {
                	this.validateFileSize();
                }
            },
			cancelAttachment() {
				this.resetAttachment();
				this.hasAttachment = false;
				this.$emit('removed-attachment');
			},
			resetAttachment() {
				this.attachment.type = 'text';
				this.attachment.title = '';
				this.attachment.file = null;
				this.attachment.url = '';
				this.attachmentAdded = false;
			},
			addAttachment() {
				this.attachmentAdded = true;
				this.$emit('added-attachment', this.attachment);
			},
			selectMedia(type) {
				this.attachment.type = type;
			},
			validateFileExtension(fileExtension) {
            	if(this.allowedFileExtensions[this.attachment.type].indexOf(fileExtension) <= -1) {
            		this.$swal({
                       	type: 'error',
                       	text: `File type not allowed. Please upload a file of one of these types: ${this.allowedFileExtensions[this.attachment.type].join(', ')}`,
                       	backdrop: `
    						rgba(12, 12, 12, 0.68);
    					`
                   	});
					this.attachment.file = null;
					
					return;
            	}
            	return;
            },
            validateFileSize() {
            	const fileSize = this.attachment.file.size / 1000;
            	if(fileSize > 70000) {
            		this.$swal({
                       	type: 'error',
                       	text: `File size is too large, must be less than 70mb`,
                       	backdrop: `
    						rgba(12, 12, 12, 0.68);
    					`
                   	});
					this.attachment.file = null;
            	}
            	return;
            }		
		}
	}
</script>