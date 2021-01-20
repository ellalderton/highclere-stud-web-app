<template>
  	<div class="[ container-fluid container--page ] [ pt-4 ]">
        <page-heading>
        	<template slot="backButton">
                <back-button/>
            </template>
            Your Profile
        </page-heading>

        <div class="profile [ pt-2 ]">           
        	<profile-avatar :user="user"/>
            <hr>
            <change-password/>           
        </div>
    </div> 
</template>

<script>
	import ProfileAvatar from '@/components/general/ProfileAvatar';
	import ChangePassword from '@/components/general/ChangePassword';

	export default {
		components: {
			ProfileAvatar,
			ChangePassword
		},
		data() {
			return {
				newPassword: '',
				oldPassword: '',
				confirmPassword: ''
			}
		},
		computed: {
			user() {
				return this.$store.getters['auth/getUser'];
			},
			fullname() {
				if(!this.user) return;

				return `${this.user.first_name} ${this.user.last_name}`;
			}
		}
	}
</script>