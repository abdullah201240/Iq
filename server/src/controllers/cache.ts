import NodeCache from 'node-cache';

// Initialize cache with a TTL (Time-To-Live)
const cache = new NodeCache({ stdTTL: 3600 }); // Cache expires after 1 hour

export default cache; // Export the cache instance
