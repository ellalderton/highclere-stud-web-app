<template>
  <header
    class="site-head"
    role="banner"
    :class="{
			'is-pinned': pinHeader && !topOfPage,
			'is-unpinned': !pinHeader && !topOfPage,
			'is-top': topOfPage
		}"
  >
    <div class="site-head__brand-bar">
      <a class="site-head__brand" href="#" @click.prevent="goToHorses">
        <img class="site-head__brand-logo" src="/images/brand-logo.png" alt="logo" />
      </a>
    </div>
    <div class="site-head__main">
      <div class="site-head__inner">
        <!-- Hamburger -->
        <a
          class="[ site-head__hamburger ] [ hamburger ]"
          :class="{'is-active': menuOpen}"
          href="#"
          @click.prevent="toggleSideMenu"
        >
          <span class="sr-only">Skip to the main menu</span>
          <span class="hamburger__decor" aria-hidden="true" role="presentation">
            <span class="hamburger__bars"></span>
          </span>
        </a>

        <!-- <div class="d-none d-md-flex"> -->
        <div class="d-flex [ site-head__nav-mobile ]">
          <div class="site-head__nav-item" :class="{'is-active' : currentRoute === 'entries' || currentRoute === 'results' }">
            <a class="site-head__nav-link" href="#" @click.prevent="goToEntries">
              <span class="site-head__nav-item-icon">
                <entries-icon-svg />
                <span v-if="isSyndicateUser && entriesCount" class="site-head__nav-item-badge site-head__nav-item-badge--entry">
                  {{ entriesCount }}
                </span>              
              </span>
            </a>
          </div>

          <template v-if="canSeeNotes">
            <div class="site-head__notes-container">
              <a class="site-head__notes" href="#" @click.prevent="goToNotes">
                      <span class="site-head__nav-item-icon" v-if="user">
                          <span
                            class="site-head__nav-item-badge"
                            :class="{'site-head__nav-item-badge--allread': !user.unread_notes}"
                          >
                          {{user.unread_notes}}
                        </span>
                          <note-icon-svg/>
                      </span>
                      <!-- <span class="site-head__nav-item-label">Notes</span> -->
                  </a>
                <!-- Comments -->
                <nuxt-link class="site-head__comments" to="/notes/horses">
                    <span
                      class="site-head__comments-badge"
                      :class="{'site-head__comments-badge--allread': !user.unread_comments}"
                      v-if="user"
                      @click="emitCommentClicked"
                    >
                    {{ user.unread_comments }}
                  </span>
                    <!-- <span class="site-head__comments-label" @click="emitCommentClicked">Comments</span> -->
                </nuxt-link>
            </div>
          </template>

          <!-- User button -->
          <a
            v-if="user"
            class="[ site-head__avatar-button ] [ d-none d-md-flex ]"
            href="#"
            @click.prevent="goToProfile"
          >
            <div class="site-head__avatar-border">
                <img
                    v-if="user.avatar_url"
                    class="off-canvas-nav__user-avatar img-fluid rounded-circle"
                    :src="`${user.avatar_url}?w=150&h=150`"
                    alt="User avatar"
                >
                <div
                    v-else
                    class="site-head__avatar"
                    aria-hidden="true"
                    role="presentation"
                >
                    <p>{{ userInitials | uppercase }}</p>
                </div>
            </div>

            <div class="site-head__avatar-text [ font-weight-bold ]">
                {{ user.first_name }} {{ user.last_name }}
            </div>
          </a>

          <!-- Search button -->
          <a
            class="[ site-head__search-button ]"
            href="#"
            :class="{'is-active': searchOpen}"
            @click.prevent="toggleSearchMenu"
          >
            <span class="sr-only">Search</span>
            <span class="site-head__search-icon">
              <search-icon-svg />
            </span>
            <span class="site-head__search-close-icon d-none">
              <close-icon-svg />
            </span>
          </a>
        </div>
      </div>
    </div>
  </header>
</template>

<script>
import menuMixin from "@/mixins/menuMixin.js";
import goToNotesMixin from "@/mixins/goToNotesMixin.js";
import goToEntriesMixin from "@/mixins/goToEntriesMixin.js";
import goToHorsesMixin from "@/mixins/goToHorsesMixin.js";
import NoteIconSvg from "@/assets/svg/note.svg";
import EntriesIconSvg from "@/assets/svg/nav-entries.svg";

export default {
  mixins: [menuMixin, goToNotesMixin, goToEntriesMixin, goToHorsesMixin],
  data() {
    return {
      lastKnownScrollY: 0,
      currentScrollY: 0,
      topOfPage: true,
      pinHeader: true
    };
  },
  components: {
    NoteIconSvg,
    EntriesIconSvg
  },
  computed: {
    currentRoute() {
      return this.$route.name;
    },
    canSeeNotes() {
      return this.$store.getters['auth/getCanSeeNotes'];
    },
    user() {
        return this.$store.getters['auth/getUser'];
    },
    userInitials() {
        if(!this.user) return '';

        return `${this.user.first_name.charAt(0)}${this.user.last_name.charAt(0)}`;
    },
    isSyndicateUser() {
      return this.$store.getters['auth/getIsSyndicate'];
    },
    entriesCount() {
      return this.$store.getters['entries/getEntriesCount'];
    }
  },
  mounted() {
    document.addEventListener("scroll", this.onScroll, false);
  },
  methods: {
    onScroll() {
      this.currentScrollY = window.pageYOffset;
      if (this.currentScrollY <= 120) {
        this.topOfPage = true;
      } else if (this.currentScrollY < this.lastKnownScrollY) {
        this.pinHeader = true;
        this.topOfPage = false;
      } else if (this.currentScrollY > this.lastKnownScrollY) {
        this.pinHeader = false;
        this.topOfPage = false;
      }
      this.lastKnownScrollY = this.currentScrollY;
    },
    goToProfile() {
      this.$router.push('/profile');
    }
  }
};
</script>
