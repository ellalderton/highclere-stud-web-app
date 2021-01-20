<template>
    <div class="container-fluid" v-if="user">
        <div class="welcome-back [ pt-3 pb-3 ] [ mt-sm-3 mb-sm-3 ]">
            <div class="welcome-back__avatar-border">
                <img
                    v-if="user.avatar_url"
                    class="off-canvas-nav__user-avatar img-fluid rounded-circle"
                    :src="`${user.avatar_url}?w=150&h=150`"
                    alt="User avatar"
                >
                <div
                    v-else
                    class="welcome-back__avatar"
                    aria-hidden="true"
                    role="presentation"
                >
                    <p>{{ userInitials | uppercase }}</p>
                </div>
            </div>

            <div class="welcome-back__content">
                <h1>Hi {{ user.first_name }},</h1>
                <h3>Welcome back</h3>
                <app-button 
                    url="/profile"
                    additional-classes="mt-3 px-2"
                    primary block
                >View profile</app-button>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        computed: {
            user() {
                return this.$store.getters['auth/getUser'];
            },
            userInitials() {
                if(!this.user) return '';

                return `${this.user.first_name.charAt(0)}${this.user.last_name.charAt(0)}`;
            }
        }
    }
</script>
