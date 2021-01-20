<template>
	<li class="media-item__item" :class="{'media-item__item--onNote': single}">
		<a href="" class="media-item" :class="{'media-item--boxed': !single}" @click.prevent="showMedia(media)">
			<div 
				class="media-item__decor" 
				aria-hidden="true" 
				role="presentation"
			>
				<img 
					v-if="media.type === 'image'"
					class="media-item__image" 
					:src="`${$options.filters.assetUrl(media.url)}?w=110&h=110`" 
					:alt="media.title"
				>
				<template v-if="media.type === 'video'">
	    			<video-icon-svg/>
	    		</template>
	    		<template v-if="media.type === 'video-url'">
	    			<external-video-icon-svg/>
	    		</template>
	    		<template v-if="media.type === 'audio'">
	    			<audio-icon-svg/>
	    		</template>
	    		<template v-if="media.type === 'audio-url'">
	    			<external-audio-icon-svg/>
	    		</template>
	    		<template v-if="media.type === 'document'">
	    			<file-icon-svg/>
	    		</template>
			</div>


	        <div class="media-item__main" v-if="!single">
	        	<div class="media-item__filename">{{ media.title }}</div>
               	<p class="media-item__meta">{{ media.updated_at | formattedDate }}</p>
	 	    </div>
	 	</a>    
    </li>
</template>

<script>
	import AudioIconSvg from '@/assets/svg/audio.svg';
	import ExternalAudioIconSvg from '@/assets/svg/audio-www.svg';
	import FileIconSvg from '@/assets/svg/file.svg';
	import VideoIconSvg from '@/assets/svg/video.svg';
	import ExternalVideoIconSvg from '@/assets/svg/video-www.svg';

	export default {
		props: {
			media: {
				required: true,
				type: Object
			},
			single: {
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
			ExternalVideoIconSvg
		}
	}
</script>