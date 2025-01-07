const token = process.env.API_USER_TOKEN ?? sv_grillfuerst_admin_dashboard_app_token;
const headers = {
	get: (_headers = []) => {
		let auth = token ? 'Bearer ' + token : '';
		let headers = {
			'Content-Type': 'application/json',
			'Authorization': auth,
			'X-API-KEY': process.env.API_KEY ?? '',
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