const robots = () => {
	return {
		rules: {
			userAgent: "*",
			allow: "/",
			disallow: ["/noadmin", "/dashboard", "playground"],
		},
		sitemap: "https://kevinfonseca.vercel.app/blog/sitemap.xml",
	};
};

export default robots;
