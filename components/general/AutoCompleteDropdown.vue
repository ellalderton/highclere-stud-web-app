<template>
	<div class="autocomplete">
    	<input
    		class="autocomplete__input form-control form-control-lg add-new-note__input"
    		type="text"
			v-model="search"
			v-on:input="search = $event.target.value"
			@click="onChange"
			@input="onChange"
			@keypress="onChange"
			@keyup.down="onArrowDown"
    		@keyup.up="onArrowUp"
    		@keydown.enter.prevent="onEnter"
 			:placeholder="placeholder"
    	/>
    	<ul 
    		ref="list"
    		class="autocomplete__results"
    		v-show="isOpen"
    	>
      		<li
      			ref="listOptions"
				v-for="(result, i) in results"
				:key="i"
      			class="autocomplete__result"
      			@click="setResult(result)"
      			:class="{ 'is-active': i === arrowCounter }"
      		>
      			{{ result.name }}
      		</li>
    	</ul>
  	</div>
</template>

<script>
	import { find as _find } from 'underscore';
	
	export default {
		props: {
			list: {
				required: true,
			},
			value: {
				required: true
			},
			placeholder: {
				required: false,
				type: String
			}
		},
		data() {
			return {
				search: '',
				resultId: null,
				results: [],
				isOpen: false,
				data: [],
				arrowCounter: -1,
			}
		},
		watch: {
			list(val) {
				this.preselectResult();
			}
		},
		mounted() {
			document.addEventListener('click', this.handleClickOutside);
			document.addEventListener('touchstart', this.handleClickOutside);

			this.preselectResult();
		},
		destroyed() {
		    document.removeEventListener('click', this.handleClickOutside);
		    document.removeEventListener('touchstart', this.handleClickOutside);
		},
		methods: {
			preselectResult() {
				if(this.value === null) return;

				const result = _find(this.list, result => {
					return result.id === this.value;
				});

				if(result) {
					this.setResult(result);
				}
			},
			onChange() {
				this.isOpen = true;
				this.filterResults();
				this.clearResultId();
			},
			filterResults() {
				this.results = this.list.filter(horse => {
					return horse.name.toLowerCase().indexOf(this.search.toLowerCase()) > -1;
				});
			},
			setResult(result) {
				this.search = result.name;
				this.setResultId(result.id);
				this.isOpen = false;
			},
			clearResultId() {
				this.resultId = null;
			},
			setResultId(id) {
				this.resultId = id;
				this.$emit("input", id);
			},
			onArrowDown() {
				if(this.arrowCounter < this.results.length) {
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

        			// use settimeout to display the current selected horse.
        			// So that if the input is edited, but no new horse has been selected
        			// the input copy will be reset to the current selected horse's name.
        			setTimeout(() => {
        				if(!this.value) {
        					this.search = '';
        				}
	      				this.preselectResult();
	      			}, 200);
      			}
      		}
		}
	}
</script>