const storage = {
	appStorage : 'svGrillfuerstUserRecipes',
	
	getStorage : () => {
		let _storage = localStorage.getItem(storage.appStorage);
		return _storage ? storage.parseJSONRecursively(_storage) : {};
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
	
	parseJSONRecursively : (json) => {
	let obj;
	
	try {
		obj = JSON.parse(json);
	} catch (e) {
		return json;
	}
	
	if (typeof obj !== "object" || obj === null) {
		return obj;
	}
	
	for (const key in obj) {
		obj[key] = storage.parseJSONRecursively(obj[key]);
	}
	
	return obj;
}
}

window.addEventListener('storage', function(event) {
	if (event.key === storage.appStorage) {
		// Do something with the updated localStorage data
	}
});

export default storage;