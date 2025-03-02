const robots = () => {
	return {
		rules: {
			userAgent: "*",
			allow: "/",
			disallow: ["/noadmin", "/dashboard", "playground"],
		},
		sitemap: "https://kevinurielfonseca.me/blog/sitemap.xml",
	};
};

export default robots;
