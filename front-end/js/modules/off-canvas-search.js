/*------------------------------------*\
    MODULES
\*------------------------------------*/
import { debounce } from "debounce";

/*------------------------------------*\
    SITE NAV
\*------------------------------------*/
class OffCanvasSearch {
    constructor(passedElement) {
        let self = this;

        self.elem = passedElement;
    }

    init() {
        let self = this;


        self.setHeight();

        window.addEventListener('resize', () => {
            debounce(self.setHeight(), 200);
        });

        const toggles = document.querySelectorAll('.js-search-toggle');
        const app = document.querySelector('.js-app');
        const body = document.querySelector('body');

        toggles.forEach(function (item) {
            item.addEventListener('click', evt => {
                evt.preventDefault();
                app.classList.toggle('is-offset--search');
                body.classList.toggle('is-no-scroll');
            });
        });
    }

    setHeight() {
        let self = this;

        let vh = window.innerHeight * 0.01;
        document.documentElement.style.setProperty('--vh', `${vh}px`);
    }
}

export default OffCanvasSearch;
