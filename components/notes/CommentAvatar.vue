<template>
	<div 
		class="comments__avatar" 
		:style="style" 
		aria-hidden="true" 
		role="presentation"
	>
		<p v-if="!user.avatar_url">
			{{ userInitials | uppercase }}
		</p>
	</div>
</template>

<script>
	export default {
		props: {
			user: {
				required: true,
				type: Object
			}
		},
		computed: {
			userInitials() {
				return `${this.user.first_name.charAt(0)}${this.user.last_name.charAt(0)}`;
			},
			style() {
				return this.user.avatar_url ? `background-image: url('${this.user.avatar_url}?w=80&h=80');` : '';
			}
		}
	}
</script>