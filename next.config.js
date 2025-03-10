/** @type {import('next').NextConfig} */
const nextConfig = {
	// output: "export",
	// distDir: "dist",
	compress: true,
	devIndicators: {
		position: "bottom-right",
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
	// 	return [];
	// },
};

module.exports = nextConfig;
// export default nextConfig;
