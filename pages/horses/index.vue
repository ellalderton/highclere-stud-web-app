<template>
    <div class="[ container-fluid container--page ] [ pt-4 ]">
        <page-heading>
            <template slot="toggles">
                <div class="list-item__toggle-btns">
                    <div :class="{'active': gridView === 'grid'}" @click.prevent="setView('grid')"><grid-view-svg/></div>
                    <div :class="{'active': gridView === 'list'}" @click.prevent="setView('list')"><list-view-svg/></div>
                </div>
            </template>

            Horses

            <template slot="buttons">
                <button type="button" class="page-header__button" @click.prevent="toggleFilterOpen">
                    <span class="sr-only">Open filter options</span>
                    <filter-icon-svg/>
                </button>
            </template>
        </page-heading>

        <template v-if="horseFilters">
            <div class="filters row" :class="{'filters--expand': filters.open}">
                <div class="col-lg-6">
                    <div class="form-group">
                        <label class="add-new-note__label">Age</label>
                        <select
                            v-model="filters.age"
                            class="form-control form-control-lg [ add-new-note__input ] [ custom-select ]"
                        >
                            <option v-for="filter in horseFilters.age.options" :value="filter.value">{{ filter.text }}</option>
                        </select>
                    </div>
                </div>

                <div class="col-lg-6">
                    <div class="form-group">
                        <label class="add-new-note__label">Gender</label>
                        <select
                            v-model="filters.sex"
                            class="form-control form-control-lg [ add-new-note__input ] [ custom-select ]"
                        >
                            <option v-for="filter in horseFilters.gender.options" :value="filter.value">{{ filter.text }}</option>
                        </select>
                    </div>
                </div>

                <div class="col-lg-6">
                    <div class="form-group">
                        <label class="add-new-note__label">Trainer</label>
                        <select
                            v-model="filters.trainer"
                            class="form-control form-control-lg [ add-new-note__input ] [ custom-select ]"
                        >
                            <option :value="null">All</option>
                            <option v-for="trainer in trainers" :value="trainer.id">{{ trainer.name }}</option>
                        </select>
                    </div>
                </div>

                <div class="col-lg-6">
                    <div class="form-group">
                        <label class="add-new-note__label">Location</label>
                        <select
                            v-model="filters.current_location"
                            class="form-control form-control-lg [ add-new-note__input ] [ custom-select ]"
                        >
                            <option :value="null">All</option>
                            <option v-for="location in locations" :value="location">{{ location }}</option>
                        </select>
                    </div>
                </div>

                <div class="col-lg-6">
                    <div class="form-group">
                        <label class="add-new-note__label">Grouping</label>
                        <select
                            v-model="filters.group"
                            class="form-control form-control-lg [ add-new-note__input ] [ custom-select ]"
                        >
                            <option :value="null">All</option>
                            <option v-for="group in groups" :value="group">{{ group }}</option>                 
                        </select>
                    </div>
                </div>

                <div class="col-lg-6" v-if="!isSyndicateUser">
                    <div class="form-group">
                        <label class="add-new-note__label">Users horses</label>
                        <select
                            v-model="filters.usersHorses"
                            class="form-control form-control-lg [ add-new-note__input ] [ custom-select ]"
                        >
                            <option :value="null">All</option>
                            <option v-for="syndicateUser in syndicateUsers" :value="syndicateUser.id">{{ syndicateUser.name }}</option>
                        </select>
                    </div>
                </div>

                <div class="col-lg-6">
                    <div class="form-group">
                        <label class="add-new-note__label">Sort by</label>
                        <select
                            v-model="filters.sort"
                            class="form-control form-control-lg [ add-new-note__input ] [ custom-select ]"
                        >
                            <option :value="null">Name</option>
                            <option value="note-date">Last note date</option>
                        </select>
                    </div>
                </div>

                <div class="col-12 filters__btns">
                    <app-button secondary v-on:btn-click="submitFilters">Apply Filter</app-button>
                    <app-button primary v-on:btn-click="clearFilters">Reset</app-button>
                </div>

                <div class="col-12">
                    <hr>
                </div>
            </div>
        </template>

        <div class="tab-content" id="tabContent">
            <div class="tab-pane fade show active" role="tabpanel" :class="{'list-item__grid-view': gridView === 'grid'}">
                <div class="list-item" :class="{'list-item--note-tab': canSeeNotes}" v-for="horse in paginatedHorses">
                    <horse-note-details
                        :horse="horse"
                        :key="horse.id"
                        :can-see-notes="canSeeNotes"
                    />
                </div>
            </div>

            <load-spinner v-if="!horses" copy="Loading horses..."/>

            <div v-if="paginatedHorses && !paginatedHorses.length">
                <p class="text-center mt-3">No Horses found</p>
            </div>
        </div>

        <pagination
            v-show="totalPages > 1"
            :last-page="parseInt(totalPages)"
            :current-page="parseInt(pagination.currentPage)"
            v-on:pageChanged="paginate"
        />
    </div>
</template>

<script>
    import horseFilterMixin from "@/mixins/horseFilterMixin.js";
    import FilterIconSvg from '@/assets/svg/filter.svg';
    import GridViewSvg from '@/assets/svg/icon-grid-view.svg';
    import ListViewSvg from '@/assets/svg/icon-list-view.svg';

    export default {
        scrollToTop: true,
        mixins: [horseFilterMixin],
        components: {
            FilterIconSvg,
            GridViewSvg,
            ListViewSvg
        },
        computed: {
            horses() {
                return this.$store.getters['horses/getFilteredHorses'];
            },
            canSeeNotes() {
                return this.$store.getters['auth/getCanSeeNotes'];
            },
            syndicateUsers() {
                return this.$store.getters['horses/getUsersHorses'];
            },
            isSyndicateUser() {
                return this.$store.getters['auth/getIsSyndicate'];
            }
        },
        mounted() {
            // clear pregnancy_status filter for horse in training page.
            this.filters.pregnancy_status = null;
            this.submitFilters(this.pagination.currentPage);
        }
    }
</script>