/** @type {import('next').NextConfig} */
const nextConfig = {
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
		// domains: [
		// 	"www.opengraph.xyz",
		// 	"gravatar.com",
		// 	"s3-us-west-1.amazonaws.com",
		// 	"befreebucket-for-outputs.s3.amazonaws.com",
		// 	"kevinurielfonseca.me",
		// 	"i0.wp.com",
		// 	"res.cloudinary.com",
		// 	"source.unsplash.com",
		// 	"i.ytimg.com",
		// 	"cdn.sstatic.net",
		// 	"setwan.bimakota.go.id",
		// 	"setwan.bimakdota.go.id",
		// 	"https://oaidalleapiprodscus.blob.core.windows.net",
		// 	"static.vecteezy.com",
		// 	"yt3.ggpht.com",
		// ],
	},
};

module.exports = nextConfig;
