<template>
    <div class="info-group mt-4" id="results">
        <div class="info-group__heading info-group__heading--secondary">
            <h3 class="py-1">Upcoming Entries</h3>
        </div>

        <div class="entries__container">
    
            <div>
                <entry-accordion-item 
                    v-for="(entry, index) in entries" 
                    :entry="entry"
                    :profile-horse="horse"
                    :key="`upcoming-item-${index}`"
                />
            </div>
        </div>
    </div>
</template>

<script>
    import EntryAccordionItem from '@/components/entry/EntryAccordionItem';

    export default {
        props: {
            entries: {
                required: true,
                type: Array
            },
            horse: {
                required: true,
                type: Object
            }
        },
        components: {
            EntryAccordionItem
        }
    }
</script>