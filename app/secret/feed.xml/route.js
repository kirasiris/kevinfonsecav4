import RSS from "rss";
import { fetchurl } from "@/helpers/setTokenOnServer";

export async function GET() {
	const allSecrets = await fetchurl(
		`/extras/secrets?limit=10&status=published`,
		"GET",
		"no-cache"
	);

	const feedOptions = {
		title: `${process.env.NEXT_PUBLIC_WEBSITE_NAME} | Secrets's RSS Feed`,
		description: process.env.NEXT_PUBLIC_WEBSITE_DESCRIPTION,
		feed_url: `${process.env.NEXT_PUBLIC_WEBSITE_URL}/secret/feed.xml`,
		site_url: process.env.NEXT_PUBLIC_WEBSITE_URL,
		copyright: `All rights reserved ${new Date().getFullYear()}, ${
			process.env.NEXT_PUBLIC_WEBSITE_NAME
		}`,
		language: "en",
		pubDate: new Date(),
		ttl: "60",
	};

	const feed = new RSS(feedOptions);

	allSecrets.data.forEach((doc) =>
		feed.item({
			guid: doc._id,
			title: doc.title,
			link: `${process.env.NEXT_PUBLIC_WEBSITE_URL}/secret/${doc._id}`,
			description: "No excerpt",
			author: "ANONYMOUS",
			date: doc.createdAt,
		})
	);

	return new Response(feed.xml({ indent: true }), {
		headers: {
			"Content-Type": "application/atom+xml; charset=utf-8",
		},
	});
}
