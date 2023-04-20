const storage = {
	appStorage : 'svGrillfuerstUserRecipesAdmin',
	
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
	
	get: (key, def = '') => {
		const _storage = storage.getStorage();
		const value = _storage.hasOwnProperty(key) ? _storage[key] : def;
		
		try {
			return JSON.parse(value);
		} catch (error) {
			return value;
		}
	}
	
}

window.addEventListener('storage', function(event) {
	if (event.key === storage.appStorage) {
		// Do something with the updated localStorage data
		console.log('localStorage data updated:', event.newValue);
	}
});

export default storage;