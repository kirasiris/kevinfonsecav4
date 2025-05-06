import { fetchurl } from "@/helpers/setTokenOnServer";

const Sitemap = async () => {
	const allThemes = await fetchurl(
		`/global/themes?limit=10&postType=theme&status=published`,
		"GET",
		"no-cache"
	);

	const themes = allThemes.data.map((doc) => {
		return {
			url: `${process.env.NEXT_PUBLIC_WEBSITE_URL}/theme/${doc._id}/${doc.category._id}/${doc.category.slug}/${doc.slug}`,
			lastModified: doc.updatedAt,
		};
	});

	return [
		{
			title: `${process.env.NEXT_PUBLIC_WEBSITE_NAME} | Themes's Sitemap`,
			url: process.env.NEXT_PUBLIC_WEBSITE_URL,
			lastModified: new Date(),
		},
		...themes,
	];
};

export default Sitemap;
