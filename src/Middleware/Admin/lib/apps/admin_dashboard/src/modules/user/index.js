import storage from './../storage';
import headers from './../headers';
import routes from '../../models/routes';

const user = {
	initialised: true,
	isLoggedIn: true,
	get: () => {
		return {
			'id': storage.get('userId', 0),
			'firstname': storage.get('firstname', 'unknown'),
			'lastname': storage.get('lastname', 'unknown'),
			'avatar': storage.get('avatar','')
		}
	},
	
	init: () => {
		return fetch(routes.getAdminInfo, {
			headers: headers.get(),
			cache: 'force-cache'
		})
			.then((response) => {
				return headers.parseResponse(response);
			})
			.then(res => {
				const { payload } = res;
				if (payload.isLoggedIn) {
					for (const [key, value] of Object.entries(payload.data)) {
						storage.set(key, value);
					}
				} else {
					//window.location.href = routes.login;
				}
				
				user.initialised = true;
				user.isLoggedIn = payload.isLoggedIn;
			})
			.catch((error) => {
				// Handle the error if the response status is invalid
				console.error(error);
			});
	}
}

export default user;