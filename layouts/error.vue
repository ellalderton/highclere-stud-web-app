<template>
  <div class="[ container-fluid container--page ] [ pt-4 ]">
    <page-heading v-if="error.statusCode === 404">
    	{{ errorMsg }}
    </page-heading>
    <page-heading v-else>An error occurred</page-heading>

    <div class="row [ mt-4 ]">
      <div class="col-md-6 offset-md-3">
        <app-button primary block url="/">Home</app-button>
      </div>
    </div>
    
  </div>
</template>

<script>
export default {
  props: ['error'],
  computed: {
  	errorMsg() {
  		return this.error.message ? this.error.message : 'Page not found';
  	},
  },
  created() {
    // If sent to error page and unable to get user from API then logout the user.
    this.$store.dispatch('auth/user')
     .catch(e => {
      console.log(e);
     });
  }
}
</script>