<template>
	<ul class="pagination">
		<li class="pagination__item" v-if="currentPage != 1">
			<a @click.prevent="selectPage(currentPage - 1)" href="#" class="pagination__prev page-link">Prev</a>
		</li>

		<li class="pagination__item" v-if="currentPage > 2">
			<a @click.prevent="selectPage(1)" href="#" class="page-link pagination__link">1</a>
		</li>

		<li class="pagination__dots" v-if="currentPage > 4">
			...
		</li>

		<template v-for="page in pageRange">
			<li 
				class="pagination__item"
				:class="{'active' : currentPage == page}"
				v-if="page == currentPage - 2 && (currentPage == lastPage && lastPage > 3)">
				<a @click.prevent="selectPage(page)" href="#" class="page-link pagination__link">{{ page }}</a>
			</li>
			
			<li 
				class="pagination__item"
				:class="{'active' : currentPage == page}"
				v-if="page >= currentPage - 1 && page <= currentPage + 1">
				<a @click.prevent="selectPage(page)" href="#" class="page-link pagination__link">{{ page }}</a>
			</li>

			<li 
				class="pagination__item"
				:class="{'active' : currentPage == page}"
				v-if="page == currentPage + 2 && (currentPage < 4 && lastPage > 2)">
				<a @click.prevent="selectPage(page)" href="#" class="page-link pagination__link">{{ page }}</a>
			</li>

			<li 
				class="pagination__item"
				:class="{'active' : currentPage == page}"
				v-if="page == currentPage + 3 && (currentPage < 3 && lastPage > 3)">
				<a @click.prevent="selectPage(page)" href="#" class="page-link pagination__link">{{ page }}</a>
			</li>

			<li 
				class="pagination__item"
				:class="{'active' : currentPage == page}"
				v-if="page == currentPage + 4 && (currentPage == 1 && lastPage > 4)">
				<a @click.prevent="selectPage(page)" href="#" class="page-link pagination__link">{{ page }}</a>
			</li>
		</template>

		<li class="pagination__dots" v-if="currentPage < lastPage - 2 && lastPage > 5">
			...
		</li>

		<li class="pagination__item" v-if="currentPage < lastPage - 1 && lastPage > 5">
			<a @click.prevent="selectPage(lastPage)" href="#" class="page-link pagination__link pagination__link--last">{{ lastPage }}</a>
		</li>

		<li class="pagination__item" v-if="currentPage != lastPage">
			<a @click.prevent="selectPage(currentPage + 1)" href="#" class="page-link pagination__next">Next</a>
		</li>
	</ul>	
</template>

<script>
	import { range as _range } from 'underscore';

	export default {
		props: {
			currentPage: {
				required: true,
				type: Number
			},
			lastPage: {
				required: true,
				type: Number
			}
		},
		computed: {
			pageRange() {
				return _range(1, this.lastPage + 1);
			}
		},
		methods: {
			selectPage(page) {
				this.$emit("pageChanged", page);
			}		
		}
	}
</script>