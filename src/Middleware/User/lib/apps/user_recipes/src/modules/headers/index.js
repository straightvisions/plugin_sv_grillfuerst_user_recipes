import storage from './../storage';
const headers = {
	get: (_headers = []) => {
		let auth = storage.get('token', false) ? 'Bearer ' + storage.get('token') : '';
		let headers = {
			'Content-Type': 'application/json',
			'Authorization': auth,
		};
		
		_headers.map((item, index) => headers[index] = item);
		
		return headers;
	},
	
	parseResponse: (response) => {
		const authHeader = response.headers.get('Authorization');
		const token = authHeader ? authHeader.split(' ')[1] : null;
		return response.json().then(payload => ({payload, token}));
	}
	
}

export default headers;