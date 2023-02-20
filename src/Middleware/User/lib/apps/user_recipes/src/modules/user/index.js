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
		return fetch(routes.getUserInfo, {
			headers:headers.get()
		})
			.then(response => {
				return headers.parseResponse(response);
			})
			.then(res => {
				const {payload} = res;
				if(payload.isLoggedIn){
					for (const [key, value] of Object.entries(payload.data)) {
						storage.set(key, value);
					}
				}else{
					window.location.href = routes.login;
				}
				
				user.initialised = true;
				user.isLoggedIn = payload.isLoggedIn;
			});
	}
}

export default user;