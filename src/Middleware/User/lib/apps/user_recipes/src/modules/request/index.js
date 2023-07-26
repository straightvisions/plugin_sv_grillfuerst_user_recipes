import cache from './../cache';
import storage from "../storage";

const request = {
	get: async (url, options = {}) => {
		const { cacheName, ...fetchOptions } = options;
		// default headers
		const headers = {
			Authorization: "Bearer " + storage.get("token")
		};
		// merge headers
		fetchOptions.headers = fetchOptions.headers ? {
			...headers,
			...fetchOptions.headers
		} : headers;
		
		const request = new Request(url, fetchOptions);
	
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
			console.log('fetch');
			const response = await fetch(url, request);
			
			if (response.ok) {
			
				// If cacheName is provided, add the response to the cache
				if (cacheName) {
					cache.setCache(cacheName, request, response.clone());
				}
				
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
