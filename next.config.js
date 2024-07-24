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
