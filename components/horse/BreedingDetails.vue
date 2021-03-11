<template>
	<!-- <div class="results mt-4 results--profile" id="results"> -->
	<div class="info-group mt-4" id="results">
        <div class="info-group__heading info-group__heading--secondary">
            <h3 class="py-1">Breeding History</h3>
        </div>
				
		<div class="results__container">
			<table v-if="isDesktop" class="table table--flush-top [ results__table ]">
                <thead>
                    <tr>
                        <th>Date</th>
                        <th>Sex</th>
                        <th>Name</th>
                        <th>Sire</th>
                        <th>Abrv. Race<br>Record</th>
                        <th>Sales<br>Record</th>
                    </tr>
                </thead>
                <tbody>
                	<tr class="results__row" v-for="progeny in progenies" v-if="progenies">
                    	<td>{{ formatBirthDate(progeny.birthDate) }}</td>
						<td>{{ progeny.sex }}</td>
						<td>{{ getHorseName(progeny) }}</td>
						<td>{{ progeny.sireName }}</td>
						<td>{{ progeny.raceRecord }}</td>
						<td v-html="getSoldRecord(progeny)"></td>
                    </tr>
                </tbody>
        	</table>
			
			<breeding-detail-accordion
				v-if="!isDesktop"
				v-for="progeny, index in progenies" 
				:progeny="progeny"
				:key="index"
                :parent="parent"
			/>			
        </div>
	</div>
</template>

<script>
	import BreedingDetailAccordion from '@/components/horse/BreedingDetailAccordion';

	export default {
		data() {
			return {
				isDesktop: true,
				show: false
			}
		},
		props: {
			progenies: {
				required: true,
				type: Array
			},
			parent: {
				required: true,
				type: String
			}
		},
		components: {
			BreedingDetailAccordion
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
			isDesktopWidth() {
                if(typeof window !== 'undefined') {
                    if(window.innerWidth < 992) {
                        this.isDesktop = false;
                        return;
                    }
                } 
                this.isDesktop = true;
            },
            getHorseName(progeny) {
            	if(progeny.name) return progeny.name;

            	return `${progeny.birthDate.substr(progeny.birthDate.length - 4)} out of ${this.parent}`;
            },
            getSoldRecord(progeny) {
            	if(!progeny.soldAsFoal && !progeny.soldAsYearling) return '';

            	if(progeny.soldAsFoal && progeny.soldAsYearling) {
            		return `Sold as Foal for ${progeny.soldAsFoal.currency}${progeny.soldAsFoal.price}<br>Sold as Yearling for ${progeny.soldAsYearling.currency}${progeny.soldAsYearling.price}`;
            	}

            	if(progeny.soldAsFoal) {
            		return `Sold as Foal for ${progeny.soldAsFoal.currency}${progeny.soldAsFoal.price}`;
            	}

            	return `Sold as Yearling for ${progeny.soldAsYearling.currency}${progeny.soldAsYearling.price}`;
            },
            formatBirthDate(birthDate) {
            	return birthDate.replace(/-/g, "/");
            }
		}
	}
</script>