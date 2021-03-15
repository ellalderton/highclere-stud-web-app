<template>
    <div class="list-item__link" @click.self="goToHorse">
        <div class="list-item__image" aria-hidden="true" role="presentation" @click="goToHorse">
            <horse-avatar :horse="horse"/>
        </div>

        <h2 class="[ list-item__heading ] [ heading--2 ] [ font-weight-normal ] [ pt-3 ]" @click="goToHorse">{{ horse.name | uppercase }}
            <span>{{ horse.ownership ? horse.ownership.name : '' }}</span>
        </h2>
        <img v-if="user.avatar_url && user.role === 'staff'" class="list-item__silk" :src="`${user.avatar_url}?w=100&h=100`" alt="silk">
        <div class="list-item__subheading-wrapper">
            <div class="list-item__icons" v-if="showNoteIcons && canSeeNotes">
                <nuxt-link
                    class="list-item__primary-icon list-item__primary-icon--notes"
                    :class="{'list-item__primary-icon--read': !horse.unread_notes_count}"
                    :to="`/horse/${horse.id}/notes`"
                >
                    <note-icon-svg/>
                    <span class="list-item__primary-icon-suffix" >{{ horse.unread_notes_count ? horse.unread_notes_count : `&nbsp;` }}</span>
                </nuxt-link>
                <nuxt-link
                    class="list-item__primary-icon list-item__primary-icon--comments"
                    :class="{'list-item__primary-icon--read': !horse.unread_comments_count}"
                    :to="`/horse/${horse.id}/notes`"
                >
                    <bubble-icon-svg/>
                    <span class="list-item__primary-icon-suffix">{{ horse.unread_comments_count ? horse.unread_comments_count : `&nbsp;` }}</span>
                </nuxt-link>
            </div>
            <!-- No icons. Keep the div to maintain the vertical space. -->
            <div class="list-item__icons" v-else></div>
        </div>
        <div class="list-item__last-note">
            <template v-if="horse.latest_note_date">
                <span>Last note</span> 
                <span>
                    {{horse.latest_note_date.substring(0, horse.latest_note_date.length - 4)}}{{horse.latest_note_date.substring(horse.latest_note_date.length - 2, horse.latest_note_date.length) }}
                </span>
            </template>
            <template v-else><span>No notes</span></template>
            
        </div>

        <ul class="list-item__stats" ref="statsContainer">
            <li class="list-item__stat">
                <div class="list-item__stat-inner">
                    <span class="list-item__stat-label">
                        Age<span class="sr-only">:</span>
                    </span>
                    <span class="list-item__stat-value">
                        {{ horse.age }}yo
                    </span>
                </div>
            </li>
            <li class="list-item__stat">
                <div class="list-item__stat-inner">
                    <span class="list-item__stat-label">
                        Sex<span class="sr-only">:</span>
                    </span>
                    <span class="list-item__stat-value">
                        {{ getGender | capitalize }}
                    </span>
                </div>
            </li>
            <li class="list-item__stat">
                <div class="list-item__stat-inner">
                    <span class="list-item__stat-label">
                        Sire<span class="sr-only">:</span>
                    </span>
                    <span class="list-item__stat-value">
                        {{ horse.sire ? horse.sire : horse.lineage ? horse.lineage.sire : ''  }}
                    </span>
                </div>
            </li>
            <li class="list-item__stat">
                <div class="list-item__stat-inner">
                    <span class="list-item__stat-label">
                        Dam<span class="sr-only">:</span>
                    </span>
                    <span class="list-item__stat-value">
                        {{ horse.dam ? horse.dam : horse.lineage ? horse.lineage.dam : '' }}
                    </span>
                </div>
            </li>
<!--             <li class="list-item__stat">
                <div class="list-item__stat-inner">
                    <span class="list-item__stat-label">
                        Last note<span class="sr-only">:</span>
                    </span>
                    <span class="list-item__stat-value">
                        {{ horse.latest_note_date }}
                    </span>
                </div>
            </li> -->
        </ul>

        <div class="list-item__progress__container">
            <div class="list-item__progress">
                <div class="list-item__progress__bar" ref="listProgressBar"></div>
            </div>
        </div>

    </div>
</template>

<script>
import BubbleIconSvg from '@/assets/svg/bubble.svg';
import NoteIconSvg from '@/assets/svg/note.svg';
import horseTrainerMixin from '@/mixins/horseTrainerMixin.js';
import HorseAvatar from '@/components/horse/HorseAvatar';

    export default {
        mixins: [horseTrainerMixin],
        props: {
            horse: {
                required: true,
                type: Object
            },
            showNoteIcons: {
                required: false,
                type: Boolean,
                default: true
            },
            canSeeNotes: {
                required: false,
                type: Boolean,
                default: true,
            }
        },
        components: {
            BubbleIconSvg,
            NoteIconSvg,
            HorseAvatar
        },
        mounted() {
            this.$refs.statsContainer.addEventListener('scroll', this.listItemsScroll);
        },
        destroyed() {
            try {
                this.$refs.statsContainer.removeEventListener('scroll', this.listItemsScroll);
            } catch(e) {
                return;
            }
        },
        computed: {
            pregnancyStatus() {
                if(typeof this.horse.pregnancy_status === 'object' && this.horse.pregnancy_status !== null) {
                    return this.horse.pregnancy_status.name;
                }

                return this.horse.pregnancy_status;
            },
            getGender() {
                if(typeof this.horse.sex === 'object') return this.horse.sex.name;

                return this.horse.sex;
            },
            user() {
                return this.$store.getters['auth/getUser'];
            }
        },
        methods: {
            goToHorse() {
                this.$router.push(`/horse/${this.horse.id}`);
            },
            listItemsScroll() {
               let scrollPercentage = 100 * this.$refs.statsContainer.scrollLeft / (this.$refs.statsContainer.scrollWidth - this.$refs.statsContainer.clientWidth);

                this.$refs.listProgressBar.style.left = `${scrollPercentage / 4}px`;
            }
        }
    }
</script>