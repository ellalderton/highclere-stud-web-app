import Vue from 'vue';

import Pagination from '@/components/general/Pagination';
import Vuelidate from 'vuelidate';
import TransitionFade from '@/components/transitions/TransitionFade';
import AppButton from '@/components/general/AppButton';
import BackButton from '@/components/general/BackButton';
import PageHeading from '@/components/general/PageHeading';
import KeyValuePair from '@/components/general/KeyValuePair';
import KeyGroup from '@/components/general/KeyGroup';
import LoadSpinner from '@/components/general/LoadSpinner';

Vue.component('Pagination', Pagination);
Vue.component('TransitionFade', TransitionFade);
Vue.component('AppButton', AppButton);
Vue.component('BackButton', BackButton);
Vue.component('PageHeading', PageHeading);
Vue.component('KeyValuePair', KeyValuePair);
Vue.component('KeyGroup', KeyGroup);
Vue.component('LoadSpinner', LoadSpinner);
Vue.use(Vuelidate);