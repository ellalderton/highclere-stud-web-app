<template>
    <div class="[ container-fluid container--page ] [ pt-4 ]">
        <page-heading>
            <template slot="backButton">
                <back-button/>
            </template>

            {{ horse.name | uppercase }}

            <template slot="sub">
                Last updated {{ horse.updated_at | formattedDate }}
            </template>
        </page-heading>

        <div class="row">
            <div class="col-md-8">
                <div class="items-list">
                    <div class="items-list__item" @click.prevent="doubleClickOpenInModal">
                        <horse-avatar :horse="horse" isProfile/>
                    </div>

                    <template v-if="isMobile">
                        <div class="block-btn-group">
                            <template v-if="canSeeNotes">
                                <app-button
                                    block white
                                    :url="`/horse/${horse.id}/notes`"
                                    v-if="horse.notes_count"
                                    additional-classes="note-btn"
                                >
                                    <span
                                        :class="{
                                        'note-btn__note--unread': horse.unread_notes_count,
                                        'note-btn__note--read': !horse.unread_notes_count
                                    }">
                                        <note-icon-svg/>
                                        <template v-if="horse.unread_notes_count">{{ horse.unread_notes_count }}</template>
                                         {{ 'Note' | pluralize(horse.unread_notes_count) }}
                                    </span>

                                    <span :class="{
                                        'note-btn__comment--unread': horse.unread_comments_count,
                                        'note-btn__comment--read': !horse.unread_comments_count
                                    }">
                                        <comment-icon-svg/>
                                        <template v-if="horse.unread_comments_count">{{ horse.unread_comments_count }}</template>
                                        {{ 'Comment' | pluralize(horse.unread_comments_count) }}
                                    </span>
                                </app-button>

                                <app-button
                                    style="margin-top: 15px"
                                    v-if="canAddNotes"
                                    block primary hasIcon
                                    :url="`/notes/create?id=${horse.id}`"
                                >
                                    <note-icon-svg/>
                                    Add a new note
                                </app-button>
                            </template>


                            <app-button
                                style="margin-top: 15px"
                                block white
                                :url="`/horse/${horse.id}/media`"
                            >All media</app-button>
                        </div>

                        <hr>
                    </template>

                    <template v-if="!isDesktop && raceEntries.length">
                        <horse-profile-entries :entries="raceEntries" :horse="horse" v-if="raceEntries.length"/>
                            <hr>
                    </template>


                    <!-- Details -->
                    <horse-details :horse="horse"/>

                    <!-- Pregnancy details -->
                    <pregnancy-details v-if="horse.pregnancy_status || horse.next_seasons_mating" :horse="horse"/>

                    <!-- Current foal -->
                    <child-details v-if="horse.current_foal" type="Foal" :child="horse.current_foal"/>

                    <!-- Current yearling -->
                    <child-details v-if="horse.current_yearling" type="Yearling" :child="horse.current_yearling"/>

                    <div class="info-group mt-4" v-if="horse.sales.length">
                        <div class="info-group__heading">
                            <h3 class="py-1">Sales Record</h3>
                        </div>
                        
                        <div class="table-responsive-md">
                            <table class="table table--flush-top">
                                <thead>
                                    <tr>
                                        <th>Name</th>
                                        <th>Year</th>
                                        <th>Price</th>
                                        <th>Currency</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="item in horse.sales">
                                        <td>{{ item.name }}</td>
                                        <td>{{ item.year }}</td>
                                        <td>{{ item.price }}</td>
                                        <td>{{ item.currency }}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <template v-if="results">
                        <results-profile
                            id="results-container" 
                            :results="results" 
                            :pagination="resultsPagination"
                            v-on:pageChanged="paginateResults"
                        />
                    </template>
                </div>
            </div>

            <div class="col-md-4 mt-3 mt-md-0">
                <div class="sticky-sidebar">
                    <template v-if="!isMobile">
                        <div class="block-btn-group">
                            <template v-if="canSeeNotes">
                                <app-button
                                    block white
                                    :url="`/horse/${horse.id}/notes`"
                                    v-if="horse.notes_count"
                                    additional-classes="note-btn"
                                >
                                    <span
                                        :class="{
                                        'note-btn__note--unread': horse.unread_notes_count,
                                        'note-btn__note--read': !horse.unread_notes_count
                                    }">
                                        <note-icon-svg/>
                                        <template v-if="horse.unread_notes_count">{{ horse.unread_notes_count }}</template>
                                         {{ 'Note' | pluralize(horse.unread_notes_count) }}
                                    </span>

                                    <span :class="{
                                        'note-btn__comment--unread': horse.unread_comments_count,
                                        'note-btn__comment--read': !horse.unread_comments_count
                                    }">
                                        <comment-icon-svg/>
                                        <template v-if="horse.unread_comments_count">{{ horse.unread_comments_count }}</template>
                                        {{ 'Comment' | pluralize(horse.unread_comments_count) }}
                                    </span>
                                </app-button>

                                <app-button
                                    style="margin-top: 15px"
                                    v-if="canAddNotes"
                                    block primary hasIcon
                                    :url="`/notes/create?id=${horse.id}`"
                                >
                                    <note-icon-svg/>
                                    Add a new note
                                </app-button>
                            </template>

                            <app-button
                                v-if="horse.has_attachments"
                                style="margin-top: 15px"
                                block white
                                :url="`/horse/${horse.id}/media`"
                            >All media</app-button>
                        </div>
                        
                        <hr>

                        <!-- Entries -->
                        <template v-if="raceEntries.length && isDesktop">
                            <horse-profile-entries :entries="raceEntries" :horse="horse" />
                            <hr>
                        </template>
                        
                    </template>

                    <!-- Race data -->
                    <div class="items-list__item items-list__item--boxed" v-if="horse.race_entries_url.length">
                        <h2 class="[ heading--3 ] [ mb-2 ]">Race Data</h2>
                        <div class="flow-vertical--3">
                            <div class="text--para-font">
                                <p>View the Race Data for {{ horse.name }}</p>
                            </div>

                            <div class="row">
                                <div class="col-12">
                                    <app-button external block primary :url="horse.race_entries_url">View Race Data</app-button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

</template>

<script>
    import HorseDetails from '@/components/horse/HorseDetails';
    import ChildDetails from '@/components/horse/ChildDetails';
    import PedigreeDetails from '@/components/horse/PedigreeDetails';
    import PregnancyDetails from '@/components/horse/PregnancyDetails';
    import CommentIconSvg from '@/assets/svg/bubble.svg';
    import NoteIconSvg from '@/assets/svg/note.svg';
    import HorseAvatar from '@/components/horse/HorseAvatar';
    import HorseProfileEntries from '@/components/entry/HorseProfileEntries';
    import ResultsProfile from '@/components/results/ResultsProfile';
    import VueScrollTo from 'vue-scrollto';

    export default {
        scrollToTop: true,
        async asyncData({ store, params, error }) {
            try {
                let [horse] = await Promise.all([
                    store.dispatch('horse/getHorse', params.horse_id),
                ]);

                return { horse };
            } catch(e) {
                error({ statusCode: 404, message: 'Horse not found' });
            }
        },
        data() {
            return {
                isMobile: false,
                isDesktop: true,
                clicks: 0,
                results: null,
                resultsPagination: {
                    totalPages: 1,
                    currentPage: 1,
                    scrollToInterval: null
                },
                progeny: null
            }
        },
        components: {
            ChildDetails,
            HorseDetails,
            PedigreeDetails,
            PregnancyDetails,
            CommentIconSvg,
            NoteIconSvg,
            HorseAvatar,
            HorseProfileEntries,
            ResultsProfile
        },
        mounted() {
            if (process.browser) {
                window.onNuxtReady((app) => {
                    this.isMobileWidth();
                });

                this.isMobileWidth();

                this.getBreeding();
                this.getResults();
                
            }

            window.addEventListener('resize', this.isMobileWidth);
        },
        beforeDestroy() {
            window.removeEventListener('resize', this.isMobileWidth);
            clearInterval(this.scrollToInterval);
        },
        computed: {
            raceEntries() {
                return this.$store.getters['entries/getEntriesForHorse'](this.horse.id);
            },
            canSeeNotes() {
                return this.$store.getters['auth/getCanSeeNotes'];
            },
            canAddNotes() {
                return this.$store.getters['auth/getCanAddNotes'];
            }
        },
        methods: {
            isMobileWidth() {
                if(typeof window !== 'undefined') {
                    if(window.innerWidth < 768) {
                        this.isMobile = true;
                    } else {
                        this.isMobile = false;
                    }

                    if(window.innerWidth < 992) {
                        this.isDesktop = false;
                    } else {
                        this.isDesktop = true;
                    }
                }
            },
            doubleClickOpenInModal() {
                this.clicks++;

                if(this.clicks >= 2) {
                    if(!this.horse.avatar_url) return;

                    const media = {
                        type: 'image',
                        url: this.horse.avatar_url
                    };
                    this.clicks = 0;
                    this.showMedia(media);
                }
            },
            paginateResults(page) {
                this.resultsPagination.currentPage = page;
                this.results = [];
                this.getResults();

                this.$nextTick(() => {
                    this.scrollToInterval = setInterval(() => {
                        if(this.results.length) {
                            VueScrollTo.scrollTo(`#results-container`, 10, {offset: -100});
                            clearInterval(this.scrollToInterval);
                        }

                    }, 200);

                });
            },
            async getResults() {
                let resultsPostData = {
                    wapiId: this.horse.wapi_id,
                    pagination: this.resultsPagination.currentPage
                }

                const response = await this.$store.dispatch('results/individualResults', resultsPostData)
                .catch(error => {
                    this.handleApiError(error);
                });

                this.results = response.performances;
                if(!this.results.length) {
                    this.results = null;
                }
                this.resultsPagination.totalPages = Math.floor(response.resultsFound / response.resultsMax);
            },
            async getBreeding() {

                const response = await this.$store.dispatch('breeding/getBreeding', this.horse.wapi_id)
                .catch(error => {
                    this.handleApiError(error);
                });

                console.log('BREEDING', response.data[0].progeny);
                this.progeny = response.data[0].progeny;
            }
        }
    }
</script>

<style>
    /* Add ellipsis if horse name is too long for container */
    .horse-name {
        white-space: nowrap;
        width: 100%;
        overflow: hidden;
        text-overflow: ellipsis;
    }
</style>