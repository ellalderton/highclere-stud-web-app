const goToNotesMixin = {
  methods: {
    goToNotes() {
      this.$store.commit('notes/resetPagination');
      this.$store.commit('notes/clearFilters');
      this.$nuxt.$emit('comment_clicked');
      this.$router.push('/notes/horses');
    }
  }
}

export default goToNotesMixin;
