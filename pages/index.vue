<template>
	<main>
		<img class="auth__brand-image [ mb-4 ]" src="/images/login-logo.png" alt="Highclere Stud">

		<form class="auth__form" @submit.prevent="submit">
			<div class="form-group">
				<label for="email" class="sr-only">Email</label>
				<input
					id="email"
					class="form-control"
					type="text"
					v-model.trim="form.email"
			    	@change="$v.form.email.$touch()"
					placeholder="Email address"
					:state="!$v.form.email.$error && null"
				>
				<div class="form-invalid-feedback" id="emailFeedback" v-if="$v.form.email.$error">
		        	Please enter a valid email address
		      	</div>
		    </div>

			<div class="form-group">
				<label for="password" class="sr-only">Password</label>
				<input
					id="password"
					class="form-control"
					type="password"
					v-model.trim="$v.form.password.$model"
					placeholder="Password"
					:state="!$v.form.password.$error && null"
				>
				<div class="form-invalid-feedback" id="passwordFeedback" v-if="$v.form.password.$error">
		        	Please enter a password
		      	</div>
		    </div>

			<input type="submit" :disabled="$v.form.$invalid" class="btn-secondary btn-block btn" value="Login">

			<nuxt-link class="auth__footer-link" to="/password">Forgotten Password</nuxt-link>

			<div class="auth__new-user">
				<p class="auth__new-user__heading">New User?</p>
				<app-button block white url="/register">Register with code</app-button>
			</div>
		</form>
	</main>
</template>

<script>
	import { required, email } from 'vuelidate/lib/validators';
	import { brandDetails }  from '~/siteConfig';

	export default {
		middleware: ['check-auth', 'login-auth'],
		layout: 'login',
		data() {
			return {
				form: {
					email: '',
					password: '',
				},
				brandDetails: null
			}
		},
		validations: {
			form: {
				email: {
					required,
					email
				},
				password: {
					required,

				}
			}
		},
		created() {
			this.brandDetails = brandDetails;
		},
		mounted() {
			if(this.$route.query.registered) {
				this.hasRegistered();
			}
		},
		methods: {
			submit() {
				this.$store.dispatch('auth/authenticateUser', this.form)
				.then(() => {
					this.$router.push('/horses');
				})
				.catch(err => {
					this.$swal({
                       	type: 'error',
                       	text: err.response.data.message,
                       	backdrop: `
    						rgba(12, 12, 12, 0.68);
    					`
                   });
				});
			},
			hasRegistered() {
				this.$swal({
                   	type: 'success',
                   	text: 'You have successfully registered. Please use your password to log in to the app.',
                   	backdrop: `
						rgba(12, 12, 12, 0.68);
					`
               	});
			}
		}
	}
</script>