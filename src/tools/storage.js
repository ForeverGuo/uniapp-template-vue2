// 本地存储管理
// 每个项目都有一个独立的key
// 注意：本地所有缓存都应该基于APP_NAME去存储，不应该直接使用官方提供的storage相关api
const storageKey = 'DEFAULT'
const storage = {
	// 设置
	setStorage(key, value) {
		const storage = uni.getStorageSync(storageKey) || {};
		storage[key] = value;
		uni.setStorageSync(storageKey, storage);
	},

	// 获取对应key的本地缓存
	getStorage(key) {
		const storage = uni.getStorageSync(storageKey);
		if (!!storage && !!storage[key]) {
			return storage[key];
		}
		return '';
	},

	// 移除对应key的本地缓存
	removeStorage(key) {
		const storage = uni.getStorageSync(storageKey);
		if (!!storage && !!storage[key]) {
			delete storage[key];
			uni.setStorageSync(storageKey, storage);
			return true;
		}
		return false;
	},

	// 清空本地所有缓存
	clearStorage() {
		const storage = uni.getStorageSync(storageKey);
		if (!!storage) {
			uni.removeStorageSync(storageKey);
			return true;
		}
		return false;
	},
};

export default storage;
