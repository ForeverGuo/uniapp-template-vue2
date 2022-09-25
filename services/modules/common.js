import { wx } from '@/config/apiHost'
import { get, post } from '@/utils/request.js'

// 测试接口
const test = params => {
  return post(`${wx}/v1/alioss/upload/nykj/leaderboard`, params)
}

export default {
  test
}
