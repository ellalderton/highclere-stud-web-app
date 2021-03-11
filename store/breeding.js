import axios from 'axios';

export const actions = {
	
	getBreeding(vuexContext, wapiId) {
		const postUrl = `${process.client ? window.location.origin : ''}/w-erapi/4DCGI/MareAPI`;

		let data = {
			"request":"ObtainMareDetails",
		    "parameters":{
		        "animalId": 818940254,
		        "idType":"WAPI"
		    }
		};

		return this.$axios
		.$post(postUrl, 
		data, {
			headers: {}
		})
		.then(response => {
			return response;
		})
		.catch(e => Promise.reject(e));
		
		// fetch(postUrl, {
		// 	method: "POST",
		// 	body: data
		// })
		// .then(response => {
		// 	console.log('HEADERs', response.headers);
		// 	return response.json()
		// })
		// .then(json => {
		// 	console.log('JSON', json);
		// 	return json;
		// })
		// .catch(e => {
		// 	console.log('ERROR!!!', e);
		// 	Promise.reject(e)
		// });
	}
}