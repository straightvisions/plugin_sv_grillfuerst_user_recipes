const storage = {
	appStorage : 'svGrillfuerstUserRecipes',

	getStorage : () => {
		let _storage = localStorage.getItem(storage.appStorage);
		return _storage ? JSON.parse(_storage) : {};
	},
	
	setStorage : (_storage) => {
		localStorage.setItem(storage.appStorage, JSON.stringify(_storage));
	},
	
	set : (key, val) => {
		let _storage = storage.getStorage();
		_storage[key] = val;
		storage.setStorage(_storage);
	},
	
	get : (key, def = '') => {
		const _storage = storage.getStorage();
		return _storage.hasOwnProperty(key) ? _storage[key] : def;
	},
	
	getToken : () => {
		const tokenString = document.cookie
			.split(';')
			.map(cookie => cookie.trim())
			.find(cookie => cookie.startsWith('svGrillfuerstUserRecipesToken='));

		return tokenString ? tokenString.split('=')[1] : '';
	}
}

window.addEventListener('storage', function(event) {
	if (event.key === storage.appStorage) {
		// Do something with the updated localStorage data
		console.log('localStorage data updated:', event.newValue);
	}
});

export default storage;