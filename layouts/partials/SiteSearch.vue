<template>
	<div class="off-canvas-search" data-module="off-canvas-search" :style="navHeight">

	    <div class="off-canvas-search__inner [ mt-3 ]">

	        <span class="off-canvas-search__search-close-icon" @click.prevent="closeSearch">
	            <close-icon-svg/>
	        </span>

	        <page-heading>Search</page-heading>

	        <div class="off-canvas-search__search form-group mb-3">
	            <label class="off-canvas-search__label" for="search">Horse Search</label>
	            <input 
	            	ref="input"
	            	class="form-control" 
	            	type="text" 
	            	name="search" 
	            	placeholder="Type here..."
	            	@input="onChange"
	            	@click="onChange"
					@keypress="onChange"
					v-on:input="search = $event.target.value"
	            	v-model="search"
	            >
	        </div>

	        <hr>

	        <div class="row" v-show="search.length > 2">
	        	<div class="col-12 pl-3 pr-3" v-for="(horse, i) in results.slice(0,8)">
	        		<div class="list-item" :class="{'list-item--note-tab': canSeeNotes}">
	        			<horse-note-details 
	        				:horse="horse"
	        				:can-see-notes="canSeeNotes"
	        			/>
	        		</div>        		
	        		<hr>
	        	</div>
	        </div>
	    </div>
	</div>
</template>

<script>
	import CloseIconSvg from '@/assets/svg/times.svg';
	import HorseNoteDetails from '@/components/notes/HorseNoteDetails';

	export default {
		components: {
			CloseIconSvg,
			HorseNoteDetails,
		},
		data() {
			return {
				search: '',
				results: [],
				navHeight: {
					height: '100vh'
				}
			}
		},
		props: {
			menuOpen: {
				required: true,
				type: Boolean
			}
		},
		mounted() {
			document.addEventListener('click', this.handleClickOutside);
			document.addEventListener('touchstart', this.handleClickOutside);
			document.addEventListener('keydown', this.closeOnEscape);

			this.updateNavHeight();
		},
		destroyed() {
		    document.removeEventListener('click', this.handleClickOutside);
		    document.removeEventListener('touchstart', this.handleClickOutside);
		    document.removeEventListener('keydown', this.closeOnEscape);
		},
		computed: {
		    list() {
		    	return this.$store.getters['horses/getHorseSearchList'];
		    },
			canSeeNotes() {
				return this.$store.getters['auth/getCanSeeNotes'];
			}
		},
		methods: {
			closeOnEscape(evt) {
				if(evt.key === "Escape" || evt.key === "Esc") {
					this.closeSearch();
				}
			},
			handleClickOutside(evt) {
	  			if (!this.$el.contains(evt.target) && this.menuOpen) {
	    			this.$store.commit('app/searchCloseMenu');
	  			}
	  		},
	  		onChange() {
				this.filterResults();
			},
			filterResults() {
				this.results = this.list.filter(horse => {
					// filter by horse name, dam and sire.
					return horse.name.toLowerCase().indexOf(this.search.toLowerCase()) > -1 ||
						horse.sire.toLowerCase().indexOf(this.search.toLowerCase()) > -1 ||
						horse.dam.toLowerCase().indexOf(this.search.toLowerCase()) > -1;
				});
			},
			closeSearch() {
				this.$store.commit('app/searchCloseMenu');		
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
			}
		},
		watch: {
			menuOpen(val) {
				if(!val) {
					this.search = '';
				} else {
					this.updateNavHeight()
				}
			}
		}
		
	}
</script>