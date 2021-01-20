<template>
	<div>
		<div class="loader__container">
			<div class="loader"></div>	
		</div>
		<p v-if="copy.length" class="loader__copy">{{ copy }}</p>
	</div>
	
</template>

<script>
	export default {
		props: {
			copy: {
				required: false,
				type: String,
				default: ''
			}
		}
	}
</script>