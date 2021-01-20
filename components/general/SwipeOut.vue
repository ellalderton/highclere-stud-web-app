<template>
    <div
    class="swipeout"
    :class="{'swipeout--transitioning' : isTransitioning, 'isRead' : isRead}"
    @mousedown.prevent="_clicked"
    >
    <div v-if="hasLeft" class="swipeout__left" ref="left">
        <slot name="left"></slot>
    </div>
    <div v-if="hasRight" class="swipeout__right" ref="right">
        <slot name="right"></slot>
    </div>
    <div class="swipeout__content" ref="content">
        <slot :revealRight="revealRight" :revealLeft="revealLeft" :close="closeActions"></slot>
    </div>
</div>
</template>

<script>
    import ReadIconSvg from '@/assets/svg/envelop-opened.svg';
    import UnreadIconSvg from '@/assets/svg/envelop-closed.svg';

    let Hammer;

    if(process.browser) {
        Hammer = require('hammerjs');
    }

    function reduceSwipe(x) {
        return Math.pow(x, 0.65);
    }
    function translateX(x) {
        if (x === 0)
            return '';
        return `translate3d(${x}px, 0, 0)`;
    }

    export default {
        data() {
            return {
                hammer: null,
                startLeft: 0,
                isActive: false,
                isTransitioning: false,
                direction: null,
                leftOpen: false,
                rightOpen: false,
                leftActionsWidth: 0,
                rightActionsWidth: 0,
                threshold: 45,
                disabled: false,
                stopTimer: null
            }
        },
        props: {
            note: {
                required: true,
                type: Object
            },
            // noteId: {
            // 	required: true,
            // 	type: Number,
            // },
            isRead: {
                required: true,
                type: Boolean
            },
            dropDownOpen: {
                default: false,
                type: Boolean
            },
            noClickThrough: {
                required: false,
                type: Boolean,
                default: false
            }
        },
        components: {
            ReadIconSvg,
            UnreadIconSvg,
        },
        mounted() {
            this.setupSwipe();
        },
        beforeDestroy() {
            if (this.hammer)
                this.hammer.destroy();
            this.hammer = null;
        },
        computed: {
            hasLeft() {
                return 'left' in this.$slots || 'left' in this.$scopedSlots;
            },
            hasRight() {
                return 'right' in this.$slots || 'right' in this.$scopedSlots;
            }
        },
        methods: {
            closeActions() {
                if (this.isActive)
                    return;
                this._animateSlide(0, this._distanceSwiped());
                this.leftOpen = false;
                this.rightOpen = false;
                this.startLeft = 0;
            },
            revealLeft() {
                if (this.isActive)
                    return;
                const oldLeft = this.$refs.content.getBoundingClientRect().left;
                this.leftOpen = true;
                this._animateSlide(this.leftActionsWidth, oldLeft);

            },
            revealRight() {
                if (this.isActive)
                    return;
                const oldLeft = this.$refs.content.getBoundingClientRect().left;
                this.rightOpen = true;
                this._animateSlide(-this.rightActionsWidth, oldLeft);
            },
            setupSwipe() {
                this.hammer = new Hammer.Manager(this.$el, {
                    touchAction: 'pan-y',
                    cssProps: {
                        userSelect: '',
                    },
                });

                const pan = new Hammer.Pan({ event: 'pan' });

                this.hammer.add(pan);
                this.hammer.get('pan').set({ threshold: 0 });
                this.hammer.on('panstart', this._startListener);
                this.hammer.on('panleft panright', this._swipeListener);
                this.hammer.on('panend', this._stopListener);
                this.hammer.on('pancancel', this._stopListener);
            },
            _distanceSwiped() {
                const contentRect = this.$refs.content.getBoundingClientRect();
                const elementRect = this.$el.getBoundingClientRect();
                return contentRect.left - elementRect.left;
            },
            _startListener(event) {
                if (this.disabled)
                    return null;
                this.isTransitioning = false;
                if (event.deltaY >= -5 && event.deltaY <= 5) {
                    this.leftActionsWidth = this.$refs.left ? this.$refs.left.clientWidth : 0;
                    this.rightActionsWidth = this.$refs.right ? this.$refs.right.clientWidth : 0;
                    this.startLeft = this._distanceSwiped();
                    this.isActive = true;
                    if (event.deltaX > 0)
                        this.direction = 'ltr';
                    if (event.deltaX < 0)
                        this.direction = 'rtl';
                }
                this.closeActions();
            },
            _swipeListener(event) {
                if (!this.isActive || this.disabled || (this.isRead && event.deltaX > 0) || (!this.isRead && event.deltaX < 0))
                    return null;
                const newX = this.startLeft + event.deltaX;

                if(newX >= this.threshold || newX <= -this.threshold) {
                    this.hammer.stop();
                    this._stopListener(event)
                }

                // attempting to reveal the right actions after revealing the left actions
                if (this.startLeft === 0 && this.direction === 'ltr' && newX < 0)
                    return this._animateSlide(-reduceSwipe(-newX));
                // attempting to reveal the left actions after revealing the right actions
                if (this.startLeft === 0 && this.direction === 'rtl' && newX > 0)
                    return this._animateSlide(reduceSwipe(newX));
                // attempting to reveal the right actions after starting with the left actions revealed
                if (this.startLeft < 0 && newX > 0)
                    return this._animateSlide(reduceSwipe(newX));
                // attempting to reveal the left actions after starting with the right actions revealed
                if (this.startLeft > 0 && newX < 0)
                    return this._animateSlide(-reduceSwipe(-newX));
                // overswiping left-to-right
                if (newX < -this.rightActionsWidth)
                    // this.hammer.stop();
                return this._animateSlide(-(this.rightActionsWidth + reduceSwipe(Math.abs(newX + this.rightActionsWidth))));
                if (newX > this.leftActionsWidth)
                    // this.hammer.stop();
                return this._animateSlide(+(this.leftActionsWidth + reduceSwipe(Math.abs(newX - this.leftActionsWidth))));
                return this._animateSlide(newX);
            },
            _stopListener(event) {
                if (!this.isActive || this.disabled) {
                    return null;
                }
                clearTimeout(this.stopTimer);
                const oldLeft = this.$refs.content.getBoundingClientRect().left;
                this.isActive = false;


                // close left actions
                if (this.startLeft > 0 && event.deltaX <= -this.threshold) {
                    return this.closeActions(); // _animateSlide(0, oldLeft);
                }

                // close right actions
                if (this.startLeft < 0 && event.deltaX >= this.threshold)
                    return this.closeActions(); // this._animateSlide(0, oldLeft);

                else {
                    const currentLeft = this.startLeft + event.deltaX;
                    // reveal left actions
                    if (this.direction === 'ltr' && currentLeft >= this.threshold && !this.isRead) {
                        this.markAsRead();
                        return this._animateSlide(this.leftActionsWidth, oldLeft);
                    }
                    // reveal right actions
                    if (this.direction === 'rtl' && currentLeft <= -this.threshold && this.isRead) {
                        this.markAsUnread();
                        return this._animateSlide(-this.rightActionsWidth, oldLeft);
                    }
                }

                return this._animateSlide(this.startLeft, oldLeft);
            },
            _clicked() {
                if(!this.noClickThrough && !this.dropDownOpen) {
                    setTimeout(() => {
                        if(!this.isActive && !this.dropDownOpen) {
                            this.$router.push(`/horse/${this.note.horse.id}/notes/${this.note.id}`);
                        }
                    }, 350);
                }
            },
            // shift actions
            _shiftLeftActions(newX) {
                if (!this.hasLeft || newX < 0)
                    return;
                const actions = this.$refs.left;
                const actionsWidth = this.leftActionsWidth;
                const progress = 1 - Math.min(newX / actionsWidth, 1);
                const deltaX = Math.min(newX, actionsWidth);
                const children = actions.children;
                const length = children.length;
                for (let i = 0; i < length; i++) {
                    const child = children[i];
                    const offsetLeft = actionsWidth - child.offsetLeft - child.offsetWidth;
                    child.style.transform = translateX(deltaX + (offsetLeft * progress));
                    if (length > 1)
                        child.style.zIndex = `${length - i}`;
                }

            },
            _shiftRightActions(newX) {
                if (!this.hasRight || newX > 0)
                    return;
                const actions = this.$refs.right;
                const actionsWidth = this.rightActionsWidth;
                const progress = 1 + Math.max(newX / actionsWidth, -1);
                const deltaX = Math.max(newX, -actionsWidth);
                const children = actions.children;

                for (let i = 0; i < children.length; i++) {
                    const child = children[i];
                    child.style.transform = translateX(deltaX - (child.offsetLeft * progress));
                }
            },
            _animateSlide(to, from) {
                if (from) {
                    if ((to - from) === 0)
                        return;
                    this.isTransitioning = true;
                }
                window.requestAnimationFrame(() => {
                    if(this.$refs.content) {
                        this.$refs.content.style.transform = translateX(to);
                        this._shiftLeftActions(to, this.leftActionsWidth);
                        this._shiftRightActions(to, this.rightActionsWidth);
                    }

                });
            },
            markAsRead() {
                if(!this.isRead) {
                    this.disabled = true;

                    this.$store.dispatch('notes/markAsRead', this.note.id)
                    .then((result) => {
                        this.closeActions();
                        this.disabled = false;
                        this.$emit("read");
                    });
                } else {
                    setTimeout(() => {
                        this.closeActions();

                    }, 100);
                }
            },
            markAsUnread() {
                if(this.isRead) {
                    this.disabled = true;

                    this.$store.dispatch('notes/markAsUnread', this.note.id)
                    .then((result) => {
                        this.closeActions();
                        this.disabled = false;
                        this.$emit("unread");
                    });
                } else {
                    setTimeout(() => {
                        this.closeActions();

                    }, 100);
                }
            }
        }
    }
</script>

<style>
.swipeout {
    position: relative;
    overflow: hidden;
    user-select: none;
    display: flex;
    box-shadow: 0 2px 15px 0 rgba(0, 0, 0, 0.1);
    transition: box-shadow 0.3s;
}
.swipeout:hover {
    box-shadow: 0 2px 15px 0 rgba(0, 0, 0, 0.25);
    cursor: pointer;
}
.swipeout.swipeout--disabled {
    user-select: auto;
}
.swipeout .swipeout__left, .swipeout .swipeout__right {
    position: absolute;
    height: 100%;
    display: flex;
    z-index: 1;

    width: 60px;
    justify-content: center;
    align-items: center;

}
.swipeout .swipeout__left .icon {
    width: 28px;
    height: 28px;
}
.swipeout .swipeout__right .icon {
    width: 28px;
    height: 28px;
}
.swipeout.swipeout--transitioning .swipeout__content,
.swipeout.swipeout--transitioning .swipeout-action {
    transition: transform 300ms;
}
.swipeout .swipeout__content {
    width: 100%;
    position: relative;
}
.swipeout__content:before {
    content: '';
    height: 100%;
    width: 15px;
    opacity: 0.41;
    background: -moz-linear-gradient(left, rgba(125,185,232,0) 0%, rgba(0,0,0,1) 100%); /* FF3.6-15 */
    background: -webkit-linear-gradient(left, rgba(125,185,232,0) 0%,rgba(0,0,0,1) 100%); /* Chrome10-25,Safari5.1-6 */
    background: linear-gradient(to right, rgba(125,185,232,0) 0%,rgba(0,0,0,1) 100%);
    position: absolute;
    left: -15px;
    top: 0;
}
.swipeout__content:after {
    content: '';
    height: 100%;
    width: 15px;
    opacity: 0.41;
    background: -moz-linear-gradient(left, rgba(0,0,0,1) 0%, rgba(125,185,232,0) 100%); /* FF3.6-15 */
    background: -webkit-linear-gradient(left, rgba(0,0,0,1) 0%,rgba(125,185,232,0) 100%); /* Chrome10-25,Safari5.1-6 */
    background: linear-gradient(to right, rgba(0,0,0,1) 0%,rgba(125,185,232,0) 100%);
    position: absolute;
    right: -15px;
    top: 0;
}
.swipeout .swipeout__content,
.swipeout .swipeout-action {
    will-change: transform;
}
.swipeout .swipeout__left {
    left: 0;
    transform: translateX(-100%);
}
.swipeout .swipeout__right {
    right: 0;
    transform: translateX(100%);
    background-color: black;
}
.swipeout-list-item {
    outline: none;
}
</style>