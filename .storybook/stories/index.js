import Vue from 'vue';

import { storiesOf } from '@storybook/vue';
import VueInfoAddon from 'storybook-addon-vue-info'
import { action } from '@storybook/addon-actions';
// import results from '../../jest-test-results.json';
// import { withTests } from '@storybook/addon-jest';

import AppButton from '../../components/general/AppButton';
// import AppLink from '../../components/general/AppLink';

storiesOf('App Button', module)
.addDecorator(VueInfoAddon)
// .addDecorator(withTests({ results }))
.add('Button (primary)', () => ({
    components: { AppButton }, 
    methods: {
        handleClick() {
            action('clicked')('Button was clicked');
        }
    },
    template: `
    	<app-button v-on:btn-click="handleClick" primary>Button</app-button>
    `,
// jest: ['AppButton.test.js'],
}))
.add('Button (white)', () => ({
    components: { AppButton }, 
    methods: {
        handleClick() {
            action('clicked')('Button was clicked');
        }
    },
    template: `
        <app-button v-on:btn-click="handleClick" white>Button</app-button>
    `,
// jest: ['AppButton.test.js'],
}))
.add('Button (Block)', () => ({
    components: { AppButton }, 
    methods: {
        handleClick() {
            action('clicked')('Button was clicked');
        }
    },
    template: `
        <app-button v-on:btn-click="handleClick" primary block>Button</app-button>
    `,
// jest: ['AppButton.test.js'],
}))
.add('Button (Disabled)', () => ({
    components: { AppButton }, 
    methods: {
        handleClick() {
            action('clicked')('Button was clicked');
        }
    },
    template: `
        <app-button v-on:btn-click="handleClick" primary :disabled="true">Button</app-button>
    `,
// jest: ['AppButton.test.js'],
}))
.add('Button (Internal Link)', () => ({
    components: { AppButton }, 
    methods: {
        handleClick() {
            action('clicked')('Button was clicked');
        }
    },
    template: `
        <app-button block primary :url="/">Button</app-button>
    `,
// jest: ['AppButton.test.js'],
}));



// storiesOf('App Link', module)
// .addDecorator(VueInfoAddon)
// .add('Default', () => ({
//     components: { AppLink },
//     template: `
//         <app-link to="/">Test</app-link>
//     `
// }))
// .add('With outline', () => ({
//     components: { AppLink },
//     template: `
// 		<div><app-link to="/" outline>Test</app-link></div>
//     `
// }));