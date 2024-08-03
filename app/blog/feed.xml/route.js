import RSS from "rss";
import { fetchurl } from "@/helpers/setTokenOnServer";

export async function GET() {
	const allBlogs = await fetchurl(
		`/blogs?postType=blog&status=published`,
		"GET",
		"no-cache"
	);

	const feedOptions = {
		title: `${process.env.NEXT_PUBLIC_WEBSITE_NAME} | Blog's RSS Feed`,
		description: `Export my articles to your website!`,
		feed_url: `${process.env.NEXT_PUBLIC_WEBSITE_URL}/blog/feed.xml`,
		site_url: process.env.NEXT_PUBLIC_WEBSITE_URL,
		copyright: `All rights reserved ${new Date().getFullYear()}, ${
			process.env.NEXT_PUBLIC_WEBSITE_NAME
		}`,
		language: "en",
		pubDate: new Date(),
		ttl: "60",
	};

	const feed = new RSS(feedOptions);

	allBlogs.data.forEach((doc) =>
		feed.item({
			guid: doc._id,
			title: doc.title,
			link: `<a href={${process.env.NEXT_PUBLIC_WEBSITE_URL}/blog/${doc._id}/${doc.category._id}/${doc.category.slug}/${doc.slug}}>${doc.title}</a>`,
			description: doc.excerpt,
			author: doc.user.username,
			date: doc.createdAt,
		})
	);

	return new Response(feed.xml(), {
		headers: {
			"Content-Type": "application/atom+xml; charset=utf-8",
		},
	});
}
