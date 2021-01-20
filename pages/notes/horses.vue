<template>
  <div class="[ container-fluid container--page ] [ pt-4 ]">
    <page-heading>
      Notes
      <template slot="buttons">
        <button type="button" class="page-header__button" @click.prevent="toggleFilterOpen">
          <span class="sr-only">Open filter options</span>
          <filter-icon-svg />
        </button>
      </template>
    </page-heading>
    <client-only>
    <div class="filters row" :class="{'filters--expand': filters.open}">
      <div class="col-lg-6">
        <div class="form-group">
          <label class="add-new-note__label">Notes From</label>
          <select
            v-model="filters.author"
            class="form-control form-control-lg add-new-note__input [ custom-select ]"
          >
            <option :value="null">All Authors</option>
            <option
              v-for="author in orderedAuthors"
              :value="author.id"
            >{{ author.first_name }} {{ author.last_name }}</option>
          </select>
        </div>
      </div>

      <div class="col-lg-6">
        <div class="form-group">
          <label class="add-new-note__label" for>Ownership</label>
          <select
            v-model="filters.owner"
            class="form-control form-control-lg add-new-note__input [ custom-select ]"
          >
            <option :value="null">All Owners</option>
            <option v-for="owner in owners" v-if="owner.name" :value="owner.id">{{ owner.name }}</option>
          </select>
        </div>
      </div>

      <div class="col-lg-6">
        <div class="form-group">
          <label class="add-new-note__label" for>Date From</label>
          <date-picker
            overwrite-classes="form-control form-control-lg add-new-note__input [ custom-datepicker ]"
            name="date_from"
            placeholder="DD-MM-YYYY"
            v-model="filters.from"
            :old="filters.from"
          ></date-picker>
        </div>
      </div>

      <div class="col-lg-6">
        <div class="form-group">
          <label class="add-new-note__label" for>Date To</label>
          <date-picker
            overwrite-classes="form-control form-control-lg add-new-note__input [ custom-datepicker ]"
            name="date_to"
            placeholder="DD-MM-YYYY"
            v-model="filters.to"
            :old="filters.to"
          ></date-picker>
        </div>
      </div>

      <div class="col-12 filters__btns">
        <app-button secondary v-on:btn-click="submitFilter">Apply Filter</app-button>
        <app-button primary v-on:btn-click="resetFilter">Reset</app-button>
      </div>

      <div class="col-12">
        <hr />
      </div>
    </div>

    <div id="notes-container">
      <div id="notes" class="list-item" v-for="note in notes" v-show="notes !== null">
        <horse-note-details :horse="note.horse" :show-note-icons="false" />

        <note-item
          :note="note"
          :key="note.id"
          v-on:minusReadNotes="reload"
          v-on:addReadNotes="reload"
        ></note-item>
      </div>
    </div>

    <div v-show="notes === null">
      <load-spinner v-show="notes === null" copy="Loading notes..." />
    </div>

    <div v-if="notes && !notes.length">
      <p class="text-center mt-3">No Notes found</p>
    </div>

    <pagination
      v-show="totalPages > 1"
      :last-page="parseInt(totalPages)"
      :current-page="parseInt(details.pagination)"
      v-on:pageChanged="paginate"
    />
  </client-only>
  </div>
</template>

<script>
import VueScrollTo from "vue-scrollto";
import notesMixin from "@/mixins/notesMixin.js";

export default {
  middleware: ['can-see-notes'],
  mixins: [notesMixin],
  async asyncData({ store, error }) {
    try {
      let postData = {
        pagination: store.getters["notes/getHorsesPagination"],
        filters: Object.assign({}, store.getters["notes/getFilters"]())
      };

      let [result, authors] = await Promise.all([
        store.dispatch("notes/getNotes", postData),
        store.dispatch("notes/getAuthors")
      ]);

      return {
        notes: result.data,
        totalPages: result.meta.last_page,
        authors
      };
    } catch (e) {
      console.log('ERROR:', e);
      error({ statusCode: 404, message: "Error connecting to API" });
    }
  },
  created() {
    this.filters = Object.assign({}, this.$store.getters["notes/getFilters"]());
    this.details.pagination = this.$store.getters[
      "notes/getHorsesPagination"
    ];
    this.filterSubmitted = this.filters.open;

    // if mark everything as read is clicked, we'll reload the notes
    this.$nuxt.$on("reload_page", () => {
      this.getNotes();
    });

    this.$nuxt.$on("comment_clicked", () => {
      this.resetFilter();
      this.filters.open = false;
    });

    if (process.browser) {
      this.$store.dispatch("auth/user").catch(error => {
        this.handleApiError(error);
      });
    }
  },
  methods: {
    async getNotes() {
      let postData = this.details;
      postData.filters = this.filterSubmitted ? this.filters : {};

      const result = await this.$store
        .dispatch("notes/getNotes", postData)
        .catch(error => {
          this.handleApiError(error);
        });
      this.notes = result.data;
      this.totalPages = result.meta.last_page;

      this.$nextTick(() => {
        VueScrollTo.scrollTo(`#notes-container`, 10, { offset: -150 });
      });
    },
    paginate(pageNum) {
      this.details.pagination = pageNum;
      this.$store.commit("notes/setHorsesPagination", pageNum);
      this.notes = null;

      this.getNotes();
    }
  }
};
</script>
