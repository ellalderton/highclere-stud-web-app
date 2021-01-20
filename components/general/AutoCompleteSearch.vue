<template>
	<div class="autocomplete">
		<div class="form-group form-group--has-icon">
			<input 
				ref="input"
				type="text"
				v-model="search"
				v-on:input="search = $event.target.value"
				@click="onChange"
				@input="onChange"
				@keypress="onChange"
				@keyup.down="onArrowDown"
				@keyup.up="onArrowUp"
				@keydown.enter.prevent="onEnter"
				placeholder="Search horses in training..."
			>
		</div>

		<ul
			ref="list"
			class="autocomplete__results"
			v-show="isOpen"
		>
			<li
				ref="listOptions"
				v-for="(result, i) in results.slice(0,5)"
				:key="i"
      			class="autocomplete__result"
      			@click="setResult(result)"
      			:class="{ 'is-active': i === arrowCounter }"
      			style="display:flex; justify-content: space-between;"
      		>
      			{{ result.name }}
      			<span>Sire: {{ result.lineage.sire }}</span>
      			<span>Dam: {{ result.lineage.dam }}</span>
      		</li>
		</ul>
	</div>
	
</template>

<script>
	export default {
		data() {
			return {
				search: '',
				resultId: null,
				results: [],
				isOpen: false,
				arrowCounter: -1
			}
		},
		computed: {
		    list() {
		    	return this.$store.getters['horses/getHorseSearchList'];
		    } 
		},
		mounted() {
			document.addEventListener('click', this.handleClickOutside);
			document.addEventListener('touchstart', this.handleClickOutside);
		},
		destroyed() {
		    document.removeEventListener('click', this.handleClickOutside);
		    document.removeEventListener('touchstart', this.handleClickOutside);
		},
		methods: {
			onChange() {
				this.isOpen = true;
				this.filterResults();
				this.clearResultId();
			},
			filterResults() {
				this.results = this.list.filter(horse => {
					// filter by horse name, dam and sire.
					return horse.name.toLowerCase().indexOf(this.search.toLowerCase()) > -1 ||
						horse.lineage.sire.toLowerCase().indexOf(this.search.toLowerCase()) > -1 ||
						horse.lineage.dam.toLowerCase().indexOf(this.search.toLowerCase()) > -1;
				});
			},
			setResult(result) {
				this.search = result.name;
				this.setResultId(result.id);
				this.isOpen = false;
				this.submit(result);
			},
			clearResultId() {
				this.resultId = null;
			},
			setResultId(id) {
				this.resultId = id;
			},
			onArrowDown() {
				if(this.arrowCounter < this.results.length-1) {
					this.arrowCounter = this.arrowCounter + 1;
					this.fixScrolling();
				}
			},
			onArrowUp() {
				if(this.arrowCounter > 0) {
					this.arrowCounter = this.arrowCounter - 1;
					this.fixScrolling();
				}
			},
			fixScrolling(){
			    const listHeight = this.$refs.listOptions[this.arrowCounter].clientHeight;
			    this.$refs.list.scrollTop = listHeight * this.arrowCounter;
			},
			onEnter() {
				if(this.arrowCounter >= 0) {
					this.setResult(this.results[this.arrowCounter]);
				}
				this.arrowCounter = -1;				
			},
			handleClickOutside(evt) {
      			if (!this.$el.contains(evt.target)) {
        			this.isOpen = false;
        			this.arrowCounter = -1;
        			this.$refs.input.blur();
      			}
      		},
      		submit(result) {
      			if(result !== null) {
      				this.$router.push(`/horse/${result.id}`); 				
      				this.clearResultId();
      				this.search = '';     				
      			}
      		}
		}

	}
</script>