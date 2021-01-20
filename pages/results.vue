<template>
	<div class="[ container-fluid container--page ] [ pt-4 ]">
        <page-heading>
            Results
        </page-heading>

        <ul class="nav nav-tabs" id="horseTypeTab" role="tablist">
		    <li class="nav-item">
		        <nuxt-link class="nav-link" to="/entries">Entries</nuxt-link>
		    </li>
		    <li class="nav-item">
		        <nuxt-link class="nav-link active" to="/results">Results</nuxt-link>
		    </li>
		</ul>

		<div class="tab-content" id="tabContent">
			<div class="tab-pane fade show active" role="tabpanel">

		        <load-spinner v-if="!horses" copy="Loading horses..."/>
				
				<template v-else>
					<div class="col-lg-6">
						<div class="form-group">
							<label class="add-new-note__label" for="">Filter by day</label>
							<div class="d-flex">
								<date-picker 
									overwrite-classes="form-control form-control-lg add-new-note__input [ custom-datepicker ]"
					                name="date" 
					                placeholder="DD-MM-YYYY"
					                v-model="filterDay"
					                :old="filterDay"
					                :disabledDates="disabledDates"
					            ></date-picker>
								<app-button
									additionalClasses="ml-3" 
		                            block
		                            primary
		                            v-on:btn-click="resetFilter"
		                        >Reset</app-button>
							</div>					
				        </div>
					</div>

					<div class="results" id="results">
						<div class="results__heading">
							{{ tableHeading }}
						</div>
						
						<div class="results__container">
							<template v-if="paginatedResults.length">
									<table v-if="isDesktop" class="table table--flush-top [ results__table results__table--full ]">
					                <thead>
					                    <tr>
					                    	<th>Result</th>
					                        <th>Horse</th>
					                        <th>Trainer</th>
					                        <th>Race<br>Country</th>
					                        <th>Race<br>Course</th>
					                        <th>Race<br>Details</th>
					                        <th>Race<br>Date</th>
					                        <th>Race<br>Time</th>
					                        <th v-if="canSeeNotes" class="notes-col"></th>
					                    </tr>
					                </thead>
					                <tbody>
					                    <result-row 
					                    	v-for="(result, index) in paginatedResults" :result="result" 
					                    	:key="`res-${index}`"
					                    	:can-see-notes="canSeeNotes"  
					                    />
					                </tbody>
				            	</table>

				            	<div v-if="!isDesktop">
									<result-accordion-item 
										v-for="(result, index) in paginatedResults" 
										:result="result" 
					                    :key="`res-mob-${index}`"
					                    :can-see-notes="canSeeNotes" 
					                />
								</div>

								<pagination
									v-show="totalPages > 1" 
									:last-page="parseInt(totalPages)" 
									:current-page="parseInt(pagination.currentPage)"
									v-on:pageChanged="paginate"
								/>
							</template>
							<template v-else>
								<p class="text-center mt-3">No Results found</p>
							</template>
						</div>
					</div>
				</template>
			</div>
		</div>
    </div> 
</template>

<script>
	import moment from 'moment';
	import DatePicker from '@/components/general/DatePicker';
	import VueScrollTo from 'vue-scrollto';
	import ResultRow from '@/components/results/ResultRow';
	import ResultAccordionItem from '@/components/results/ResultAccordionItem';
	import { filter as _filter } from 'underscore';

	export default {
		data() {
			return {
				pagination: {
					currentPage: 1,
					perPage: 20
				},
				results: null,
				filterSubmitted: false,
				filterDay: null,
				isDesktop: true
			}
		},
		components: {
			DatePicker,
			ResultRow,
			ResultAccordionItem
		},
		async asyncData({ store, error }) {
			try {
				let results = await store.dispatch('results/resultsAll');			

				return { results };
			} catch(e) {     
                error({ statusCode: 404, message: e.message });
            } 
		},
		created() {
			this.pagination.currentPage = this.$store.getters['results/getPagination'];
			this.filterDay = this.$store.getters['results/getDayFilter'];
		},
		mounted() {
			if (process.browser) {
                window.onNuxtReady((app) => {
                    this.isDesktopWidth();
                });

                this.isDesktopWidth();
            }

            window.addEventListener('resize', this.isDesktopWidth);
		},
		beforeDestroy() {
            window.removeEventListener('resize', this.isDesktopWidth);
        },
        watch: {
		    filterDay: function (newVal) {
		    	// if date filter changes reset pagination to page 1.
		    	// Set Filter in store
		    	this.$store.commit('results/setDayFilter', newVal);
		    	this.$store.commit('results/setPagination', 1);
		       	this.pagination.currentPage = 1;
		    }
		 },
		computed: {
			horses() {
                return this.$store.getters['horses/getFilteredHorses'];
            },
			filteredResults() {
				if(!this.results) return [];

				let results = this.results;

				// If user is an Owner or Trainer we'll need to filter to only display their horses.

				if(this.filterDay) {
					results = _filter(results, (result) => {
						return moment(result.raceDate).format('DD/MM/YYYY') == this.filterDay;
					});
				}

				return results;
			},
			paginatedResults() {
				const startIndex = (this.pagination.currentPage - 1) * this.pagination.perPage;
				const endIndex = this.pagination.currentPage * this.pagination.perPage;

				return this.filteredResults.slice(startIndex, endIndex);
			},
			totalPages() {
				if(!this.results.length) return 0;

				return Math.ceil(this.filteredResults.length / this.pagination.perPage);
			},
			disabledDates() {
				return {
					to: new Date(Date.now() - 864000000), // 10 days ago
					from: new Date(Date.now())
				}
			},
			canSeeNotes() {
				return this.$store.getters['auth/getCanSeeNotes'];
			},
			tableHeading() {
				let date;
				let startOfHeading = 'Results since';
				if(!this.filterDay) {
					date = moment().subtract(9, 'd');
				} else {
					date = moment(this.filterDay, 'DD/MM/YYYY');
					startOfHeading = 'Results for'
				}

				if(this.isDesktop) {
					return `${startOfHeading} ${date.format('Do MMMM')}`;
				} else {
					return `${startOfHeading} ${date.format('Do MMM')}`;
				}
			}		
		},
		methods: {
			paginate(page) {
				this.pagination.currentPage = page;
				this.$store.commit('results/setPagination', page);

				this.$nextTick(() => {
					VueScrollTo.scrollTo(`#results`, 10, {offset: -100,});
				});
			},
			isDesktopWidth() {
                if(typeof window !== 'undefined') {
                    if(window.innerWidth < 992) {
                        this.isDesktop = false;
                        return;
                    }
                } 
                this.isDesktop = true;
            },
           	resetFilter() {
           		this.filterDay = null;
           	}
		}
	}
</script>

<style>
	.vdp-datepicker input {
		max-width: 250px;
	}
</style>