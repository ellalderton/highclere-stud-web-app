<template>
	<div class="footer-nav">
	    <!-- Hamburger -->
	    <a 
	    	class="[ footer-nav__hamburger ] [ hamburger ]" 
	    	href="#"
	    	@click.prevent="toggleSideMenu"
	    >
	        <span class="sr-only">Skip to the main menu</span>
	        <span class="hamburger__decor" aria-hidden="true" role="presentation">
	            <span class="hamburger__bars"></span>
	        </span>
	    </a>
		
		<template v-if="canSeeNotes">
		    <div class="footer-nav--center">
				<!-- Notes -->
				<a class="site-head__notes" href="#" @click.prevent="goToNotes">
	                <span class="site-head__nav-item-icon" v-if="user">
	                    <span 
	                    	class="site-head__nav-item-badge"
	                    	:class="{'site-head__nav-item-badge--allread': !user.unread_notes}"
	                    >
	                		{{user.unread_notes}}
	                	</span>
	                    <note-icon-svg/>
	                </span>
	            </a>
			</div>

			<div class="footer-nav--center">
		        <!-- Comments -->
		        <a
		        	class="footer-nav__comments"
		        	:class="{'footer-nav__comments--allread': !user.unread_comments}"
		        	href="#"
		        	@click.prevent="goToNotes"
		        	v-if="user"
		        >
		        	{{ user.unread_comments }}
		    	</a>
		    </div>
		</template>

	    <!-- Search button -->
	    <a class="[ footer-nav__search-button ]" href="#" @click.prevent="toggleSearchMenu">
	        <span class="sr-only">Search</span>
	        <span class="footer-nav__search-icon">
	            <search-icon-svg/>
	        </span>
	        <span class="footer-nav__search-close-icon d-none">
	            <close-icon-svg/>
	        </span>
	    </a>
	</div>
</template>

<script>
	import menuMixin from "@/mixins/menuMixin.js";
	import goToNotesMixin from "@/mixins/goToNotesMixin.js";
	import NoteIconSvg from '@/assets/svg/note.svg';

	export default {
		mixins: [menuMixin, goToNotesMixin],
		components: {
			NoteIconSvg
		},
		computed: {
			canSeeNotes() {
				return this.$store.getters['auth/getCanSeeNotes'];
			}
		}
	}
</script>