<template>
	<div class="[ container-fluid container--page ] [ pt-4 ]">

		<page-heading>
			<template slot="backButton">
                <back-button/>
            </template>
            {{ totalNotes }} {{ 'Note' | pluralize(totalNotes) }}
            <template slot="sub">
            	Last updated {{ horse.updated_at | formattedDate }}
            </template>
        </page-heading>

		<div class="row">
            <div class="col-12 [ mb-3 ]">
            	<div class="list-item list-item--note-tab">
            		<horse-note-details :horse="horse"/>
            	</div>
			</div>
            <div class="col-12 col-lg-8 [ flow-vertical ]">
				<template v-if="isMobile">
            		<div class="block-btn-group">
	            		<app-button :url="`/horse/${horse.id}`" block white>
	            			View Horse Profile
	            		</app-button>
		                <app-button
		                	v-if="canAddNotes"
		                	:url="`/notes/create?id=${horse.id}`"
		                	block primary hasIcon
		                	style="margin-top: 15px"
		                >
		                	<note-icon-svg/>
		                    Add a new note
		                </app-button>
		            </div>
				</template>

            	<template v-for="note in orderedNotes" v-show="orderedNotes.length">
            		<div id="notes-container">
	            		<note-item
						    :note="note"
						    :key="note.id"
						    v-on:minusReadNotes="minusReadNotes"
						    v-on:addReadNotes="addReadNotes"
						    :hasSideBtns="false"
						></note-item>
					</div>
            	</template>

            	<pagination
					v-show="totalPages > 1"
					:last-page="parseInt(totalPages)"
					:current-page="parseInt(pagination)"
					v-on:pageChanged="paginate"
				/>
            </div>

            <div class="col-12 col-lg-4 [ flow-vertical ]" v-if="!isMobile">
            	<div class="sticky-sidebar">
            		<div class="block-btn-group">
	            		<app-button :url="`/horse/${horse.id}`" block white>
	            			View Horse Profile
	            		</app-button>
		                <app-button
		                	v-if="canAddNotes"
		                	:url="`/notes/create?id=${horse.id}`"
		                	block primary hasIcon
		                	style="margin-top: 15px"
		                >
		                	<note-icon-svg/>
		                    Add a new note
		                </app-button>
		            </div>
	            </div>
            </div>
        </div>
	</div>
</template>

<script>
import { sortBy as _sortBy } from 'underscore';
import HorseNoteDetails from '@/components/notes/HorseNoteDetails';
import NoteItem from '@/components/notes/NoteItem';
import NoteIconSvg from '@/assets/svg/note.svg';
import VueScrollTo from 'vue-scrollto';

	export default {
		scrollToTop: true,
		middleware: ['can-see-notes'],
		async asyncData({ store, params, error }) {
			try {
				let [horse, notes] = await Promise.all([
					store.dispatch('horse/getHorse', params.horse_id),
					store.dispatch('horse/getNotes', { id: params.horse_id, pagination: 1 }),
				]);
				return {
					horse,
					notes: notes.data,
					totalPages: notes.meta.last_page,
					totalNotes: notes.meta.total
				}
			} catch(e) {
				error({ statusCode: 404, message: 'Horse not found' });
			}
		},
		data() {
			return {
				isMobile: false,
				totalPages: 0,
				totalNotes: 0,
				pagination: 1
			}
		},
		components: {
			HorseNoteDetails,
			NoteItem,
			NoteIconSvg
		},
		created() {
            // if mark everything as read is clicked, we'll reload the page data
            this.$nuxt.$on('reload_page', () => {
            	this.pagination = 1;
                this.getNotes();
            });
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
        computed: {
        	orderedNotes() {
        		if(!this.notes) return [];

        		return this.notes;
        		// order by created_at desc, then uread note, with those with unread comments first.
				// return _sortBy(_sortBy(_sortBy(this.notes, 'updated_at'), note => {
				// 	return note.is_read === false;
				// }), 'unread_comment_count').reverse();
			},
			canAddNotes() {
                return this.$store.getters['auth/getCanAddNotes'];
            }
        },
		methods: {
			async getNotes() {
				const result = await this.$store.dispatch('horse/getNotes', { id: this.horse.id, pagination: this.pagination });
				this.notes = result.data;
				this.totalPages = result.meta.last_page;
				this.totalNotes = result.meta.total

				this.$nextTick(() => {
					VueScrollTo.scrollTo(`#notes-container`, 10, {offset: -50,});
				});
			},
			noteBtnCopy(note) {
				return note.comment_count ? 'View Note and Comments' : 'View Note';
			},
			addReadNotes() {
				this.horse.unread_notes_count++;
			},
			minusReadNotes() {
				this.horse.unread_notes_count--;
			},
			isMobileWidth() {
                if(typeof window !== 'undefined') {
                    if(window.innerWidth < 992) {
                        this.isMobile = true;
                        return;
                    }
                }
                this.isMobile = false;
            },
            async paginate(pageNum) {
            	this.pagination = pageNum;
            	this.notes = null;
            	this.getNotes();
            }
		}
	}
</script>