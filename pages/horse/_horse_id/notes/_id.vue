<template>
	<div class="[ container-fluid container--page ] [ pt-4 ]">

		<page-heading>
			<template slot="backButton">
                <back-button/>
            </template>
            {{ note.title }}
            <template slot="sub">
            	Last updated {{ note.updated_at | formattedDate }}
            </template>
        </page-heading>

		<div class="mb-3">
	        <div class="list-item list-item--note-tab">
	    		<horse-note-details :horse="horse"/>
	    	</div>
	    </div>

	    <template v-if="isMobile">
	    	<div class="block-btn-group">
		    	<app-button block black :url="`/horse/${horse.id}`">View Horse Profile</app-button>
		        <app-button style="margin-top: 15px" block primary v-on:btn-click="markAllAsRead">
		            Mark all as read
		        </app-button>
		        <app-button style="margin-top: 15px" :url="`/horse/${horse.id}/notes`" block black>
		            View all notes
		        </app-button>
		    </div>

		    <hr>
	    </template>

        <div class="row">
            <div class="col-12 col-lg-8">
	            <div class="panel">
					<note-item
					    :note="note"
					    :key="note.id"
					    v-on:minusReadNotes="minusReadNotes"
						 v-on:addReadNotes="addReadNotes"
					    :hasSideBtns="false"
					    :withAttachment="true"
					    fullNote
					    class="mb-4"
					    v-on:unreadCommentsClicked="scrollToUnreadComment"
					></note-item>

					<ul v-if="replies.length" class="[ comments ] [ mb-3 ]">
	                	<first-tier-comment
	                		:comment="reply"
	                		v-for="reply in orderedReplies"
	                		:key="reply.id"
	                		v-on:replyPosted="replyPosted"
	                		v-on:minusReadComment="minusReadComment"
			    			v-on:addReadComment="addReadComment"
	                	/>
	                </ul>

					<template>
						<hr>

		                <transition-fade>
		                	<add-comment
		                		:note-id="note.id"
		                		v-on:posted="replyPosted"
		                		:is-comment="true"
		                	/>
		                </transition-fade>
					</template>
	            </div>
			</div>

			<div class="col-12 col-lg-4 [ flow-vertical ]" v-if="!isMobile">
			    <div class="sticky-sidebar">
			    	<div class="block-btn-group">
				    	<app-button block black :url="`/horse/${horse.id}`">View Horse Profile</app-button>
				        <app-button style="margin-top: 15px" block primary v-on:btn-click="markAllAsRead">
				            Mark all as read
				        </app-button>
				        <app-button style="margin-top: 15px" :url="`/horse/${horse.id}/notes`" block black>
				            View all notes
				        </app-button>
				    </div>
			    </div>
			</div>
		</div>



	</div>
</template>

<script>
	import Reply from '@/components/notes/Reply';
	import AddComment from '@/components/notes/AddComment';
	import FirstTierComment from '@/components/notes/FirstTierComment';
	import NoteItem from '@/components/notes/NoteItem';
	import HorseNoteDetails from '@/components/notes/HorseNoteDetails';
	import { sortBy as _sortBy } from 'underscore';
	import VueScrollTo from 'vue-scrollto';
	import handleApiErrorMixin from "@/mixins/handleApiErrorMixin.js";

	export default {
		scrollToTop: true,
		middleware: ['can-see-notes'],
		mixins: [handleApiErrorMixin],
		components: {
			AddComment,
			FirstTierComment,
			HorseNoteDetails,
			NoteItem,
			Reply,
		},
		data() {
			return {
				horse: null,
				isMobile: false
			}
		},
		async asyncData({ store, params, error }) {
			try {
				let [note, replies, horse] = await Promise.all([
					store.dispatch('notes/getNote', params.id),
					store.dispatch('notes/getReplies', params.id),
					store.dispatch('horse/getHorse', params.horse_id)
				]);
				return { note, replies, horse }
			} catch(e) {
				error({ statusCode: 404, message: 'Note not found' });
			}
		},
		computed: {
			orderedReplies() {
				return _sortBy(this.replies, 'created_at');
			},
			canAddNotes() {
				return this.$store.getters['auth/getCanAddNotes'];
			}
		},
		created() {
            // if mark everything as read is clicked, we'll reload the page data
            this.$nuxt.$on('reload_page', () => {
                this.reloadNote();
                this.reloadReplies();
                this.horse.unread_comments_count = 0;
            });

			// get user from api, so we have the correct unread notes and comments amounts.
			this.$store.dispatch('auth/user')
				.catch(error => {
					this.handleApiError(error);
				});
        },
        mounted() {
            if (process.browser) {
                window.onNuxtReady((app) => {
                    this.isMobileWidth();
                });

                this.isMobileWidth();

                this.$store.commit('horses/setUnreadCommentsAndNotes', this.horse);
            }

            window.addEventListener('resize', this.isMobileWidth);
        },
        beforeDestroy() {
            this.$nuxt.$off('reload_page');
            this.$nuxt.$off('close_all_addcomments');

            window.removeEventListener('resize', this.isMobileWidth);
        },
		methods: {
			async replyPosted() {
				this.note.comment_count++;
				this.replies = await this.$store.dispatch('notes/getReplies', this.note.id)
					.catch(error => {
						this.handleApiError(error);
					});
			},
			async reloadNote() {
				this.note = await this.$store.dispatch('notes/getNote', this.note.id)
					.catch(error => {
					this.handleApiError(error);
				});
			},
			async reloadReplies() {
				this.replies = await this.$store.dispatch('notes/getReplies', this.note.id)
					.catch(error => {
					this.handleApiError(error);
				});
			},
			showComment() {
				this.$nuxt.$emit('close_all_addcomments');
			},
			async markAllAsRead() {
				// current unread comment on note
				const unreadCommentsOnNote = this.note.unread_comment_count;

				try {
					this.$store.dispatch('notes/markAllOfNoteAsRead', this.note.id)
					.then((result) => {

						this.$store.dispatch('auth/user')
						.catch(error => {
							this.handleApiError(error);
						});

						this.reloadReplies();
						this.reloadNote();

						this.horse.unread_comments_count = this.horse.unread_comments_count - unreadCommentsOnNote;

						// update horse in vuex
						this.$store.commit('horses/setUnreadCommentsAndNotes', this.horse);

						this.$swal({
	                       	type: 'success',
	                       	text: 'All comments for this note marked as read.',
	                       	backdrop: `
	    						rgba(12, 12, 12, 0.68);
	    					`
	                   });
					});
				} catch(err) {
					this.$swal({
                       	type: 'error',
                       	text: err.response.data.message,
                       	backdrop: `
    						rgba(12, 12, 12, 0.68);
    					`
                   });
				}
			},
			minusReadComment() {
				this.note.unread_comment_count = this.note.unread_comment_count - 1;
				this.horse.unread_comments_count--;
			},
			addReadComment() {
				this.note.unread_comment_count = this.note.unread_comment_count + 1;
				this.horse.unread_comments_count++;
			},
			addReadNotes() {
				this.horse.unread_notes_count++;
			},
			minusReadNotes() {
				this.horse.unread_notes_count--;
			},
			scrollToUnreadComment() {
				if(document.getElementById("unreadComment")) {
					VueScrollTo.scrollTo(`#unreadComment`, 300, {offset: -50,});
				}
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