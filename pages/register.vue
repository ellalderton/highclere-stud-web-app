<template>
	<div>
		<img class="auth__brand-image" src="/images/login-logo.png" alt="Tweenhills">
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

		    <div class="form-group">
		        <input
		        	class="form-control"
		        	type="text"
		        	v-model="form.code"
		        	@change="$v.form.code.$touch()"
					placeholder="Registration Code"
					:state="!$v.form.code.$error && null"
			    	aria-describedby="codeFeedback"
		        >
		        <div class="form-invalid-feedback" id="codeFeedback" v-if="$v.form.code.$error">
		        	Please enter your registration code
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
		        	Please enter a password of at least 6 characters
		      	</div>
		    </div>

		    <div class="form-group">
				<label for="password" class="sr-only">Confirm Password</label>
				<input
					id="password_confirmation"
					class="form-control"
					type="password"
					v-model.trim="$v.form.password_confirmation.$model"
					placeholder="Confirm Password"
					:state="!$v.form.password_confirmation.$error && null"
				>
				<div class="form-invalid-feedback" id="passwordConfirmationFeedback" v-if="$v.form.password_confirmation.$error">
		        	Does not match your password.
		      	</div>
		    </div>

			<input type="submit" :disabled="$v.form.$invalid" class="[ login__button ] btn-primary btn-block btn" value="Register">

	        <nuxt-link class="auth__footer-link" to="/">Back to login</nuxt-link>
	    </form>
	</div>
</template>

<script>
	import { required, email, minLength, sameAs } from 'vuelidate/lib/validators';

	export default {
		layout: 'login',
		middleware: ['check-auth', 'login-auth'],
		data() {
			return {
				form: {
					email: '',
					code: '',
					password: '',
					password_confirmation: ''
				}
			}
		},
		validations: {
			form: {
				email: {
					required,
					email
				},
				code: {
					required
				},
				password: {
					required,
					minLength: minLength(6)
				},
				password_confirmation: {
					required,
					sameAsPassword: sameAs('password')
				}
			}
		},
		methods: {
			submit() {
				this.$axios.$post(`/w-api/api/users`, this.form)
				.then((res) => {
					this.$router.push('/?registered=true');
				}, (err) => {
                   this.$swal({
                       	type: 'error',
                       	text: 'Unable to register. Please check your details are correct.',
                       	backdrop: `
    						rgba(12, 12, 12, 0.68);
    					`
                   });
               	});
			}
		}
	}
</script>