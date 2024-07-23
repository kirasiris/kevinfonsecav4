/** @type {import('next').NextConfig} */
const nextConfig = {
	// output: "export",
	// distDir: "dist",
	compress: true,
	devIndicators: {
		buildActivityPosition: "bottom-right",
		buildActivity: true,
	},
	// logging: {
	// 	fetches: {
	// 		fullUrl: true,
	// 	},
	// },
	poweredByHeader: false,
	reactStrictMode: false,
	experimental: {},
	images: {
		remotePatterns: [
			{
				protocol: "https",
				hostname: "**",
			},
			{
				protocol: "http",
				hostname: "**",
			},
		],
	},
	env: {
		apiUrl: `https://befree.herokuapp.com/api/v1`,
		websiteUrl: `https://kevinurielfonseca.github.io`,
		mapboxToken: `pk.eyJ1Ijoia2lyYXNpcmlzIiwiYSI6ImNsMW5zd3huMTB3cGMzZXF1MjBtNDNyam8ifQ.Y9omxfTV8-WjjHhDI6ZHbQ`,
		githubToken: `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`,
		settingsId: `6519d7b34d26360354527e9a`,
	},
	headers: async () => {
		return [
			{
				source: "/:path*{/}?",
				headers: [
					{
						key: `kevins-web`,
						value: `Say hi to me if you see this by referencing this header`,
					},
					{
						key: `kevins-web-security`,
						value: `Do not ever try to paste anything within the console of your browser!`,
					},
					{
						key: `kevins-web-random`,
						value: `Did you know? I've been working on this project for about 6 years starting in 2018? It has been re-done countless times!`,
					},
				],
			},
		];
	},
};

module.exports = nextConfig;
// export default nextConfig;
