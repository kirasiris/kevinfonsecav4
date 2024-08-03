import { fetchurl } from "@/helpers/setTokenOnServer";

const Sitemap = async () => {
	const allJobs = await fetchurl(
		`/jobs?limit=10&status=published`,
		"GET",
		"no-cache"
	);

	const jobs = allJobs.data.map((doc) => {
		return {
			url: `${process.env.NEXT_PUBLIC_WEBSITE_URL}/job/${doc._id}/${doc.slug}`,
			lastModified: doc.updatedAt,
		};
	});

	return [
		{
			title: `${process.env.NEXT_PUBLIC_WEBSITE_NAME} | Jobs's Sitemap`,
			url: process.env.NEXT_PUBLIC_WEBSITE_URL,
			lastModified: new Date(),
		},
		...jobs,
	];
};

export default Sitemap;
