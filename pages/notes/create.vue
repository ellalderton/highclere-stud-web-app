<template>
	<div class="[ container-fluid container--page ] [ pt-4 ]">

		<page-heading>
			<template slot="backButton">
                <back-button/>
            </template>
            Add New Note
        </page-heading>

		<div class="add-new-note [ row ]">
	        <div class="col-lg-10 offset-lg-1">
	            <div class="form-group mb-3">
	            	<label class="add-new-note__label" for="horse">Horse</label>
			    	<auto-complete-dropdown 
			    		v-model="horseId" 
			    		:list="list"
			    		placeholder="Search for horse..."
			    	/>
					
					<div class="list-item list-item--note-tab" v-if="horse">
						<horse-note-details :horse="horse"/>
					</div>
			    	
			    	<hr>

					<add-note
						v-if="horseId"
						:horse-id="horseId"
						v-on:posted="replyPosted"
					/>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	import AutoCompleteDropdown  from '@/components/general/AutoCompleteDropdown';
	import AddNote from '@/components/notes/AddNote';
	import HorseNoteDetails from '@/components/notes/HorseNoteDetails';

	export default {
		middleware: ['can-see-notes', 'can-add-notes'],
		data() {
			return {
				horseId: null,
			}
		},
		components: {
			AutoCompleteDropdown,
			AddNote,
			HorseNoteDetails
		},
		computed: {
			list() {
		    	return this.$store.getters['horses/getHorseSearchList'];
		    },
		    horse() {
				if(!this.horseId) return null;

				return this.$store.getters['horses/getSingleHorse'](this.horseId);
			}
		},
		created() {
			if(this.$route.query.id) { // then preselect that horse
				this.horseId = parseInt(this.$route.query.id);
			}
		},
		methods: {
			replyPosted() {
				this.$router.push(`/horse/${this.horseId}/notes`);
			}
		}
	}
</script>