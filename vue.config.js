const path = require("path");
let vars = path.resolve(__dirname, "src/global.less");
module.exports = {
	chainWebpack: (config) => {
		// 环境变量
		config.plugin("define").tap((args) => {
			const ENV = process.env.VUE_APP_ENV;
			if (!ENV) {
				args[0]["process.env"].VUE_APP_ENV = '"development"';
			}

			return args;
		});
	},

	css: {
		loaderOptions: {
			less: {
				globalVars: {
					hack: `true; @import "${vars}"`,
					// white: '#fff'
				},
			},
		},
	},

	devServer: {
		proxy: {
			"^/": {
				target: "http://localhost:3000",
				changeOrigin: true,
				// secure: false,
				pathRewrite: {
					"/": "",
				},
			},
		},
	},
};
