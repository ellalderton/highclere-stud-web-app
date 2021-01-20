<template>
	<div class="results-accordion__container" v-if="horse">
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
				<template v-if="!profileHorse">
					<div class="results-accordion__row__copy__name" v-if="horse">
						<nuxt-link :to="`/horse/${horse.id}`">{{ result.animalName | uppercase }}</nuxt-link>
					</div>
					<div class="results-accordion__row__copy__date">
						<strong>{{ result.raceCourse }}</strong>
					</div>
					<div class="results-accordion__row__copy__date">
						<div>{{ result.raceDate | mediumDate }}</div>
						<div>{{ result.raceTime }}</div>
					</div>
				</template>
				<template v-else>
					<div class="results-accordion__row__copy__date--profile">
						{{ result.RaceDate | mediumDate }}
					</div>
					<div class="results-accordion__row__copy__time--profile">
						{{ result.RaceTime }}
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
			<div class="results-accordion__dropdown__row" v-if="!profileHorse && canSeeNotes">
				<div class="results-accordion__dropdown__row__notes" v-if="horse">
					<nuxt-link 
	                    class="list-item__primary-icon list-item__primary-icon--notes" 
	                    :class="{'list-item__primary-icon--read': !horse.unread_notes_count}"
	                    :to="`/horse/${horse.id}/notes`"
	                >           
	                    <note-icon-svg/>
	                    <span class="list-item__primary-icon-suffix">                	
	                    	<template v-if="horse.unread_notes_count">{{ horse.unread_notes_count }}</template> 
	                    	{{ 'Note' | pluralize(horse.unread_notes_count) }}
	                    </span>
	                </nuxt-link>
	                <nuxt-link 
	                    class="list-item__primary-icon list-item__primary-icon--comments"
	                    :class="{'list-item__primary-icon--read': !horse.unread_comments_count}"
	                    :to="`/horse/${horse.id}/notes`"
	                >
	                    <bubble-icon-svg/>
	                    <span class="list-item__primary-icon-suffix">
	                    	<template v-if="horse.unread_comments_count">{{ horse.unread_comments_count }}</template>
	                    	{{ 'Comment' | pluralize(horse.unread_comments_count) }}
	                    </span>
	                </nuxt-link>
				</div>				
			</div>
			<div class="results-accordion__dropdown__row">
				<div class="results-accordion__dropdown__label">
					Trainer
				</div>
				<div class="results-accordion__dropdown__field">
					<template v-if="horse">{{ horseTrainer }}</template>
				</div>
			</div>
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
					<a :href="result.link" target="_blank">{{ result.raceName | uppercase }}, {{ result.raceDetails | uppercase }}</a>
				</div>
			</div>
		</div>
	</div>
	
</template>

<script>
	import horseTrainerMixin from '@/mixins/horseTrainerMixin.js';
	import ArrowIconSvg from '@/assets/svg/arrow.svg';
	import BubbleIconSvg from '@/assets/svg/bubble.svg';
	import NoteIconSvg from '@/assets/svg/note.svg';

	export default {
		mixins: [horseTrainerMixin],
		data() {
			return {
				show: false
			}
		},
		props: {
			result: {
				required: true,
				type: Object
			},
			profileHorse: {
				required: false,
				default: null
			},
			canSeeNotes: {
				required: false,
				default: true,
				type: Boolean
			}
		},
		components: {
			ArrowIconSvg,
			BubbleIconSvg,
			NoteIconSvg
		},
		computed: {
			horse() {
				if(this.profileHorse) {
					return this.profileHorse;
				}

				return this.$store.getters['horses/getHorsebyWapi'](this.result.animalID);
			}
		},
		methods: {
			toggleDropDown() {
				this.show = !this.show;
			}
		}
	}
</script>