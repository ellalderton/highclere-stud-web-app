<template>
	<!-- <div class="results mt-4 results--profile" id="results"> -->
	<div class="info-group mt-4" id="results">
        <div class="info-group__heading info-group__heading--secondary">
            <h3 class="py-1">All Results</h3>
        </div>
		<!-- <div class="results__heading">All Results</div> -->
				
		<div v-if="results.length" class="results__container">
			<table v-if="isDesktop" class="table table--flush-top [ results__table ]">
                <thead>
                    <tr>
                        <th>Results</th>
                        <th>Race<br>Country</th>
                        <th>Race<br>Course</th>
                        <th>Race<br>Details</th>
                        <th>Race<br>Date</th>
                        <th>Race<br>Time</th>
                    </tr>
                </thead>
                <tbody>
                	<tr class="results__row" v-for="result in results" v-if="results">
                    	<td class="results__result" :class="{'results__result--first': result.position == 1}">{{ result.position }}<sup>{{ result.position | numberToPosition }}</sup></td>
						<td>{{ result.raceCountry }}</td>
						<td>{{ result.raceCourse }}</td>
						<td>{{ result.raceName | uppercase }}, {{ result.raceDetails | uppercase }}</td>
						<td>{{ result.raceDate | formattedDate }}</td>
						<td>{{ result.raceTime }}</td>
                    </tr>
                </tbody>
        	</table>
			
			<result-accordion-profile 
				v-if="!isDesktop"
				v-for="result, index in results" 
				:result="result"
				:key="index"
			/>			

        	<pagination
				v-show="pagination.totalPages > 1" 
				:last-page="parseInt(pagination.totalPages)" 
				:current-page="parseInt(pagination.currentPage)"
				v-on:pageChanged="paginate"
			/>
        </div>
		
		<div v-if="!results.length" class="pb-3">
			<load-spinner copy="Loading results..."/>
		</div>
	</div>
</template>

<script>
	import ResultAccordionProfile from '@/components/results/ResultAccordionProfile';

	export default {
		data() {
			return {
				isDesktop: true,
				show: false
			}
		},
		props: {
			results: {
				required: true,
				type: Array
			},
			pagination: {
				required: true,
				type: Object
			}
		},
		components: {
			ResultAccordionProfile
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
		methods: {
			paginate(page) {
				this.$emit("pageChanged", page);
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
            toggleDropDown() {
				this.show = !this.show;
			}
		}
	}
</script>