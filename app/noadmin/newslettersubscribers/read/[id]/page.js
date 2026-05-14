import { notFound } from "next/navigation";
import { fetchurl } from "@/helpers/setTokenOnServer";
import ParseHtml from "@/layout/parseHtml";

async function getNewsletterSubscribers(params) {
	const res = await fetchurl(
		`/global/newslettersubscribers${params}`,
		"GET",
		"no-cache",
	);

	if (!res.success) notFound();
	return res;
}

const ReadNewslettersSubscriber = async ({ params, searchParams }) => {
	const awtdParams = await params;
	const awtdSearchParams = await searchParams;
	const newslettersubscriber = await getNewsletterSubscribers(
		`/${awtdParams.id}`,
	);

	return (
		<div className="row">
			<div className="col-lg-12">
				<article>
					<section className="mb-5">
						{newslettersubscriber?.data?.email}
					</section>
				</article>
			</div>
		</div>
	);
};

export default ReadNewslettersSubscriber;
