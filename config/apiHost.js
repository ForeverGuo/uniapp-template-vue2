/*
 * @Description: host 配置
 * @Version: 0.1.0
 */
  
	const wx = 'https://weixin.91160.com'
  const domain = {
		wx
  };

  if (process.env.NODE_ENV == "development") {
    module.exports = domain
  }

  if (process.env.NODE_ENV == "test") {
    module.exports = domain
  }

  if (process.env.NODE_ENV == "production") {
    module.exports = domain
  }

