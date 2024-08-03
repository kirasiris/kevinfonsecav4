import RSS from "rss";
import { fetchurl } from "@/helpers/setTokenOnServer";

export async function GET() {
	const allForums = await fetchurl(
		`/forums?limit=10&status=published`,
		"GET",
		"no-cache"
	);

	const feedOptions = {
		title: `${process.env.NEXT_PUBLIC_WEBSITE_NAME} | Forum's RSS Feed`,
		description: process.env.NEXT_PUBLIC_WEBSITE_DESCRIPTION,
		feed_url: `${process.env.NEXT_PUBLIC_WEBSITE_URL}/forum/feed.xml`,
		site_url: process.env.NEXT_PUBLIC_WEBSITE_URL,
		copyright: `All rights reserved ${new Date().getFullYear()}, ${
			process.env.NEXT_PUBLIC_WEBSITE_NAME
		}`,
		language: "en",
		pubDate: new Date(),
		ttl: "60",
	};

	const feed = new RSS(feedOptions);

	allForums.data.forEach((doc) =>
		feed.item({
			guid: doc._id,
			title: doc.title,
			link: `${process.env.NEXT_PUBLIC_WEBSITE_URL}/forum/${doc._id}/${doc.category}/${doc.sub_category}/${doc.slug}`,
			description: doc.excerpt,
			author: doc.user.username,
			date: doc.createdAt,
		})
	);

	return new Response(feed.xml({ indent: true }), {
		headers: {
			"Content-Type": "application/atom+xml; charset=utf-8",
		},
	});
}
