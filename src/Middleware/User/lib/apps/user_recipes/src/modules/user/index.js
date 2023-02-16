import storage from './../storage';

const user = {
	isLoggedIn: () => {
		// no token at all
		return !!storage.get('token', null);
	},
	get: () => {
		return {
			'id': storage.get('user_id', 0),
			'firstname': storage.get('firstname', 'unknown'),
			'lastname': storage.get('lastname', 'unknown'),
			'avatar': storage.get('avatar','')
		}
	}
}

export default user;