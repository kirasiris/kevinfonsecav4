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
	reactStrictMode: true,
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
	// headers: async () => {
	// 	return [
	// 		{
	// 			source: "/:path*{/}?",
	// 			headers: [{}],
	// 		},
	// 	];
	// },
};

module.exports = nextConfig;
// export default nextConfig;
