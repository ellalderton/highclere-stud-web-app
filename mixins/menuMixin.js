import CloseIconSvg from '@/assets/svg/times.svg';
import SearchIconSvg from '@/assets/svg/search.svg';

const menuMixin = {
	props: {
		menuOpen: {
			required: true,
			type: Boolean
		},
		searchOpen: {
			required: true,
			type: Boolean
		}
	},
	components: {
		CloseIconSvg,
		SearchIconSvg
	},
	computed: {
		user() {
			return this.$store.getters['auth/getUser'];
		}
	},
	methods: {
		toggleSideMenu() {
			if(this.menuOpen) {
				this.$store.commit('app/closeMenu');
			} else {
				setTimeout(() => {
					this.$store.commit('app/openMenu');
				}, 100);		
			}			
		},
		toggleSearchMenu() {
			if(this.searchOpen) {
				this.$store.commit('app/searchCloseMenu');
			} else {
				setTimeout(() => {
					this.$store.commit('app/searchOpenMenu');
				}, 100);						
			}				
		},
		emitCommentClicked() {
			this.$store.commit('notes/resetPagination');
			this.$store.commit('notes/clearFilters');
			this.$nuxt.$emit('comment_clicked');
		}
	}
}

export default menuMixin;