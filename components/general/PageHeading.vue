<template>
    <div class="page-header [ text-center ] [ mb-4 ]">
        <template v-if="hasBackButtonSlot">
            <slot name="backButton"></slot>
        </template>

        <div class="page-header__toggles" v-if="hasTogglesSlot">
            <slot name="toggles"></slot>
        </div>

        <h1 class="[ heading--1 ]">
            <slot></slot>
        </h1>

        <p v-if="hasSubHeadingSlot" class="font-sans-serif text-dark">
            <slot name="sub"></slot>
        </p>

        <div class="page-header__buttons" v-if="hasButtonsSlot">
            <slot name="buttons"></slot>
        </div>
    </div>
</template>

<script>
    export default {
        computed: {
            hasSubHeadingSlot () {
              return !!this.$slots['sub'] || !!this.$scopedSlots['sub'];
            },
            hasTogglesSlot () {
              return !!this.$slots['toggles'] || !!this.$scopedSlots['toggles'];
            },
            hasButtonsSlot () {
              return !!this.$slots['buttons'] || !!this.$scopedSlots['buttons'];
            },
            hasBackButtonSlot () {
              return !!this.$slots['backButton'] || !!this.$scopedSlots['backButton'];
            }
        }
    }
</script>
