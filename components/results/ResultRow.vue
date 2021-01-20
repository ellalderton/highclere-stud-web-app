<template>
	<tr class="results__row" v-if="horse">
		<td class="results__result" :class="{'results__result--first': result.position == 1}">{{ result.position }}<sup>{{ result.position | numberToPosition }}</sup></td>
		<td>
			<nuxt-link v-if="horse" :to="`/horse/${horse.id}`">{{ result.animalName | uppercase }}</nuxt-link>		
		</td>
		<td><span v-if="horse">{{ horseTrainer }}</span></td>
		<td>{{ result.raceCountry }}</td>
		<td>{{ result.raceCourse }}</td>
		<td>{{ result.raceName | uppercase }}, {{ result.raceDetails | uppercase }}</td>
		<td>{{ result.raceDate | formattedDate }}</td>
		<td>{{ result.raceTime }}</td>
		<td class="notes-col" v-if="canSeeNotes">
			<div class="results__row__notes" v-if="horse" >
				<nuxt-link
				    class="list-item__primary-icon list-item__primary-icon--notes [ results__row__notes__item ]" 
				    :class="{'list-item__primary-icon--read': !horse.unread_notes_count}"
				    :to="`/horse/${horse.id}/notes`"
				>           
				    <note-icon-svg/>
				    <span class="list-item__primary-icon-suffix">
				    	{{ horse.unread_notes_count ? horse.unread_notes_count : '&nbsp;' }}
				    </span>
				</nuxt-link>
				<nuxt-link 
				    class="list-item__primary-icon list-item__primary-icon--comments [ results__row__notes__item ]"
				    :class="{'list-item__primary-icon--read': !horse.unread_comments_count}"
				    :to="`/horse/${horse.id}/notes`"
				>
				    <bubble-icon-svg/>
				    <span class="list-item__primary-icon-suffix">
				    	{{ horse.unread_comments_count ? horse.unread_comments_count : '&nbsp;' }}
				    </span>
				</nuxt-link>
			</div>
		</td>
	</tr>
</template>

<script>
	import BubbleIconSvg from '@/assets/svg/bubble.svg';
	import NoteIconSvg from '@/assets/svg/note.svg';
	import horseTrainerMixin from '@/mixins/horseTrainerMixin.js';

	export default {
		mixins: [horseTrainerMixin],
		props: {
			result: {
				required: true,
				type: Object
			},
			canSeeNotes: {
				required: false,
				default: true,
				type: Boolean
			}
		},
		components: {
			BubbleIconSvg,
			NoteIconSvg
		},
		computed: {
			horse() {
				return this.$store.getters['horses/getHorsebyWapi'](this.result.animalID);
			}		
		}
	}
</script>