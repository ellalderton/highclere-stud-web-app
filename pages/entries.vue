<template>
	<div class="[ container-fluid container--page ] [ pt-4 ]">
        <page-heading>
            Entries
        </page-heading>

        <ul class="nav nav-tabs" id="horseTypeTab" role="tablist">
		    <li class="nav-item">
		        <nuxt-link class="nav-link active" to="/entries">Entries</nuxt-link>
		    </li>
		    <li class="nav-item">
		        <nuxt-link class="nav-link" to="/results">Results</nuxt-link>
		    </li>
		</ul>

		<div class="tab-content" id="tabContent">
			<div class="tab-pane fade show active" role="tabpanel">

		        <load-spinner v-if="!horses" copy="Loading horses..."/>
				
				<template v-else>
					<div class="entries__declared-key">
			        	<div class="entries__declared-key__key"></div>
			        	<div class="entries__declared-key__copy">Declared</div>
			        </div>

					<template v-if="todaysEntries.length">
						<div class="entries">
							<div class="entries__heading">Today</div>
							
							<div class="entries__container">
								<table v-if="isDesktop" class="table table--flush-top [ entries__table ]">
					                <thead>
					                    <tr>
					                        <th>Horse</th>
					                        <th>Trainer</th>
					                        <th>Race<br>Country</th>
					                        <th>Race<br>Course</th>
					                        <th>Race<br>Details</th>
					                        <th>Race<br>Date</th>
					                        <th>Race<br>Time</th>
					                        <th class="notes-col" v-if="canSeeNotes"></th>
					                    </tr>
					                </thead>
					                <tbody>
					                    <entry-row 
					                    	v-for="(entry, index) in todaysEntries":entry="entry" 
					                    	:key="`today-${index}`"
					                    	:can-see-notes="canSeeNotes"  
					                    />
					                </tbody>
				            	</table>

				            	<div v-if="!isDesktop">
									<entry-accordion-item 
										v-for="(entry, index) in todaysEntries" 
										:entry="entry" 
					                    :key="`todays-item-${index}`"
					                    :can-see-notes="canSeeNotes" 
					                />
								</div>
							</div>
						</div>

						<hr>
					</template>

					<div class="entries" id="upcoming-entries" v-if="upcomingEntries.length">
						<div class="entries__heading">Upcoming Entries</div>
				
						<div class="entries__container">
							<table v-if="isDesktop" class="table table--flush-top [ entries__table ]">
				                <thead>
				                    <tr>
				                        <th>Horse</th>
				                        <th>Trainer</th>
				                        <th>Race<br>Country</th>
				                        <th>Race<br>Course</th>
				                        <th>Race<br>Details</th>
				                        <th>Race<br>Date</th>
				                        <th>Race<br>Time</th>
				                        <th class="notes-col" v-if="canSeeNotes"></th>
				                    </tr>
				                </thead>
				                <tbody>
				                    <entry-row 
				                    	v-for="(entry, index) in paginatedUpcomingEntries" :entry="entry" 
				                    	:key="`upcoming-${index}`"
				                    	:can-see-notes="canSeeNotes" 
				                    />
				                </tbody>
				            </table>

							<div v-if="!isDesktop">
								<entry-accordion-item 
									v-for="(entry, index) in paginatedUpcomingEntries" 
									:entry="entry" 
				                    :key="`upcoming-item-${index}`"
				                    :can-see-notes="canSeeNotes" 
				                />
							</div>
						
							<pagination
								class="mt-3"
								v-show="totalPages > 1" 
								:last-page="parseInt(totalPages)" 
								:current-page="parseInt(pagination.currentPage)"
								v-on:pageChanged="paginate"
							/>
						</div>
					</div>

					<template v-if="!todaysEntries.length && !upcomingEntries.length">
								<p class="text-center mt-3">No Entries found</p>
							</template>
				</template>
			</div>
		</div>
    </div> 
</template>

<script>
	import { filter as _filter } from 'underscore';
	import moment from 'moment';
	import EntryRow from '@/components/entry/EntryRow';
	import EntryAccordionItem from '@/components/entry/EntryAccordionItem';
	import VueScrollTo from 'vue-scrollto';

	export default {
		data() {
			return {
				pagination: {
					currentPage: 1,
					perPage: 20
				},
				isDesktop: true
			}
		},
		components: {
			EntryRow,
			EntryAccordionItem,
			VueScrollTo
		},
		created() {
			this.pagination.currentPage = this.$store.getters['entries/getPagination'];
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
		computed: {
			todaysEntries() {
				return this.$store.getters['entries/getTodaysEntries'];
			},
			upcomingEntries() {
				return this.$store.getters['entries/getUpcomingEntries'];
			},
			paginatedUpcomingEntries() {
				if(!this.upcomingEntries) return [];

				const perPage = 2;

				const startIndex = (this.pagination.currentPage - 1) * this.pagination.perPage;
				const endIndex = this.pagination.currentPage * this.pagination.perPage;

				return this.upcomingEntries.slice(startIndex, endIndex);
			},
			totalPages() {
				if(!this.upcomingEntries.length) return 0;

				return Math.ceil(this.upcomingEntries.length / this.pagination.perPage);
			},
			horses() {
                return this.$store.getters['horses/getFilteredHorses'];
            },
			canSeeNotes() {
				return this.$store.getters['auth/getCanSeeNotes'];
			}		
		},
		methods: {
			paginate(page) {
				this.pagination.currentPage = page;
				this.$store.commit('entries/setPagination', page);

				this.$nextTick(() => {
					VueScrollTo.scrollTo(`#upcoming-entries`, 10, {offset: -100,});
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
		}
	}
</script>