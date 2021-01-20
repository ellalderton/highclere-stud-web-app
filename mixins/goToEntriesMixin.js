const goToEntriesMixin = {
	methods: {
		goToEntries() {
			this.$store.commit('entries/resetPagination');
			this.$router.push('/entries');
		}
	}
}

export default goToEntriesMixin;