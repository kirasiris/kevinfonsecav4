module.exports = {
	siteUrl: `localhost:3000`,
	generateRobotsTxt: true,
	robotsTxtOptions: {
		policies: [
			{
				userAgent: "*",
				allow: "/",
			},
		],
	},
	exclude: ["/noadmin", "/dashboard"],
};
