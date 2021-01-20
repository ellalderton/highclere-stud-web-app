import { shallowMount } from '@vue/test-utils';
import AppButton from '../../../components/general/AppButton';

describe('AppButton.vue', () => {
	test('renders a button', () => {
		const wrapper = shallowMount(AppButton);

		const button = wrapper.find('button');
		expect(button.classes()).toContain('btn');
		expect(button.attributes().disabled).toBeFalsy();
		button.trigger('click');
		expect(wrapper.emitted()['btn-click']).toBeTruthy();
	});

	test('renders a disabled button', () => {
		const wrapper = shallowMount(AppButton, {
			propsData: {
				disabled: true
			}
		});

		const button = wrapper.find('button');

		expect(button.attributes().disabled).toBeTruthy();
		button.trigger('click');
		expect(wrapper.emitted()['btn-click']).toBeFalsy();
	});

	test('renders a white coloured button', () => {
		const wrapper = shallowMount(AppButton, {
			propsData: {
				white: true
			}
		});

		const button = wrapper.find('button');

		expect(button.classes()).toContain('btn');
		expect(button.classes()).toContain('btn-white');
	});

	test('renders a primary coloured button', () => {
		const wrapper = shallowMount(AppButton, {
			propsData: {
				primary: true
			}
		});

		const button = wrapper.find('button');

		expect(button.classes()).toContain('btn');
		expect(button.classes()).toContain('btn-primary');
	});

	test('renders a block button', () => {
		const wrapper = shallowMount(AppButton, {
			propsData: {
				block: true
			}
		});

		const button = wrapper.find('button');

		expect(button.classes()).toContain('btn');
		expect(button.classes()).toContain('btn-block');
	});
	
	test('renders a button with additional classes', () => {
		const wrapper = shallowMount(AppButton, {
			propsData: {
				additionalClasses: 'classOne classTwo'
			}
		});

		const button = wrapper.find('button');

		expect(button.classes()).toContain('btn');
		expect(button.classes()).toContain('classOne');
		expect(button.classes()).toContain('classTwo');
	});

	test('renders an internal link', () => {

		const propUrl = 'home';
		const wrapper = shallowMount(AppButton, {
			propsData: {
				url: propUrl
			}
		});

		const nuxtLink = wrapper.find('a');

		expect(nuxtLink.attributes().to).toBe(propUrl);
	});

	test('renders an external link', () => {

		const propUrl = 'http://www.google.co.uk';
		const wrapper = shallowMount(AppButton, {
			propsData: {
				url: propUrl,
				external: true
			}
		});

		const link = wrapper.find('a');

		expect(link.attributes().href).toBe(propUrl);
		expect(link.attributes().target).toBe('_blank');
	});
});