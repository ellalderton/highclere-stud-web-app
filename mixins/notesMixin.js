import DatePicker from "@/components/general/DatePicker";
import TransitionExpand from "@/components/transitions/TransitionExpand";
import NoteItem from "@/components/notes/NoteItem";
import HorseNoteDetails from "@/components/notes/HorseNoteDetails";
import FilterIconSvg from "@/assets/svg/filter.svg";
import {
  each as _each,
  filter as _filter,
  sortBy as _sortBy
} from "underscore";
import handleApiErrorMixin from "@/mixins/handleApiErrorMixin.js";

const notesMixin = {
  mixins: [handleApiErrorMixin],
  scrollToTop: true,
  data() {
    return {
      details: {
        pagination: 1
      },
      notes: null,
      totalPages: 0,
      filterSubmitted: false,
      filters: {
        owner: null,
        author: null,
        from: null,
        to: null,
        open: false
      }
    };
  },
  components: {
    DatePicker,
    TransitionExpand,
    NoteItem,
    HorseNoteDetails,
    FilterIconSvg
  },
  computed: {
    owners() {
      return this.$store.getters["horses/getOwners"];
    },
    orderedAuthors() {
      return _sortBy(
        this.authors,
        author => `${author.first_name} ${author.last_name}`
      );
    }
  },
  beforeDestroy() {
    this.$nuxt.$off("reload_page");
    this.$nuxt.$off("comment_clicked");
  },
  methods: {
    noteCreatedOrUpdated(note) {
      return note.comment_count ? "Updated" : "Created";
    },
    toggleFilterOpen() {
      this.filters.open = !this.filters.open;
    },
    submitFilter() {
      this.filterSubmitted = true;

      this.notes = null;
      this.totalPages = 0;

      this.details.pagination = 1; // reset pagination
      this.$store.commit("notes/resetPagination");
      this.getNotes();

      const filters = Object.assign({}, this.filters);
      this.$store.commit("notes/setFilters", filters);
    },
    resetFilter() {
      this.filterSubmitted = false;

      this.filters = {
        owner: null,
        author: null,
        from: null,
        to: null,
        open: this.filters.open
      };

      this.$store.commit("notes/clearFilters");

      this.notes = null;
      this.totalPages = 0;
      this.details.pagination = 1; // reset pagination
      this.$store.commit("notes/resetPagination");
      this.getNotes();
    },
    reload() {
      return;
    }
  }
}

export default notesMixin;
