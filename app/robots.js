const robots = () => {
	return {
		rules: {
			userAgent: "*",
			allow: "/",
			disallow: "/private/",
		},
		sitemap: "https://acme.com/sitemap.xml",
	};
};

export default robots;
