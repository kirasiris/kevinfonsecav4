import { fetchurl } from "@/helpers/setTokenOnServer";

// export async function generateSitemaps() {
// 	// Fetch the total number of blogs and calculate the number of sitemaps needed
// 	return [{ id: 0 }, { id: 1 }, { id: 2 }, { id: 3 }];
// }

export default async function sitemap({ id }) {
	// Google's limit is 50,000 URLs per sitemap
	const start = id * 50000;
	const end = start + 50000;
	const blogs = await fetchurl(
		`http://localhost:5000/api/v1/blogs?_id[gte]=${start}&_id[lte]=${end}`
	);

	return blogs.map((blog) => ({
		url: `http://localhost:3000/blog/${id}`,
		lastModified: blog.updatedAt,
	}));
}
