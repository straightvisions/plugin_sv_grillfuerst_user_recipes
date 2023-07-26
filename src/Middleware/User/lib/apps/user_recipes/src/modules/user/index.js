import storage from './../storage';
import cache from './../cache';
import headers from './../headers';
import routes from '../../models/routes';

const disableCache = process.env.REACT_APP_DISABLE_CACHE ? parseInt(process.env.REACT_APP_DISABLE_CACHE) : 0;

const user = {
	initialised: false,
	isLoggedIn: false,
	get: () => {
		return {
			'id': storage.get('userId', 0),
			// this shouldn't be stored in the local storage.
			'firstname': storage.get('firstname', 'unknown'),
			'lastname': storage.get('lastname', 'unknown'),
			'username': storage.get('username', 'unknown'),
			'avatar': storage.get('avatar','')
		}
	},
	
	init: () => {
		const _user = user.get();
		
		if(_user.id === 0){
			return fetch(routes.getUserInfo, {
				headers: headers.get(),
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
					}
					
					user.initialised = true;
					user.isLoggedIn = payload.isLoggedIn;
				}).catch((error) => {
					storage.set('id', 0);
					user.initialised = true;
					user.isLoggedIn = false;
				});
		}else{
			user.initialised = true;
			user.isLoggedIn = true;
			return true;
		}
	},
	
	flush : () => {
		user.initialised = false;
		user.isLoggedIn = false;
		storage.flush();
		cache.flushCache();
	},
	
	logout: () => {
		user.flush();
		// experimental
		fetch(routes.logout, {
			headers: headers.get(),
			method: 'GET',
		});
		
		window.location.reload();
	}
}

export default user;