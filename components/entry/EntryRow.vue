<template>
	<tr class="entries__row" :class="{'entries__row__declared': entry.declared}">
		<td>
			<nuxt-link :to="`/horse/${entry.horseID}`">{{ entry.horseName | uppercase }}</nuxt-link>		
		</td>
		<td><span v-if="horse">{{ horseTrainer }}</span></td>
		<td>{{ entry.raceCountry }}</td>
		<td>{{ entry.courseName }}</td>
		<td>
			<a 
				v-if="entry.link" 
				:href="entry.link" 
				target="_blank"
			>{{ entry.raceName | uppercase }}</a>

			<template v-else>{{ entry.raceName | uppercase }}</template>
			
			
		</td>
		<td>{{ entry.date | formattedDate }}</td>
		<td>{{ entry.time }}</td>
		<td class="notes-col" v-if="canSeeNotes">
			<div class="entries__row__notes" v-if="horse" >
				<nuxt-link
				    class="list-item__primary-icon list-item__primary-icon--notes [ entries__row__notes__item ]" 
				    :class="{'list-item__primary-icon--read': !horse.unread_notes_count}"
				    :to="`/horse/${horse.id}/notes`"
				>           
				    <note-icon-svg/>
				    <span class="list-item__primary-icon-suffix">
				    	{{ horse.unread_notes_count ? horse.unread_notes_count : '&nbsp;' }}
				    </span>
				</nuxt-link>
				<nuxt-link 
				    class="list-item__primary-icon list-item__primary-icon--comments [ entries__row__notes__item ]"
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
			entry: {
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
				return this.$store.getters['horses/getSingleHorse'](this.entry.horseID);
			}
		}
	}
</script>