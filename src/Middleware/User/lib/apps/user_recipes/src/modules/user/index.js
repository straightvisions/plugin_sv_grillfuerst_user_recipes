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
		const cacheName = "user-info-cache";
		const maxAge = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
		
		caches.open(cacheName).then((cache) => {
			cache.match(routes.getUserInfo).then((response) => {
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
					return fetch(routes.getUserInfo, {
						headers: headers.get(),
					})
						.then((response) => {
							cache.put(routes.getUserInfo, response.clone());
							return headers.parseResponse(response);
						})
						.then(res => {
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
				}
			});
		});
	}
}

export default user;