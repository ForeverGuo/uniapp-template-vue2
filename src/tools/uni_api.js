// 跨端api处理
// #ifdef APP-PLUS
const {
	judgeIosPermission, //ios端判断权限
	requestAndroidPermission, //安卓端判断权限
	gotoAppPermissionSetting, // 引导用户跳转到权限设置界面
	checkSystemEnableLocation, //检查定位服务是否开启
} = require('./permission.js');
// #endif

// 提示信息
function modal(title, type = 'toast', callback) {
	if (type == 'toast') {
		uni.showToast({
			title,
			icon: 'none',
			duration: 2000,
		});
	} else if (type == 'modal') {
		uni.showModal({
			title: '温馨提示',
			content: title,
			success: (res) => {
				if (res.confirm) {
					callback && callback();
				}
			},
		});
	}
}

// 复制
export const copy = (value, callback) => {
	// #ifdef APP-PLUS || APP-NVUE || MP
	uni.setClipboardData({
		data: value,
		success: (res) => {
            console.log(res)
                modal('复制成功');
                callback && callback(res);
		},
		fail: (err) => {
			modal('复制失败');
		},
	});
	// #endif
	// #ifdef H5
	if (document.queryCommandSupported('copy')) {
		let textarea = document.createElement('textarea');
		textarea.value = value;
		textarea.readOnly = 'readOnly';
		document.body.appendChild(textarea);
		textarea.select();
		textarea.setSelectionRange(0, value.length);
		let result = document.execCommand('copy');
		if (result) textarea.remove();
        modal('复制成功');
        callback && callback(value);
	} else {
		modal('复制失败');
	}
	// #endif
};

// #ifdef APP-PLUS
// ios端权限
const iosPermission = {
	location: '位置',
	push: '推送',
	camera: '摄像头',
	photoLibrary: '相册',
	record: '麦克风',
	contact: '通讯录',
	calendar: '日历',
	memo: '备忘录',
};

// android端权限
const androidPermission = {
	'android.permission.ACCESS_FINE_LOCATION': '位置权限',
	'android.permission.ACCESS_COARSE_LOCATION': '模糊位置权限',
	'android.permission.CAMERA': '摄像头权限',
	'android.permission.READ_EXTERNAL_STORAGE': '外部存储(含相册)读取权限',
	'android.permission.WRITE_EXTERNAL_STORAGE': '外部存储(含相册)写入权限',
	'android.permission.RECORD_AUDIO': '麦克风权限',
	'android.permission.READ_CONTACTS': '通讯录读取权限',
	'android.permission.WRITE_CONTACTS': '通讯录写入权限',
	'android.permission.READ_CALENDAR': '日历读取权限',
	'android.permission.WRITE_CALENDAR': '日历写入权限',
	'android.permission.READ_SMS': '短信读取权限',
	'android.permission.SEND_SMS': '短信发送权限',
	'android.permission.RECEIVE_SMS': '接收新短信权限',
	'android.permission.READ_PHONE_STATE': '获取手机识别码等信息的权限',
	'android.permission.CALL_PHONE': '拨打电话权限',
	'android.permission.READ_CALL_LOG': '获取通话记录权限',
};
// #endif

// #ifdef MP-WEIXIN
// 小程序端权限
const mpPermission = {
	'scope.userInfo': '用户信息',
	'scope.userLocation': '地理位置',
	'scope.address': '通信地址',
	'scope.userLocationBackground': '后台定位',
	'scope.record': '录音功能',
	'scope.writePhotosAlbum': '保存到相册',
	'scope.camera': '摄像头',
	'scope.invoice': '获取发票',
	'scope.invoiceTitle': '发票抬头',
	'scope.werun': '微信运动步数',
};
// #endif

// 定位权限的检测
export async function isLocationPermission(callback) {
	// #ifdef APP-PLUS
	const platform = uni.getSystemInfoSync().platform;
	if (platform === 'ios') return judgeIosPermission('location');
	if (platform === 'android') {
		// 检测定位服务是否开启
		if (checkSystemEnableLocation()) {
			// 检测是否具有定位权限，没有权限就跳转到授权设置界面
			const permission = await requestAndroidPermission(
				'android.permission.ACCESS_FINE_LOCATION'
			);
			if (permission < 1) {
				modal(
					'我们需要授权获取您的位置信息，以便为您提供更好的服务',
					'modal',
					() => {
						gotoAppPermissionSetting();
					}
				);
			} else {
				callback && callback();
			}
		} else {
			// 给用户一个提示，去开启定位服务
			modal('用户未开启定位服务', 'modal');
		}
	}
	// #endif

	// #ifdef MP-WEIXIN
	uni.authorize({
		scope: 'scope.userLocation',
		success: (res) => {
			// 权限是给了，是具有权限的
			callback && callback();
		},
		fail: (err) => {
			// 用户拒绝授权
			modal(
				'我们需要授权获取您的位置信息，以便为您提供更好的服务',
				'modal',
				() => {
					// 这里需要真机调试，微信开发者工具不生效
					uni.openSetting({
						success: (res) => {},
						fail: (err) => {},
					});
				}
			);
		},
	});
	// #endif

	// #ifdef MP-ALIPAY
	// my.showAuthGuide()
	// 需要的时候再添加
	// #endif
}

// 通用权限检测与提示
export async function permission({
	appIosPermission,
	appAndroidPermission,
	mpWeixinPermission,
	callback,
}) {
	// #ifdef APP-PLUS
	// 获取平台(iOS|Android)
	const platform = uni.getSystemInfoSync().platform;
	if (platform === 'ios') {
		if (!judgeIosPermission(appIosPermission)) {
			modal(
				'我们需要授权获取您的' +
				iosPermission[appIosPermission] +
				'，以便为您提供更好的服务',
				'modal',
				() => {
					gotoAppPermissionSetting();
				}
			);
		} else {
			callback && callback();
		}
	}
	if (platform === 'android') {
		const permission = await requestAndroidPermission(appAndroidPermission);
		if (permission < 1) {
			modal(
				'我们需要授权获取您的' +
				androidPermission[appAndroidPermission] +
				'，以便为您提供更好的服务',
				'modal',
				() => {
					gotoAppPermissionSetting();
				}
			);
		} else {
			callback && callback();
		}
	}
	// #endif
	// #ifdef MP-WEIXIN
	uni.authorize({
		scope: mpWeixinPermission,
		success: (res) => {
			callback && callback();
		},
		fail: (err) => {
			// 用户拒绝授权
			modal(
				'我们需要授权获取您的' +
				mpPermission[mpWeixinPermission] +
				'，以便为您提供更好的服务',
				'modal',
				() => {
					// 这里需要真机调试，微信开发者工具不生效
					uni.openSetting({
						success: (res) => {},
						fail: (err) => {},
					});
				}
			);
		},
	});
	// #endif
}

// 检查系统更新
export function checkAppUpdate(callback) {
	// #ifdef APP-PLUS
	plus.runtime.getProperty(plus.runtime.appid, callback);
	// #endif

	// #ifdef MP
	const updateManager = uni.getUpdateManager();

	// 获取新版本信息
	updateManager.onCheckForUpdate((res) => {
		callback && callback(res);
	});

	updateManager.onUpdateReady(function(res) {
		modal('新版本已经准备好，是否重启应用？', 'modal', () => {
			// 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
			updateManager.applyUpdate();
		});
	});

	updateManager.onUpdateFailed(function(res) {
		// 新的版本下载失败
		modal('新版本下载失败，请退出重试');
	});
	// #endif
}

// 保存图片
export function saveImage(filePath) {
	// #ifdef APP-NVUE || APP-PLUS
		uni.saveImageToPhotosAlbum({
			filePath,
			success(res) {
				modal('图片已保存到: ' + res.path)
			},
			fail(err) {
				// reject(err)
				console.log(err)
				modal('图片保存失败，请重试')
			}
		})
	// #endif
	
	// #ifdef H5
	var oA = document.createElement("a");
	oA.download = 'download_' + new Date().getTime(); // 设置下载的文件名，默认是'下载'
	oA.href = filePath;
	document.body.appendChild(oA);
	oA.click();
	oA.remove();
	// #endif

}
