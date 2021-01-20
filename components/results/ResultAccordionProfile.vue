<template>
	<div class="results-accordion__container">
		<div class="results-accordion__row">
			<div class="results-accordion__row__position">
				<div 
					class="results-accordion__row__position__container"
					:class="{'results-accordion__row__position__container--first': result.position == 1}"
				>
					{{ result.position }}<sup>{{ result.position | numberToPosition }}</sup>
				</div>			
			</div>
			<div class="results-accordion__row__copy">
				<template >
					<div class="results-accordion__row__copy__name">
						<strong>{{ result.raceCourse }}</strong>
					</div>
					<div class="results-accordion__row__copy__date">
						<div>{{ result.raceDate | mediumDate }}</div>
						<div>{{ result.raceTime }}</div>
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
					Race country
				</div>
				<div class="results-accordion__dropdown__field">
					{{ result.raceCountry }}
				</div>
			</div>
			<div class="results-accordion__dropdown__row">
				<div class="results-accordion__dropdown__label">
					Race Details
				</div>
				<div class="results-accordion__dropdown__field">
					{{ result.raceName | uppercase }}, {{ result.raceDetails | uppercase }}
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
			result: {
				required: true,
				type: Object
			},
		},
		components: {
			ArrowIconSvg
		},
		methods: {
            toggleDropDown() {
				this.show = !this.show;
			}
		}
	}
</script>