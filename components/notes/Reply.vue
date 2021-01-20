<template>
	<div>		
		<div class="reply" :class="{ indent: level === 2 }">		
			<h4>{{ reply.title }}</h4>
			<span>from {{ reply.user.first_name }} {{ reply.user.last_name }}</span>
			<span>{{ reply.created_at | relativeTime }}</span>

			<button 
				v-if="level === 1"
				class="btn btn-primary" 
				@click.prevent="openAddComment"
			>Reply</button>

			<div class="reply__body">
				<span style="white-space: pre-line;">{{ reply.body }}</span>

				<img 
					v-if="reply.attachment && reply.attachment.type === 'image'"
					:src="`${reply.attachment.url}?w=400`" 
					:alt="reply.attachment.title"
					style="width: 200px; display: block;"
					@click.prevent="showMedia(reply.attachment)"
				>
			</div>
		</div>

		<template v-if="reply.replies && reply.replies.length">
			<note-reply 
				v-for="childReply in reply.replies" 
				:reply="childReply" 
				:level="2"
				:key="childReply.id"
			/>
		</template>

		<template v-if="level === 1">
			<TransitionFade>
				<add-comment
					:id="`addcommentform-${reply.id}`" 
					v-if="showAddComment"
					:note-id="reply.id"
					v-on:posted="replyPosted"
					v-on:cancelled="showAddComment = false"
					:has-cancel="true"
				/>
			</TransitionFade>
		</template>	
	</div>
</template>

<script>
	import AddComment from '@/components/notes/AddComment';
	import VueScrollTo from 'vue-scrollto';

	export default {
		name: 'note-reply',
		data() {
			return {
				showAddComment: false,
			}
		},
		props: {
			reply: {
				required: true,
				type: Object
			},
			level: {
				required: false,
				default: 1,
				type: Number
			}
		},
		components: {
			AddComment,
			VueScrollTo
		},
		methods: {
			replyPosted() {
				this.showAddComment = false;
				this.$emit('posted');
			},
			openAddComment() {
				this.showAddComment = true;
				this.$nextTick().then(() => {
					VueScrollTo.scrollTo(`#addcommentform-${this.reply.id}`, 500, {
						offset: -50
					});
				});
				
			}
		}
	}
</script>

<style>
	.indent {
		margin-left: 200px;
	}
</style>