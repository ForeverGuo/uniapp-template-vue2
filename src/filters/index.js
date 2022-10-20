import {
    BASE_URL,
    RES_URL
} from '@/config/system_config.js'

export default {
    // 图片路径处理
    imgHandle(value) {
        return value[0] !== '/' ? (RES_URL + '/' + value) : (RES_URL + value)
    },

    // 处理手机号码
    mobileHandle(value) {
        let before = value.slice(0, 3)
        let after = value.slice(7, 11)
        return before + '****' + after
    },

    // 处理时间
    timeHandle(value, isStringNum) {
        if (typeof value === 'string' && value.indexOf('-') != -1) {
            value = value.replace(/-/g, '/')
        }
        if (!!isStringNum) {
            value = parseInt(value)
        }
        let date = new Date(value)
        let year = date.getFullYear()
        let month = date.getMonth() + 1
        let day = date.getDate()
        let hour = date.getHours()
        let minute = date.getMinutes()
        let check = val => (val < 10 ? ('0' + val) : val)
        return [
            [year, check(month), check(day)].join('-'), [check(hour), check(minute)].join(':')
        ].join(' ')
    }
}
