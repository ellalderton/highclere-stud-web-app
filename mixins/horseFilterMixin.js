import { horseFilters }  from '~/siteConfig';
import TransitionExpand from '@/components/transitions/TransitionExpand';
import HorseNoteDetails from '@/components/notes/HorseNoteDetails';
import VueScrollTo from 'vue-scrollto';

const horseFilterMixin = {
	components: {
		TransitionExpand,
		HorseNoteDetails
	},
	data() {
		return {
			pagination: {
				currentPage: 1,
				changed: false
			},
			horseFilters: null,
			order: 'asc',
			filters: {
				age: null,
				primary_color: null,
				sex:  null,
				trainer: null,
				owners: null,
				current_location: null,
				open: false,
				pregnancy_status: null,
				group: null,
				usersHorses: null,
				sort: null,
				type: 'training'
			}
		}
	},
	created() {
		this.horseFilters = horseFilters;
		this.filters = Object.assign({}, this.$store.getters['horses/getFilters']());

		
		this.pagination.currentPage = this.$store.getters['horses/getHorsesPagination'];
		

		this.$nuxt.$on('filterByTrainer', (trainerId) => {
        	this.clearFilters();
        	this.filters.trainer = trainerId;
        	this.submitFilters();

        	this.$nextTick(() => {
				VueScrollTo.scrollTo(`#tabContent`, 10, {offset: -130,});
			});
        });

        this.$nuxt.$on('reload_horses_page', () => {
        	console.log('reload_horses_page');
        	this.clearFilters('training');
        });
	},
	beforeDestroy() {
        this.$nuxt.$off('filterByTrainer');
    },
	computed: {
		siresList() {
			return this.$store.getters['horses/getSiresList'];
		},
		locations() {
			return this.$store.getters['horses/getHorseLocations'];
		},
		groups() {
			return this.$store.getters['horses/getHorseGroups'];
		},
		owners() {
			return this.$store.getters['horses/getOwners'];
		},
		trainers() {
			return this.$store.getters['horses/getTrainers'];
		},
		paginatedHorses() {
			if(!this.horses) return null;

			if(this.pagination.changed) return [];

			const perPage = 12;

			const startIndex = (this.pagination.currentPage - 1) * perPage;
			const endIndex = this.pagination.currentPage * perPage;

			return this.horses.slice(startIndex, endIndex);
		},
		totalPages() {
			if(!this.horses) return 0;

			return Math.ceil(this.horses.length / 12);
		},
		gridView() {
			return this.$store.getters['horses/getGridView'];
		},
		usersHorses() {
			return this.$store.getters['auth/getUsersHorses'];
		}
	},
	methods: {
		setType(type) {
			this.filters.type = type;
			this.submitFilters();
		},
		submitFilters(page = null) {
			// create new object otherwise any changes to this.filters will be
			// updated on our store by reference.
			const filters = Object.assign({}, this.filters);
			this.$store.commit('horses/setFilters', filters);
			this.pagination.currentPage = page ? page : 1;

			// page is only set on intial page load for horses in training
			// so if page is set don't reset filters
			if(!page) {
				this.$store.commit('horses/resetPagination');
			}		
		},
		clearFilters(type = null) {
			this.filters = {
				age: null,
				primary_color: null,
				sex: null,
				trainer: null,
				owners: null,
				current_location: null,
				pregnancy_status: null,
				group: null,
				open: type ? false : this.filters.open,
				usersHorses: null,
				sort: null,
				type: type ? type : this.filters.type
			};
			this.$store.commit('horses/clearFilters', this.filters.type);
			this.pagination.currentPage = 1;
			this.$store.commit('horses/resetPagination');
		},
		toggleFilterOpen() {
			this.filters.open = !this.filters.open;
		},
		paginate(page) {
			this.pagination.currentPage = page;

			this.$store.commit('horses/setHorsesPagination', page);
			
			this.$nextTick(() => {
				VueScrollTo.scrollTo(`#tabContent`, 10, {offset: -130,});
			});
		},
		setView(type) {
			this.$store.commit('horses/setGridView', type);
		}
	}
};

export default horseFilterMixin;