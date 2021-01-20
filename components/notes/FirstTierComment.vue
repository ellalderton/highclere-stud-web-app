<template>
	<li class="comments__comment">
        <comment 
		    :note="comment" 
		    :key="comment.id"
		    v-on:minusReadComment="minusReadComment"
		    v-on:addReadComment="addReadComment"
		    :canReply="false" 
		></comment>
	</li>		
</template>

<script>
	import Comment from '@/components/notes/Comment';
	export default {
		props: {
			comment: {
				required: true,
				type: Object
			}
		},
		components: {
			Comment
		},
		methods: {
			addReadComment() {
				this.$emit('addReadComment');	
			},
			minusReadComment() {
				this.$emit('minusReadComment');	
			}
		}
	}
</script>