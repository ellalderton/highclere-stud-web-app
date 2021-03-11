<template>
	<div class="results-accordion__container">
		<div class="results-accordion__row">
			<div class="results-accordion__row__copy">
				<template >
					<div class="results-accordion__row__copy__name">
						<strong>{{ name }}</strong>
					</div>
					<div class="results-accordion__row__copy__date">
						{{ formattedBirthDate }}
					</div>
				</template>
			</div>
			<div 
				@click.prevent="toggleDropDown" 
				class="results-accordion__row__trigger"
				:class="{'results-accordion__row__trigger--open': show}"
			>
				<arrow-icon-svg/>
			</div>
		</div>
		<div class="results-accordion__dropdown" v-show="show">
			<div class="results-accordion__dropdown__row">
				<div class="results-accordion__dropdown__label">
					Sex
				</div>
				<div class="results-accordion__dropdown__field">
					{{ progeny.sex }}
				</div>
			</div>
			<div class="results-accordion__dropdown__row">
				<div class="results-accordion__dropdown__label">
					Sire
				</div>
				<div class="results-accordion__dropdown__field">
					{{ progeny.sireName }}
				</div>
			</div>
			<div class="results-accordion__dropdown__row">
				<div class="results-accordion__dropdown__label">
					Abrv. Race Record
				</div>
				<div class="results-accordion__dropdown__field">
					{{ progeny.raceRecord }}
				</div>
			</div>
			<div v-if="saleRecord" class="results-accordion__dropdown__row">
				<div class="results-accordion__dropdown__label">
					Sales Record
				</div>
				<div class="results-accordion__dropdown__field" v-html="saleRecord">
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	import ArrowIconSvg from '@/assets/svg/arrow.svg';

	export default {
		data() {
			return {
				isDesktop: true,
				show: false
			}
		},
		props: {
			progeny: {
				required: true,
				type: Object
			},
			parent: {
				required: true,
				type: String
			}
		},
		components: {
			ArrowIconSvg
		},
		computed: {
			formattedBirthDate() {
            	return this.progeny.birthDate.replace(/-/g, "/");
            },
            name() {
            	if(this.progeny.name) return this.progeny.name;

            	return `${this.progeny.birthDate.substr(this.progeny.birthDate.length - 4)} out of ${this.parent}`;
            },
            saleRecord() {
            	if(!this.progeny.soldAsFoal && !this.progeny.soldAsYearling) return '';

            	if(this.progeny.soldAsFoal && this.progeny.soldAsYearling) {
            		return `Sold as Foal for ${this.progeny.soldAsFoal.currency}${this.progeny.soldAsFoal.price}<br>Sold as Yearling for ${this.progeny.soldAsYearling.currency}${this.progeny.soldAsYearling.price}`;
            	}

            	if(this.progeny.soldAsFoal) {
            		return `Sold as Foal for ${this.progeny.soldAsFoal.currency}${this.progeny.soldAsFoal.price}`;
            	}

            	return `Sold as Yearling for ${this.progeny.soldAsYearling.currency}${this.progeny.soldAsYearling.price}`;
            }
		},
		methods: {
            toggleDropDown() {
				this.show = !this.show;
			}
		}
	}
</script>