import Vue from 'vue';
import bugsnag from '@bugsnag/js';
import bugsnagVue from '@bugsnag/plugin-vue';

const bugsnagClient = bugsnag({
  // apiKey: 'e7c9fed49db2d5a249d1341c27613754'
 	apiKey: 'test'
});

bugsnagClient.use(bugsnagVue, Vue);
window.bugsnagClient = bugsnagClient;