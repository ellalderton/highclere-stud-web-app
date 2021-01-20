import { configure } from '@storybook/vue';

import Vue from 'vue';
import Vuex from 'vuex'; // Vue plugins

// import BootstrapVue from 'bootstrap-vue'
// Vue.use(BootstrapVue);
// import 'bootstrap/dist/css/bootstrap.css'
// import 'bootstrap-vue/dist/bootstrap-vue.css'

import '!style-loader!css-loader!sass-loader!../assets/sass/app.scss';


// Import your custom components.
import AppButton from '../components/general/AppButton.vue';

// Install Vue plugins.
Vue.use(Vuex);

// Register custom components.
// Vue.component('AppButton', AppButton);

Vue.component('NuxtLink', {
  props:   ['to'],
  methods: {
    log() {
      action('link target')(this.to)
    },
  },
  template: '<a @click="log()" class="btn btn-primary"><slot>NuxtLink</slot></a>',
});

function loadStories() {
  // You can require as many stories as you need.
  require('./stories');
}

configure(loadStories, module);