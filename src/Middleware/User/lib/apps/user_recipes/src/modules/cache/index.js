const cache = {
	appCachePrefix: 'svGrillfuerstUserRecipes_',
	
	// Get the full cache name with the prefix
	getCacheName(name) {
		return `${this.appCachePrefix}${name}`;
	},
	
	// Save a fetch response in the cache
	async setCache(cacheName, request, response) {
		const cache = await caches.open(this.getCacheName(cacheName));
		await cache.put(request, response.clone());
	},
	
	// Get a fetch response from the cache
	async getCache(cacheName, request) {
		const cache = await caches.open(this.getCacheName(cacheName));
		return await cache.match(request);
	},
	
	// Delete a specific cache
	async deleteCache(cacheName) {
		return await caches.delete(this.getCacheName(cacheName));
	},
	
	// Clear all caches with the appCachePrefix
	async flushCache() {
		const cacheNames = await caches.keys();
		const appCachePrefix = this.appCachePrefix;
		
		const appCacheNames = cacheNames.filter(name => name.startsWith(appCachePrefix));
		
		for (const cacheName of appCacheNames) {
			await caches.delete(cacheName);
		}
	},
};

export default cache;
