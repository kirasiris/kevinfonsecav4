import { fetchurl } from "@/helpers/setTokenOnServer";

const Sitemap = async () => {
	const allForums = await fetchurl(
		`/forums?limit=10&status=published`,
		"GET",
		"no-cache"
	);

	const forums = allForums.data.map((doc) => {
		return {
			url: `${process.env.NEXT_PUBLIC_WEBSITE_URL}/forum/${doc._id}/${doc.category}/${doc.sub_category}/${doc.slug}`,
			lastModified: doc.updatedAt,
		};
	});

	return [
		{
			title: `${process.env.NEXT_PUBLIC_WEBSITE_NAME} | Forum's Sitemap`,
			url: process.env.NEXT_PUBLIC_WEBSITE_URL,
			lastModified: new Date(),
		},
		...forums,
	];
};

export default Sitemap;
