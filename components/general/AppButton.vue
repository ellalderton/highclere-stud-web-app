<template>
    <div>
        <template>
            <template v-if="!url">
                <button type="button" :disabled="disabled" class="btn" :class="btnClasses" @click.prevent="$emit('btn-click')">
                    <slot/>
                </button>
            </template>

            <template v-if="url && !external">
                <nuxt-link class="btn" :class="btnClasses" :to="url">
                    <slot/>
                </nuxt-link>
            </template>

            <template v-if="url && external">
                <a :href="url" target="_blank" class="btn" :class="btnClasses"><slot/></a>
            </template>
        </template>
    </div>
</template>

<script>
    export default {
        props: {
            url: {
                required: false,
                type: String,
            },
            external: {
                required: false,
                type: Boolean,
                default: false,
            },
            primary: {
                required: false,
                type: Boolean,
                default: false,
            },
            secondary: {
                required: false,
                type: Boolean,
                default: false,
            },
            white: {
                required: false,
                type: Boolean,
                default: false,
            },
            black: {
                required: false,
                type: Boolean,
                default: false,
            },
            grey: {
                required: false,
                type: Boolean,
                default: false,
            },
            block: {
                required: false,
                type: Boolean,
                default: false,
            },
            additionalClasses: {
                required: false,
                type: String,
                default: null,
            },
            copy: {
                required: false,
                type: String
            },
            disabled: {
                required: false,
                type: Boolean,
                default: false,
            },
            hasIcon: {
                required: false,
                type: Boolean,
                default: false
            }
        },
        computed: {
            btnClasses() {
                let classes = [];

                if(this.primary) {
                    classes.push('btn-primary');
                }

                if(this.secondary) {
                    classes.push('btn-secondary');
                }

                if(this.white) {
                    classes.push('btn-white');
                }

                if(this.black) {
                    classes.push('btn-black');
                }

                if(this.grey) {
                    classes.push('btn-grey');
                }

                if(this.block) {
                    classes.push('btn-block')
                }

                if(this.hasIcon) {
                    classes.push('btn--has-icon')
                }

                if(this.additionalClasses) {
                    classes.push(this.additionalClasses);
                }

                return classes.join(" ");
            }
        }
    }
</script>