import { fetchurl } from "@/helpers/setTokenOnServer";

const Sitemap = async () => {
	const allBlogs = await fetchurl(
		`/global/blogs?limit=10&postType=blog&status=published`,
		"GET",
		"no-cache"
	);

	const blogs = allBlogs.data.map((doc) => {
		return {
			url: `${process.env.NEXT_PUBLIC_WEBSITE_URL}/blog/${doc._id}/${doc.category._id}/${doc.category.slug}/${doc.slug}`,
			lastModified: doc.updatedAt,
		};
	});

	return [
		{
			title: `${process.env.NEXT_PUBLIC_WEBSITE_NAME} | Blog's Sitemap`,
			url: process.env.NEXT_PUBLIC_WEBSITE_URL,
			lastModified: new Date(),
		},
		...blogs,
	];
};

export default Sitemap;
