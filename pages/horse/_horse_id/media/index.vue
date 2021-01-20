<template>
	<div class="[ container-fluid container--page ] [ pt-4 ]">

		<page-heading>
			<template slot="backButton">
                <back-button/>
            </template>
            Media
            <template slot="sub">
            	Last updated {{ horse.updated_at | formattedDate }}
            </template>
        </page-heading>

        <div class="mb-3">
        	<div class="list-item list-item--note-tab">
	        	<horse-note-details :horse="horse"/>
	        </div>
	    </div>

		<div class="row">
	        <div class="col-12 col-lg-8">
				<template v-if="isMobile">
					<div class="block-btn-group">
			    		<app-button block black :url="`/horse/${horse.id}`">View horse profile</app-button>
			    	</div>
			    	<hr>
				</template>

	            <ul class="nav nav-tabs">
	                <li class="nav-item">
	                    <a
	                    	href="#"
	                    	@click.prevent="setFilter(null)"
	                    	class="nav-link"
							:class="{'active' : !filter}"
	                        :aria-selected="!filter"
	                    >All</a>
	                </li>
	                <li class="nav-item">
	                    <a
	                    	href="#"
							@click.prevent="setFilter('image')"
	                    	class="nav-link"
	                    	:class="{'active' : filter === 'image'}"
	                        :aria-selected="filter === 'image'"
	                   	>Images</a>
	                </li>
	                <li class="nav-item">
	                    <a
	                    	href="#"
	                    	@click.prevent="setFilter('video')"
	                    	class="nav-link"
	                    	:class="{'active' : filter === 'video'}"
	                        :aria-selected="filter === 'video'"
	                    >Video</a>
	                </li>
	                <li class="nav-item">
	                    <a
	                    	href="#"
	                    	@click.prevent="setFilter('audio')"
	                    	class="nav-link"
	                    	:class="{'active' : filter === 'audio'}"
	                        :aria-selected="filter === 'audio'"
	                    >Audio</a>
	                </li>
	                <li class="nav-item">
	                    <a
	                    	href="#"
	                    	@click.prevent="setFilter('document')"
	                    	class="nav-link"
	                    	:class="{'active' : filter === 'document'}"
	                        :aria-selected="filter === 'document'"
	                    >Files</a>
	                </li>
	            </ul>

	            <div class="tab-content tab-content--boxed">
	                <div class="tab-pane fade show active">
	                    <transition-group
	                    	v-if="mediaFiltered.length"
	                    	tag="ul"
	                    	name="list-media"
	                    	class="[ grid--1 grid--md-2 ] [ list-unstyled ]"
	                    >
	                    	<media-item v-for="media in mediaFiltered" :media="media"  :key="media.id"/>
	                    </transition-group>
	                </div>
	            </div>
	        </div>

	        <div class="[ col-12 col-lg-4 ] [ mt-3 mt-lg-0 ] [ flow-vertical ]" v-if="!isMobile">
	        	<div class="sticky-sidebar">
	        		<div class="block-btn-group">
	            		<app-button block black :url="`/horse/${horse.id}`">View horse profile</app-button>
	            	</div>
	            </div>
	        </div>
	    </div>
	</div>
</template>

<script>
import { sortBy as _sortBy, filter as _filter } from 'underscore';
import HorseNoteDetails from '@/components/notes/HorseNoteDetails';
import MediaItem from '@/components/media/MediaItem';

	export default {
		scrollToTop: true,
		data() {
			return {
				filter: null,
				isMobile: false
			}
		},
		async asyncData({ store, params, error }) {
			try {
				let [horse, images, videos, audios, documents] = await Promise.all([
					store.dispatch('horse/getHorse', params.horse_id),
					store.dispatch('horse/getImages', params.horse_id),
					store.dispatch('horse/getVideos', params.horse_id),
					store.dispatch('horse/getAudio', params.horse_id),
					store.dispatch('horse/getDocuments', params.horse_id),
				]);
				return { horse, images, videos, audios, documents }
			} catch(e) {
				error({ statusCode: 404, message: 'Horse not found' });
			}
		},
		components: {
			HorseNoteDetails,
			MediaItem
		},
		computed: {
			media() {
				let media = this.images.concat(this.videos).concat(this.audios).concat(this.documents);

				return _sortBy(media, (item) => {
					return item.created_at;
				}).reverse();
			},
			mediaFiltered() {
				if(!this.filter) return this.media;

				return _filter(this.media, (mediaItem) => {
					return mediaItem.type === this.filter ||
						mediaItem.type === `${this.filter}-url`;
				});
			}
		},
		mounted() {
            if (process.browser) {
                window.onNuxtReady((app) => {
                    this.isMobileWidth();
                });

                this.isMobileWidth();
            }

            window.addEventListener('resize', this.isMobileWidth);
        },
        beforeDestroy() {
            this.$nuxt.$off('reload_page');

            window.removeEventListener('resize', this.isMobileWidth);
        },
		methods: {
			showMediaAudio(mediaItem, posterUrl) {
				mediaItem.posterUrl = `${this.horse.avatar_url}?w=600`;
				this.showMedia(mediaItem);
			},
			setFilter(type) {
				this.filter = type;
			},
			isMobileWidth() {
                if(typeof window !== 'undefined') {
                    if(window.innerWidth < 992) {
                        this.isMobile = true;
                        return;
                    }
                }
                this.isMobile = false;
            }
		}
	}
</script>

<style>
	.media-item__item {
	  transition: all 0.2s;
	}
	.list-media-enter, .list-media-leave-to {
	  opacity: 0;
	  transform: translateY(50px);
	}
	.list-media-leave-active {
	  position: absolute;
	}
	.nav-tabs {
		overflow: hidden;
	}
</style>