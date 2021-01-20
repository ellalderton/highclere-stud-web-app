/*------------------------------------*\
    SITE HEAD
\*------------------------------------*/
class SiteHead {
    constructor(passedElement) {
        let self = this;

        self.elem = passedElement;
    }

    init() {
        let self = this;

        var lastKnownScrollY = 0;
        var currentScrollY = 0;
        const classes = {
            top: 'is-top',
            pinned: 'is-pinned',
            unpinned: 'is-unpinned',
        };

        function onScroll() {
            currentScrollY = window.pageYOffset;
            if (currentScrollY === 0) {
                top();
            } else if (currentScrollY < lastKnownScrollY) {
                pin();
            } else if (currentScrollY > lastKnownScrollY) {
                unpin();
            }
            lastKnownScrollY = currentScrollY;
        }

        function top() {
            self.elem.classList.remove(classes.unpinned);
            self.elem.classList.remove(classes.pinned);
            self.elem.classList.add(classes.top);
        }

        function pin() {
            self.elem.classList.remove(classes.unpinned);
            self.elem.classList.remove(classes.top);
            self.elem.classList.add(classes.pinned);
        }

        function unpin() {
            self.elem.classList.remove(classes.pinned);
            self.elem.classList.remove(classes.top);
            self.elem.classList.add(classes.unpinned);
        }

        window.onload = function () {
            document.addEventListener('scroll', onScroll, false);
        }
    }
}

export default SiteHead;
