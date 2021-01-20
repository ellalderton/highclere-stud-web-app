<template>
	<div :class="{'list-item__bottom': hasSideBtns}">
        <div :class="{'list-item__bottom-main' : hasSideBtns}">
			<client-only>
				<swipe-out
					ref="note"
					:note="note"
					:is-read="note.is_read"
					v-on:read="markAsRead"
					v-on:unread="markAsUnread"
					:dropDownOpen="showDropDown || mediaClicked"
				>
					<template slot="left">
						<div class="read"><read-icon-svg style="fill: white;"/></div>
					</template>
					<template slot="right">
						<div class="unread"><unread-icon-svg style="fill: white;"/></div>
					</template>
					<template>
						<div
							class="panel panel--squared"
							:class="{'panel--unread': !note.is_read, 'panel--read': note.is_read}"
						>
						    <div class="panel__header">
						        <div class="panel__headings">
						            <h3 class="panel__heading">{{ note.title }}</h3>
						            <h4 class="panel__sub-heading">
						            	from {{ note.user.first_name }} {{ note.user.last_name }}
						            	{{ note.created_at | formattedDate }}
						            </h4>
						        </div>
						        <div class="panel__header-buttons">
						            <div
						            	class="[ panel__header-button panel__header-button--comments ] "
						            	:class="{'panel__header-button--comments--read': !note.unread_comment_count}"
						            	@click.prevent="unreadCommentsClicked"
						            >
						                <bubble-icon-svg/>
						                <span class="panel__header-button-suffix">
						                	<template v-if="note.unread_comment_count">{{ note.unread_comment_count }}</template>
						                	<span class="sr-only"> comments</span>
						                </span>
						            </div>
						            <div class="dropdown dropleft" v-on-clickaway="handleClickOutside">
						                <button type="button" class="panel__header-button panel__header-button--dropdown" id="panel-dropdown-1"
						                    data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" @click.prevent="showDropDown = !showDropDown">
						                    <dropdown-dots-icon-svg/>
						                </button>
						                <div class="dropdown-menu" :class="{'show': showDropDown}" aria-labelledby="panel-dropdown-1">
						                    <a class="dropdown-item" @click.prevent="markAsReadBtn" href="#" v-if="!note.is_read">
						                        <email-open-icon-svg/>
						                        Mark as read
						                    </a>
						                    <a class="dropdown-item" @click.prevent="markAsUnreadBtn" href="#" v-else>
						                        <email-close-icon-svg/>
						                        Mark as unread
						                    </a>
						                    <nuxt-link
						                    	v-if="canAddNotes"
						                    	class="dropdown-item"
						                    	:to="`/horse/${note.horse.id}/notes/${note.id}`"
						                    >
						                    	<reply-icon-svg/>
						                    	Reply
						                    </nuxt-link>
						                    <a class="dropdown-item" @click.prevent="copyBodyText" href="#" v-if="note.body">
						                    	<clipboard-icon-svg/>
						                        Copy to Clipboard
						                    </a>
						                </div>
						            </div>
						        </div>
						    </div>
						    <div class="panel__body">
						    	<div class="generic-content">
						        	<p class="note__body">{{ note.body }}</p>

									<div v-if="note.attachment" @click.prevent="setMediaClicked" style="display: inline-block;">
							        	<media-item :media="note.attachment" single />
								    </div>
						        </div>
						    </div>
						</div>
					</template>
				</swipe-out>
			</client-only>
		</div>
		<div class="list-item__bottom-buttons" v-if="hasSideBtns">
            <div class="block-btn-group">
                <app-button @btn-click="markAsReadBtn" primary block v-if="!note.is_read">
                	Mark as read
                </app-button>
                <app-button @btn-click="markAsUnreadBtn" grey block v-else>
                	Mark as unread
                </app-button>
                <app-button style="margin-top: 15px;" block white :url="`/horse/${note.horse.id}/notes`">
                	View all notes
                </app-button>
            </div>
        </div>
	</div>
</template>

<script>
	import SwipeOut from '@/components/general/SwipeOut';
	import MediaItem from '@/components/media/MediaItem';
	import BubbleIconSvg from '@/assets/svg/bubble.svg';
	import ClipboardIconSvg from '@/assets/svg/copy-to-clipboard.svg';
	import DropdownDotsIconSvg from '@/assets/svg/dropdown-dots.svg';
	import EmailOpenIconSvg from '@/assets/svg/email-open.svg';
	import EmailCloseIconSvg from '@/assets/svg/email-closed.svg';
	import ReplyIconSvg from '@/assets/svg/reply.svg';

	import ReadIconSvg from '@/assets/svg/envelop-opened.svg';
	import UnreadIconSvg from '@/assets/svg/envelop-closed.svg';

	import { mixin as clickaway } from 'vue-clickaway';

	export default {
		mixins: [ clickaway ],
		components: {
			SwipeOut,
			BubbleIconSvg,
			ClipboardIconSvg,
			DropdownDotsIconSvg,
			EmailOpenIconSvg,
			EmailCloseIconSvg,
			MediaItem,
			ReplyIconSvg,
			ReadIconSvg,
			UnreadIconSvg
		},
		data() {
			return {
				showDropDown: false,
				mediaClicked: false,
			}
		},
		props: {
			note: {
				required: true,
				type: Object
			},
			hasSideBtns: {
				required: false,
				type: Boolean,
				default: true
			},
			withAttachment: {
				required: false,
				type: Boolean,
				default: false
			},
			fullNote: {
				required: false,
				type: Boolean,
				default: false
			}
		},
		computed: {
			commentBadge() {
				if(this.note.unread_comment_count > 0) {
					return `${this.note.unread_comment_count} unread comment(s)`;
				}

				return `${this.note.comment_count} total comments`;
			},
			canAddNotes() {
				return this.$store.getters['auth/getCanAddNotes'];
			}
		},
		methods: {
			markAsReadBtn() {
				this.handleClickOutside();
				this.$store.dispatch('notes/markAsRead', this.note.id)
				.then((result) => {
					this.markAsRead();
				});
			},
			markAsUnreadBtn() {
				this.handleClickOutside();
				this.$store.dispatch('notes/markAsUnread', this.note.id)
				.then((result) => {
					this.markAsUnread();
				});
			},
			markAsRead() {
				if(this.note.is_read) return;

				this.note.is_read = true;
				this.$store.commit('auth/minusUnreadNotes');
				this.$store.commit('horses/minusReadNotes', this.note.horse);

				this.$emit('minusReadNotes');

			},
			markAsUnread() {
				if(!this.note.is_read) return;

				this.note.is_read = false;
				this.$store.commit('auth/addUnreadNotes');
				this.$store.commit('horses/addReadNotes', this.note.horse);

				this.$emit('addReadNotes');
			},
			handleClickOutside() {
      			if(this.showDropDown) {
        			this.showDropDown = false;
      			}
      		},
      		unreadCommentsClicked() {
      			this.$emit('unreadCommentsClicked');
      			this.$router.push(`/horse/${this.note.horse.id}/notes/${this.note.id}`);
      		},
      		setMediaClicked() {
      			this.mediaClicked = true;
      			setTimeout(() => {
      				this.mediaClicked = false;
      			}, 300);
      		},
      		copyBodyText() {
      			this.handleClickOutside();

      			var dummy = document.createElement("input");
				// Add it to the document
				document.body.appendChild(dummy);
				// Set its ID
				dummy.setAttribute("id", "dummy_id");
				// Set its value to the note body
				document.getElementById("dummy_id").value = this.note.body;
				// Select it
				dummy.select();
				// Copy its contents
				document.execCommand("copy");
				// Remove it as its not needed anymore
				document.body.removeChild(dummy);
      		}
		}
	}
</script>

<style>
	.note__body {
	    white-space: pre-line;
	}
</style>