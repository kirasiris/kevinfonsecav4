const robots = () => {
	return {
		rules: {
			userAgent: "*",
			allow: "/",
			disallow: "/private/",
		},
		sitemap: "https://kevinfonseca.vercel.app/sitemap.xml",
	};
};

export default robots;
