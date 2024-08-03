import { fetchurl } from "@/helpers/setTokenOnServer";

const Sitemap = async () => {
	const allSecrets = await fetchurl(
		`/extras/secrets?limit=10&status=published`,
		"GET",
		"no-cache"
	);

	const secrets = allSecrets.data.map((doc) => {
		return {
			url: `${process.env.NEXT_PUBLIC_WEBSITE_URL}/secret/${doc._id}`,
			lastModified: doc.updatedAt,
		};
	});

	return [
		{
			title: `${process.env.NEXT_PUBLIC_WEBSITE_NAME} | Secrets's Sitemap`,
			url: process.env.NEXT_PUBLIC_WEBSITE_URL,
			lastModified: new Date(),
		},
		...secrets,
	];
};

export default Sitemap;
