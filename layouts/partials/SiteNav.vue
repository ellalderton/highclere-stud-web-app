<template>
    <div class="off-canvas-nav" :class="{'is-active': menuOpen}" :style="navHeight" data-module="off-canvas-nav">

        <div class="off-canvas-nav__user" v-if="user">
            <nuxt-link class="text-secondary-light" to="/profile">
                <img
                    v-if="user.avatar_url"
                    class="off-canvas-nav__user-avatar off-canvas-nav__user-avatar--menu img-fluid rounded-circle"
                    :src="`${user.avatar_url}?w=150&h=150`"
                    alt="User avatar"
                >
                <div
                    v-else
                    style="width: 45px; height: 45px;"
                    class="comments__avatar"
                    aria-hidden="true"
                    role="presentation"
                >
                    <p>{{ userInitials | uppercase }}</p>
                </div>
            </nuxt-link>

            <div class="off-canvas-nav__user-body">
                <div class="text--lg font-weight-bold text-dark">
                    {{ user.first_name }} {{ user.last_name }}
                </div>
                <div class="text--sm font-weight-bold">
                    <nuxt-link class="text-secondary-light profile-link" to="/profile">View profile</nuxt-link>
                </div>
            </div>
        </div>

        <nav class="off-canvas-nav__menu" id="menu">
            <ul class="off-canvas-nav__menu-items">
                <li class="off-canvas-nav__menu-item">
                    <nuxt-link class="off-canvas-nav__menu-link" to="/entries">
                        <div>Entries &amp; Results</div>
                    </nuxt-link>
                </li>
                
                <li class="off-canvas-nav__menu-item">
                    <a class="off-canvas-nav__menu-link" href="#" @click.prevent="goToHorses">
                        <div>Horses</div>
                    </a>
                </li>

                <li v-if="canSeeNotes" class="off-canvas-nav__menu-item">
                    <a class="off-canvas-nav__menu-link" href="#" @click.prevent="goToNotes">
                        <div class="off-canvas-nav__menu-link-text off-canvas-nav__menu-link-text--has-bubble" v-if="user && user.total_notes">
                            Notes
                            <span class="[ off-canvas-nav__menu-bubble ] [ speech-bubble ]" v-if="user && user.unread_comments">
                                <bubble-icon-svg/>
                            <span class="speech-bubble__text">{{ user.unread_comments }}</span>
                        </span>
                        </div>
                        <div class="off-canvas-nav__menu-link-meta" v-if="user && user.unread_notes">
                            {{ user.unread_notes }} unread {{ 'note'| pluralize(user.unread_notes) }}
                        </div>
                    </a>
                </li>
            </ul>
        </nav>

        <div class="off-canvas-nav__bottom">
            <div class="block-btn-group">
                <app-button
                    v-if="canAddNotes && canSeeNotes"
                    url="/notes/create"
                    primary block hasIcon
                ><note-icon-svg/> Add New Note</app-button>

                <app-button
                    v-if="canSeeNotes"
                    @btn-click="markEveryAsRead"
                    primary block
                    style="margin-top: 15px"
                >Mark everything as read</app-button>

                <app-button
                     @btn-click="refreshHorses"
                     primary block
                     style="margin-top: 15px"
                >Refresh Horses</app-button>

                <app-button
                    @btn-click="logout"
                    secondary block
                    style="margin-top: 15px"
                >Sign out</app-button>
            </div>
        </div>

    </div>
</template>

<script>
    import goToHorsesMixin from "@/mixins/goToHorsesMixin.js";
    import goToNotesMixin from "@/mixins/goToNotesMixin.js";
    import BubbleIconSvg from '@/assets/svg/bubble.svg';
    import NoteIconSvg from '@/assets/svg/note.svg';

    export default {
        mixins: [goToNotesMixin, goToHorsesMixin],
        data() {
            return {
                navHeight: {
                    height: '100vh'
                },
                isIos: false
            }
        },
        props: {
            menuOpen: {
                required: true,
                type: Boolean
            }
        },
        components: {
            BubbleIconSvg,
            NoteIconSvg
        },
        mounted() {
            document.addEventListener('click', this.handleClickOutside);
            document.addEventListener('touchstart', this.handleClickOutside);

            this.updateNavHeight();
        },
        destroyed() {
            document.removeEventListener('click', this.handleClickOutside);
            document.removeEventListener('touchstart', this.handleClickOutside);
        },
        computed: {
            user() {
                return this.$store.getters['auth/getUser'];
            },
            userInitials() {
                if(!this.user) return '';

                return `${this.user.first_name.charAt(0)}${this.user.last_name.charAt(0)}`;
            },
            canSeeNotes() {
                return this.$store.getters['auth/getCanSeeNotes'];
            },
            canAddNotes() {
                return this.$store.getters['auth/getCanAddNotes'];
            }
        },
        watch: {
              menuOpen(val) {
                if(val) {
                    this.updateNavHeight();
                }
            }
        },
        methods: {
            markEveryAsRead() {
                this.$store.commit('app/closeMenu');
                try {
                    this.$store.dispatch('notes/markAllAsRead')
                        .then((result) => {
                            // emit to bus so we can reload certain pages
                            this.$nuxt.$emit('reload_page');

                            this.$swal({
                                   type: 'success',
                                   text: 'Everything marked as read.',
                                   backdrop: `
                                    rgba(12, 12, 12, 0.68);
                                `
                           });
                        });
                } catch(err) {
                    this.$swal({
                           type: 'error',
                           text: err.response.data.message,
                           backdrop: `
                            rgba(12, 12, 12, 0.68);
                        `
                   });
                }

            },
            handleClickOutside(evt) {
                  if (!this.$el.contains(evt.target) && this.menuOpen) {
                    this.$store.commit('app/closeMenu');
                  }
              },
              logout() {
                this.$store.dispatch('auth/logout', this.form)
                .then(() => {
                    this.$router.push('/');
                })
                .catch(e => {
                    alert('logout failed');
                });
            },
            updateNavHeight() {
                // set menu height to window.innerHeight to allow for iPhone address and btn bars.
                if(window.innerHeight && !window.outerHeight) {
                    this.navHeight.height = `${window.innerHeight}px`;
                } else if(window.innerHeight) {
                    this.navHeight.height = `${Math.min(window.innerHeight, window.outerHeight)}px`;
                } else {
                    this.navHeight.height = '100vh';
                }
            },
            async refreshHorses() {
                this.$store.commit('app/closeMenu');
                try {
                    await this.$store.dispatch('horses/horses', true);

                    this.$swal({
                           type: 'success',
                           text: 'Horses refreshed',
                           backdrop: `
                            rgba(12, 12, 12, 0.68);
                        `
                   });
                } catch(e) {
                    this.$swal({
                           type: 'error',
                           text: 'Unable to access Horses from API, please try again later.',
                           backdrop: `
                            rgba(12, 12, 12, 0.68);
                        `
                   });
                }
            }
        }
    }
</script>
