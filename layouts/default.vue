<template>
    <div
      class="app"
      :class="{'is-offset--nav': menuOpen, 'is-offset--search': searchMenuOpen}"
      style="width: 100%;"
    >

        <site-header :menu-open="menuOpen" :search-open="searchMenuOpen"/>

        <site-nav :menu-open="menuOpen"/>

        <site-search :menu-open="searchMenuOpen"/>
        
        <welcome-back v-if="showWelcome"/>

        <nuxt/>

        <site-footer/>

        <site-footer-nav :menu-open="menuOpen" :search-open="searchMenuOpen"/>

        <div class="app__nav-toggle">
          <span class="sr-only">Close the menu</span>
          <times-icon-svg/>
        </div>

        <media-modal/>

    </div>
</template>

<script>
    import SiteHeader from './partials/SiteHeader';
    import SiteFooter from './partials/SiteFooter';
    import SiteFooterNav from './partials/SiteFooterNav';
    import SiteNav from './partials/SiteNav';
    import SiteSearch from './partials/SiteSearch';
    import AutoCompleteSearch from '@/components/general/AutoCompleteSearch';
    import MediaModal from '@/components/media/MediaModal';
    import TimesIconSvg from '@/assets/svg/times.svg';
    import handleApiErrorMixin from "@/mixins/handleApiErrorMixin.js";
    import WelcomeBack from './partials/WelcomeBack';

  export default {
    middleware: ['check-auth', 'auth'],
    mixins: [handleApiErrorMixin],
    data() {
        return {
            apiErrors: false
        }
    },
    components: {
        SiteFooter,
        SiteFooterNav,
        SiteHeader,
        SiteNav,
        SiteSearch,
        AutoCompleteSearch,
        MediaModal,
        TimesIconSvg,
        WelcomeBack
    },
    head() { // Adds 'is-no-scroll' class to <body> when menu is open.
        return {
            bodyAttrs: {
                class: this.menuOpen || this.searchMenuOpen ? 'is-no-scroll' : ''
            }
        }
    },
    mounted() { // get horse and entries data, if api errors logout user.
        this.$store.dispatch('horses/horses')
            .catch(error => {
                this.handleApiError(error);
            });

        this.$store.dispatch('entries/entries')
            .catch(error => {
                this.handleApiError(error);
            });
    },
    computed: {
        menuOpen() {
            return this.$store.getters['app/getMenuStatus'];
        },
        searchMenuOpen() {
          return this.$store.getters['app/getSearchMenuStatus'];
        },
        currentRoute() {
          return this.$route.name;
        },
        showWelcome() {
            return this.$store.getters['auth/getShowWelcome'];
        }
    },
    watch: {
      $route () { // close menu on page change
        this.$store.commit('app/closeMenu');
        this.$store.commit('app/searchCloseMenu');
      }
    }
  }
</script>

<style>
    .page-enter-active, .page-leave-active {
      transition: all .30s ease-out;
    }

    .page-enter, .page-leave-active {
      opacity: 0;
      transform-origin: 50% 50%;
    }

    .container--page {
      min-height: calc(100vh - 217px);
    }

    .heading--1 {
        padding: 0 40px;
    }
</style>