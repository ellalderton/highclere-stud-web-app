import Vue from 'vue';
import moment from 'moment';
import pluralize from 'pluralize';
import numeral from 'numeral';

Vue.filter('uppercase', value => {
	if (!value) return '';
	return value.toUpperCase();
});

Vue.filter('capitalize', value => {
	if (!value) return '';
	value = value.toString();
    return value.charAt(0).toUpperCase() + value.slice(1);
});

/*
	Converts timestamp to 'time ago'.
 */ 
Vue.filter('relativeTime', value => {
	if (!value) return '';
	return moment(value).fromNow();
})

Vue.filter('formattedDate', value => {
	if (!value) return '';
	return moment(value).format('DD/MM/YYYY');
});

// Saturday 19th January 2019
Vue.filter('LongDate', value => {
	if (!value) return '';
	return moment(value).format('dddd Do MMMM YYYY');
});

// 19th January 2019
Vue.filter('mediumDate', value => {
	if (!value) return '';
	return moment(value).format('Do MMMM YYYY');
});


Vue.filter('hypensToSlashesDate', value => {
	if (!value) return '';
	return moment(value, 'DD-MM-YYYY').format('DD/MM/YYYY');
});

Vue.filter('pluralize', (word, num) => {
	if(!word) return '';

	if(!num) return pluralize(word);

	return pluralize(word, num);
});

Vue.filter('extract', (copy, maxLength) => {
	if(copy.length <= maxLength) return copy;

	return `${copy.substring(0, maxLength)}...`;
});

Vue.filter('bytesToKilobytes', value => {
	if(!value) return value;

	return Math.round(value / 1000);
});

Vue.filter('naIfEmpty', (value) => {
	if(!value) return 'n/a';

	return value;
});

Vue.filter('horseAvatar', (url, width, height) => {
	if(!url) return '/images/horse-default-avatar.jpg';

	return `${url.replace(':4443', '')}?w=${width}&h=${height}`;
});

Vue.filter('assetUrl', (url) => {
	return `${url.replace(':4443', '')}`;
});

Vue.filter('hyphenToSpaces', (string) => {
	if(!string) return '';

	return string.split('-').join(' ');
});

Vue.filter('numberToPosition', (num) => {
	let number = parseInt(num);
	if(!Number.isInteger(number)) return '';

	let formattedPos = numeral(number).format('0o')
	return formattedPos.substr(formattedPos.length - 2);

});