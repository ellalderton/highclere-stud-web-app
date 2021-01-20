<template>
	<form @submit.prevent="submit" class="add-new-note__form">

		<label class="add-new-note__label" for="newPassword">Title</label>
		<input 
			class="form-control form-control-lg add-new-note__input" 
			type="text" 
			name="title" 
			value="" 
			placeholder="Type here..."
			v-model.trim="form.title"
		>

		<label class="add-new-note__label" for="confirmNewPassword">Body</label>
		<textarea 
			class="form-control form-control-lg add-new-note__input" 
			type="text" 
			name="confirmNewPassword" 
			v-model.trim="form.body"
			placeholder="Type here..." 
			rows="8"
		></textarea>

		<div class="block-btn-group pt-2">
            <app-button 
            	block white 
            	v-on:btn-click="hasAttachment = true" 
            	v-show="!hasAttachment"
            >Add media</app-button>

            <div v-if="attachment && (attachment.file || attachment.url)" class="upload-details [ mb-3 ]">
				<div class="media-upload-options__icon [ mr-3 mb-0 ]">
	    			<image-icon-svg v-if="attachment.type === 'image'"/>
		        	<audio-icon-svg v-if="attachment.type === 'audio'"/>
		        	<external-audio-icon-svg v-if="attachment.type === 'audio-url'"/>
		        	<video-icon-svg v-if="attachment.type === 'video'"/>
		        	<external-video-icon-svg v-if="attachment.type === 'video-url'"/>
		        	<file-icon-svg v-if="attachment.type === 'document'"/>
	    		</div>

				<div v-if="attachment.url">
					<!-- <p>Title: {{ attachment.title }}</p> -->
					<p>URL: {{ attachment.url }}</p>
				</div>

				<div class="upload-details__copy" v-if="attachment.file">
					<p>{{ attachment.file.name }}</p>
					<!-- <p>{{ attachment.file.name }}</p> -->

					<template v-if="file.uploading && !file.failed">
			            <div class="attachment-progress [ my-2 ]" v-if="!file.uploadingComplete">
			                <div class="attachment-progress__bar" v-bind:style="{width: file.fileProgress + '%' }"></div> 
			            </div>
			        </template>

					<p v-if="!file.uploading">{{ attachment.file.size | bytesToKilobytes }}kb</p>
					<p v-else>
						{{ attachmentUploadedSize | bytesToKilobytes }}kb of {{ attachment.file.size | bytesToKilobytes }}kb ({{  file.fileProgress}}% complete)
					</p>
				</div>
			</div>

            <add-attachment
				:file-input-id="fileInputId"
				:show="hasAttachment"
				v-on:added-attachment="attachmentAdded"
				v-on:removed-attachment="attachmentRemove"
	        />

            <app-button
            	style="margin-top: 15px;"
            	v-show="(hasAttachment && attachment !== null) || !hasAttachment" 
            	block primary 
            	v-on:btn-click="submit" 
            	:disabled="disabledButton"
            >
            	<template v-if="posting">
            		Posting Note<dot-progress/>
            	</template>
            	<template v-else>
            		Create
            	</template>
        	</app-button>
        </div>
	</form>
</template>

<script>
	import addNoteMixin from "@/mixins/addNoteMixin.js";
	import AudioIconSvg from '@/assets/svg/audio.svg';
	import ExternalAudioIconSvg from '@/assets/svg/audio-www.svg';
	import FileIconSvg from '@/assets/svg/file.svg';
	import VideoIconSvg from '@/assets/svg/video.svg';
	import ExternalVideoIconSvg from '@/assets/svg/video-www.svg';
	import ImageIconSvg from '@/assets/svg/image.svg';
	import DotProgress from '@/components/notes/DotProgress';

	export default {
		mixins: [addNoteMixin],
		props: {
			horseId: {
				required: false,
				type: Number,
				default: null,
			},
			noteId: {
				required: false,
				type: Number,
				default: null,
			},
			hasCancel: {
				required: false,
				type: Boolean,
				default: false
			},
			isReply: {
				required: false,
				type: Boolean,
				default: false
			}		
		},
		components: {
			AudioIconSvg,
			ExternalAudioIconSvg,
			FileIconSvg,
			VideoIconSvg,
			ExternalVideoIconSvg,
			ImageIconSvg,
			DotProgress
		},
		computed: {
			fileInputId() {
				if(this.horseId) return `attachment_horse_${this.horseId}`;

				return `attachment_${this.noteId}`;
			},
			postUrl() {
				if(this.horseId) return `${process.client ? window.location.origin : ''}/w-api/api/horses/${this.horseId}/notes`;

				return `${process.client ? window.location.origin : ''}/w-api/api/notes/${this.noteId}/replies`;
			},
			attachmentUploadedSize() {
				if(this.attachment) {
					return this.attachment.file.size * (this.file.fileProgress / 100);
				}
				return null;
				
			}
		}
	}
</script>

<style>
	.add-reply {
		margin-left: 58px;
	}

	.add-new-note__form {
		background: white;
		padding: 20px;
	}

	.upload-details {
		display: flex;
		align-items: center;

		/*set to column at xs*/
	}

	.upload-details p {
		font-size: 13px;
		word-break: break-all;
	}

	.upload-details__copy {
		flex: 1;
	}
</style>