/**
 * 验证手机号
 * mobile 手机号
 */
export function verifyMobile(mobile) {
	return /^1[3456789]\d{9}$/.test(mobile)
}


/**
 * 验证身份证号
 * 身份证号合法性验证  支持15位和18位身份证号 支持地址编码、出生日期、校验位验证
 */
export function verifyIDCard(code) {
	let city = {
		11: "北京",
		12: "天津",
		13: "河北",
		14: "山西",
		15: "内蒙古",
		21: "辽宁",
		22: "吉林",
		23: "黑龙江 ",
		31: "上海",
		32: "江苏",
		33: "浙江",
		34: "安徽",
		35: "福建",
		36: "江西",
		37: "山东",
		41: "河南",
		42: "湖北 ",
		43: "湖南",
		44: "广东",
		45: "广西",
		46: "海南",
		50: "重庆",
		51: "四川",
		52: "贵州",
		53: "云南",
		54: "西藏 ",
		61: "陕西",
		62: "甘肃",
		63: "青海",
		64: "宁夏",
		65: "新疆",
		71: "台湾",
		81: "香港",
		82: "澳门",
		91: "国外 "
	};

	// 身份证格式
	if (!code || !/^\d{6}(18|19|20)?\d{2}(0[1-9]|1[12])(0[1-9]|[12]\d|3[01])\d{3}(\d|X)$/i.test(code)) return false

	// 地址编码
	if (!city[code.substr(0, 2)]) return false

	//18位身份证需要验证最后一位校验位
	if (code.length == 18) {
		code = code.split('');
		//∑(ai×Wi)(mod 11)
		//加权因子
		let factor = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2];
		//校验位
		let parity = [1, 0, 'X', 9, 8, 7, 6, 5, 4, 3, 2];
		let sum = 0;
		let ai = 0;
		let wi = 0;
		for (let i = 0; i < 17; i++) {
			ai = code[i];
			wi = factor[i];
			sum += ai * wi;
		}
		let last = parity[sum % 11];
		if (parity[sum % 11] != code[17]) return false
	}

	return true
}
// 判断是否为空
export function isEmpty(value) {
	return value === '' && value.length === 0
}

// 判断某个值是否在两者之间
export function isBetween(value, max, min) {
	return value <= max && value >= min
}

export function verifyFormItem(value, rules) {
    return new Promise((resolve, reject) => {
        for (let i = 0; i < rules.length; i++) {
            let v = rules[i]
            // 必填项
            if (v.required && isEmpty(value)) reject(v.errorMsg)
            
            // 判断位数
            if ((v.max && v.min) && isBetween(value.length))  reject(v.errorMsg)
            
            // 判断是否手机号
            if (v.isMobile && !verifyMobile(value))  reject(v.errorMsg)
            
            // 判断是否身份证号
            if (v.isIDCard && !verifyIDCard(value))  reject(v.errorMsg)
        }
        
        resolve(value)
    })
}

// 表单验证
export const verifyForm = (formData, rules) => {
	return new Promise((resolve, reject) => {
		for (let key in rules) {
			for (let i = 0; i < rules[key].length; i++) {
				let v = rules[key][i]
				let error = {}

				// 必填项
				if (v.required && isEmpty(formData[key])) reject(v.errorMsg)

				// 判断位数
				if ((v.max && v.min) && isBetween(formData[key].length)) reject(v.errorMsg)

				// 判断是否手机号
				if (v.isMobile && !verifyMobile(formData[key])) reject(v.errorMsg)

				// 判断是否身份证号
				if (v.isIDCard && !verifyIDCard(formData[key])) reject(v.errorMsg)
			}
		}
		
		// 验证通过
		resolve(formData)
	})
}

// 判断是否字符串
export function isString(args) {
    return typeof args === 'string'
}

// 判断是否对象
export function isObject(args) {
    return typeof args === 'object' && Object.prototype.toString.call(args) === '[object Object]'
}

// 判断是否纯对象
export function isEmptyObject(args) {
    return JSON.stringify(args) === '{}'
}

// 判断是否数组
export function isArray(args) {
	return Array.isArray(args)
}

// 随机生成中文
// num 生成中文的位数
export function randomChinese(num = 1) {
    // 获取到Unicode码进行解码
    function decodeUnicode(str) {
        str = '\\u' + str
        str = str.replace('/\\/g', '%')
        str = unescape(str)
        str = str.replace(/%/g, '\\')
        return str
    }
    
    // 获取指定范围内的随机数
    function randomAccess(min, max) {
        return Math.floor(Math.random() * (min - max) + max)
    }
    
    // 生成任意长度的中文
    function setChineseLength(len) {
        let chinese = ''
        for(let i = 0; i < len; i++){
            // Unicode中文范围【4e00, 9fa5】
            let chineseUnicode;
            chineseUnicode = randomAccess(0x4e00, 0x9fa5).toString(16)
            chinese += decodeUnicode(chineseUnicode)
        }
        return eval('"' + chinese + '"')
    }
    
    return setChineseLength(num)
}
