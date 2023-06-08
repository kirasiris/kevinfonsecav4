/** @type {import('next').NextConfig} */
const nextConfig = {
	experimental: {
		appDir: true,
	},
	images: {
		domains: [
			"www.opengraph.xyz",
			"gravatar.com",
			"s3-us-west-1.amazonaws.com",
			"befreebucket-for-outputs.s3.amazonaws.com",
			"kevinurielfonseca.me",
			"i0.wp.com",
			"res.cloudinary.com",
			"source.unsplash.com",
			"i.ytimg.com",
			"cdn.sstatic.net",
			"setwan.bimakota.go.id",
			"setwan.bimakdota.go.id",
		],
	},
};

module.exports = nextConfig;
