<template>
	<div class="entries-accordion__container">
		<div class="entries-accordion__row" :class="{'entries-accordion__row--declared': entry.declared}">
			<div class="entries-accordion__row__copy">
				<template v-if="!profileHorse">
					<div class="entries-accordion__row__copy__name">
						<nuxt-link :to="`/horse/${entry.horseID}`">{{ entry.horseName | uppercase }}</nuxt-link>
					</div>
					<div class="entries-accordion__row__copy__date">
						<div>{{ entry.date | mediumDate }}</div>
						<div>{{ entry.time }}</div>
					</div>
				</template>
				<template v-else>
					<div class="entries-accordion__row__copy__date--profile">
						{{ entry.date | mediumDate }}
					</div>
					<div class="entries-accordion__row__copy__time--profile">
						{{ entry.time }}
					</div>
				</template>
			</div>
			<div 
				@click.prevent="toggleDropDown" 
				class="entries-accordion__row__trigger"
				:class="{'entries-accordion__row__trigger--open': show}"
			>
				<arrow-icon-svg/>
			</div>
		</div>
		<div class="entries-accordion__dropdown" v-show="show">
			<div class="entries-accordion__dropdown__row" v-if="!profileHorse && canSeeNotes">
				<div class="entries-accordion__dropdown__row__notes" v-if="horse">
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
			<div class="entries-accordion__dropdown__row">
				<div class="entries-accordion__dropdown__label">
					Trainer
				</div>
				<div class="entries-accordion__dropdown__field">
					<template v-if="horse">{{ horseTrainer }}</template>
				</div>
			</div>
			<div class="entries-accordion__dropdown__row">
				<div class="entries-accordion__dropdown__label">
					Race country
				</div>
				<div class="entries-accordion__dropdown__field">
					{{ entry.raceCountry }}
				</div>
			</div>
			<div class="entries-accordion__dropdown__row">
				<div class="entries-accordion__dropdown__label">
					Race Course
				</div>
				<div class="entries-accordion__dropdown__field">
					{{ entry.courseName }}
				</div>
			</div>
			<div class="entries-accordion__dropdown__row">
				<div class="entries-accordion__dropdown__label">
					Race Details
				</div>
				<div class="entries-accordion__dropdown__field">
					<a v-if="entry.link" :href="entry.link" target="_blank">{{ entry.raceName | uppercase }}</a>
					<template v-else>{{ entry.raceName | uppercase }}</template>
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
			entry: {
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

				return this.$store.getters['horses/getSingleHorse'](this.entry.horseID);
			}
		},
		methods: {
			toggleDropDown() {
				this.show = !this.show;
			}
		}
	}
</script>