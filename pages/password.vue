<template>
	<div>
		<img class="auth__brand-image" src="/images/login-logo.png" alt="Tweenhills Syndicate">
	    <form class="auth__form" @submit.prevent="submit">
	    	<div class="form-group">
		        <input
		        	class="form-control"
		        	type="text"
		        	v-model="form.email"
		        	@change="$v.form.email.$touch()"
					placeholder="Email address"
					:state="!$v.form.email.$error && null"
			    	aria-describedby="emailFeedback"
		        >
		        <div class="form-invalid-feedback" id="emailFeedback" v-if="$v.form.email.$error">
		        	Please enter a valid email address
		      	</div>
		    </div>

			<input type="submit" :disabled="$v.form.$invalid" class="[ login__button ] btn-secondary btn-block btn" value="Send Password Link">

	        <nuxt-link class="auth__footer-link" to="/">Back to login</nuxt-link>
	    </form>
	</div>
</template>

<script>
	import { required, email } from 'vuelidate/lib/validators';
	import { brandDetails }  from '~/siteConfig';

	export default {
		layout: 'login',
		middleware: ['check-auth', 'login-auth'],
		data() {
			return {
				form: {
					email: ''
				},
				brandDetails: null
			}
		},
		validations: {
			form: {
				email: {
					required,
					email
				}
			}
		},
		created() {
			this.brandDetails = brandDetails;
		},
		methods: {
			submit() {
				this.$axios.$post(`${process.client ? window.location.origin : ''}/w-api/api/reset-password/token`, this.form)
				.then((res) => {

                   	this.$swal({
                       	type: 'success',
                       	text: 'An email will be sent to you with a link to set your password.\nThe link in the email is only valid for 1 hour',
                       	backdrop: `
    						rgba(12, 12, 12, 0.68);
    					`
                   });

                   this.form.email = '';
				}, (err) => {
                   this.$swal({
                       	type: 'success',
                       	text: 'An email will be sent to you with a link to set your password.',
                       	backdrop: `
    						rgba(12, 12, 12, 0.68);
    					`
                   });
                   this.form.email = '';
               	});
			}
		}
	}
</script>