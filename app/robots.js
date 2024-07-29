const robots = () => {
	return {
		rules: {
			userAgent: "*",
			allow: "/",
			disallow: "/private/",
		},
		sitemap: "https://kevinfonseca.vercel.app/blog/sitemap.xml",
	};
};

export default robots;
