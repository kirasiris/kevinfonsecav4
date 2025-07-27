import { notFound } from "next/navigation";
import { fetchurl } from "@/helpers/setTokenOnServer";
import UpdateNewsletterSubscriberForm from "@/forms/noadmin/newslettersubscribers/updatenewslettersubscriberform";

async function getNewsletterSubscriber(params) {
	const res = await fetchurl(
		`/global/newslettersubscribers${params}`,
		"GET",
		"no-cache"
	);
	if (!res.success) notFound();
	return res;
}

const UpdateNewsletterSubscriber = async ({ params, searchParams }) => {
	const awtdParams = await params;
	const awtdSearchParams = await searchParams;
	const newslettersubscriber = await getNewsletterSubscriber(
		`/${awtdParams.id}`
	);

	return <UpdateNewsletterSubscriberForm object={newslettersubscriber} />;
};

export default UpdateNewsletterSubscriber;
