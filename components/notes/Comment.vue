<template>
    <div class="comments__comment-inner" :id="`${!note.is_read ? 'unreadComment' : ''}`">
        <comment-avatar :user="note.user"/>
		<div class="flex-grow-1 [ comments__comment-inner__note ]">
		<client-only>
			<swipe-out 
				ref="note"
				:note="note" 
				:is-read="note.is_read"
				v-on:read="markAsRead"
				v-on:unread="markAsUnread"
				:dropDownOpen="showDropDown"
				noClickThrough
			>
				<template slot="left">
					<div class="read"><read-icon-svg style="fill: white;"/></div>
				</template>
				<template slot="right">
					<div class="unread"><unread-icon-svg style="fill: white;"/></div>
				</template>
				<template>
					<div 
						class="comments__comment-panel panel--squared" 
						style="margin-left: 0;" 
						:class="{'panel--unread': !note.is_read, 'panel--read': note.is_read}"
					>
			            <div class="comments__comment-header">
			                <div class="comments__comment-heading">
			                    {{ note.user.first_name }} {{ note.user.last_name }} commented {{ note.created_at | relativeTime }}
			                </div>
			                <div class="comments__comment-buttons">
			                    <a class="comments__comment-button" href="" v-if="canReply" @click.prevent="addReply">
			                        <reply-icon-svg/>
			                        <span class="sr-only">
			                            Reply
			                        </span>
			                    </a>
			                   

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
						                    <!-- only if first tier comment -->
				                            <a class="dropdown-item" href="#" v-if="canReply" @click.prevent="addReply"> 
				                                <reply-icon-svg/>
				                                Reply
				                            </a>
						                </div>
						            </div>
			                </div>
			            </div>
			            <div class="comments__comment-body">
			           		<div class="generic-content">
			                	<p class="comment__body">{{ note.body }}</p>

			                	<template v-if="note.attachment">
						        	<media-item :media="note.attachment" single/>						      
							    </template>
							</div>
			            </div>
			        </div>
				</template>
			</swipe-out>
		</client-only>
		</div>
	</div>
</template>

<script>
	import SwipeOut from '@/components/general/SwipeOut';
	import MediaItem from '@/components/media/MediaItem';
	import CommentAvatar from '@/components/notes/CommentAvatar';

	import BubbleIconSvg from '@/assets/svg/bubble.svg';
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
			CommentAvatar,
			BubbleIconSvg,
			DropdownDotsIconSvg,
			EmailOpenIconSvg,
			EmailCloseIconSvg,
			MediaItem,
			ReplyIconSvg,
			ReadIconSvg,
			UnreadIconSvg
		},
		props: {
			note: {
				required: true,
				type: Object
			},
			canReply: {
				required: false,
				type: Boolean,
				default: true
			}
		},
		data() {
			return {
				showDropDown: false
			}
		},
		computed: {
			commentBadge() {
				if(this.note.unread_comment_count > 0) {
					return `${this.note.unread_comment_count} unread comment(s)`;
				}

				return `${this.note.comment_count} total comments`;
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
				this.handleClickOutside();
				if(this.note.is_read) return;

				this.note.is_read = true;

				this.$store.commit('auth/minusUnreadComments');
				this.$store.commit('horses/minusReadComments', this.note.horse);

				this.$emit('minusReadComment');	
			},
			markAsUnread() {
				if(!this.note.is_read) return;

				this.note.is_read = false;

				this.$store.commit('auth/addUnreadComments');
				this.$store.commit('horses/addReadComments', this.note.horse);

				this.$emit('addReadComment');
			},
			handleClickOutside() {
      			if(this.showDropDown) {
        			this.showDropDown = false;
      			}
      		},
      		addReply() {
      			this.handleClickOutside();
      			this.$emit('addReply');
      		}
		}
	}
</script>

<style>
	.comment__body {
	    white-space: pre-line;
	}
</style>