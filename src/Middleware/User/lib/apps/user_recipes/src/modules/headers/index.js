import storage from './../storage';

const basicAuth = {
	user: process.env.REACT_APP_BASIC_AUTH_USER,
	password: process.env.REACT_APP_BASIC_AUTH_PASSWORD
};

const headers = {
	get: (_headers = []) => {
		let auth = storage.get('token', false) ? 'Bearer ' + storage.get('token') : null;
		
		if(basicAuth.user && basicAuth.password){
			const basicString = 'Basic ' + btoa(basicAuth.user + ':' + basicAuth.password);
			auth = auth ? auth + ',' + basicString : basicString;
		}
		
		let headers = {
			'Content-Type': 'application/json'
		};
		
		if(auth){
			headers.Authorization = auth;
		}
		
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