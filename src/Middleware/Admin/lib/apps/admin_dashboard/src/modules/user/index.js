import storage from './../storage';
import headers from './../headers';
import routes from '../../models/routes';

const user = {
	initialised: false,
	isLoggedIn: false,
	get: () => {
		return {
			'id': storage.get('userId', 0),
			'firstname': storage.get('firstname', 'unknown'),
			'lastname': storage.get('lastname', 'unknown'),
			'avatar': storage.get('avatar','')
		}
	},
	
	init: () => {
		const cacheName = "admin-info-cache";
		const maxAge = 60 * 60 * 1000; // 1 hour in milliseconds
		
		caches.open(cacheName).then((cache) => {
			cache.match(routes.getAdminInfo).then((response) => {
				//@todo check why the check hasOwnProperty is needed - somehow the response has no then method
				if (response && Date.now() - new Date(response.headers.get("date")).getTime() < maxAge) {
					// If the response is in the cache and not older than 24 hours, return it
					return response.then(response => headers.parseResponse(response)).then(res => {
						
						const { payload } = res;
						if (payload.isLoggedIn) {
							for (const [key, value] of Object.entries(payload.data)) {
								storage.set(key, value);
							}
						} else {
							window.location.href = routes.login;
						}
						
						user.initialised = true;
						user.isLoggedIn = payload.isLoggedIn;
					});
				} else {
					// If the response is not in the cache or older than 24 hours, fetch it and add it to the cache
					return fetch(routes.getAdminInfo, {
						headers: headers.get(),
					})
						.then((response) => {
							cache.put(routes.getAdminInfo, response.clone());
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
			});
		});
	}
}

export default user;