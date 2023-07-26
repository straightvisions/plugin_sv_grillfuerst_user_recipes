import cache from './../cache';
import storage from "../storage";

const request = {
	get: async (url, options = {}) => {
		const { cacheName, ...fetchOptions } = options;
		const headers = {Authorization: "Bearer " + storage.get("token")}
		const request = new Request(url, {...headers, ...fetchOptions});
		
		// Check the cache for the response
		if (cacheName) {
			const cachedResponse = await cache.getCache(cacheName, request);
			if (cachedResponse) {
				console.log('cache');
				return cachedResponse.json();
			}
		}
		
		// Fetch the data
		try {
			const response = await fetch(url, fetchOptions);
			
			if (response.ok) {
			
				// If cacheName is provided, add the response to the cache
				if (cacheName) {
					cache.setCache(cacheName, request, response.clone());
				}
				console.log('fetch');
				return await response.json();
			} else {
				throw new Error('Network response was not ok.');
			}
		} catch (error) {
			console.error('Error fetching data:', error);
			throw error;
		}
	},
	
	// You can add more methods like post, put, delete, etc. following the same pattern.
};

export default request;
