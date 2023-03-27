module.exports = {
	siteUrl: `localhost:3000`,
	generateRobotsTxt: true,
	robotsTxtOptions: {
		policies: [
			{
				userAgent: "*",
				disallow: "/admin",
			},
			{
				userAgent: "*",
				allow: "/",
			},
		],
	},
	exclude: ["/admin"],
};
