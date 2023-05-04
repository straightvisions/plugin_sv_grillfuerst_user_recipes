import storage from './../storage';
import headers from './../headers';
import routes from '../../models/routes';

const disableCache = process.env.REACT_APP_DISABLE_CACHE ? parseInt(process.env.REACT_APP_DISABLE_CACHE) : 0;

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
		storage.set('token', '');
		storage.set('userId', 0);
		storage.set('firstname', '');
		storage.set('lastname', '');
		storage.set('avatar','');
	},
	
	logout: () => {
		user.flush();
		
		// experimental
		fetch('https://staging.grillfuerst.de/customer/logoff', {
			headers: headers.get(),
			method: 'GET',
		});
		
		window.location.reload();
	}
}

export default user;