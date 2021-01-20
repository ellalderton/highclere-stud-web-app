const handleApiErrorMixin = {
	methods: {
		handleApiError(e) {
			window.bugsnagClient.notify(e)
			if(this.apiErrors) return;

            this.apiErrors = true;
            this.$swal({
                type: 'error',
                text: 'Unable to connect to API. Please login and try again.',
                backdrop: `
                    rgba(12, 12, 12, 0.68);
                `
           });
            this.$store.dispatch('auth/logout');
            this.$router.push('/');
		}
	}
}

export default handleApiErrorMixin;