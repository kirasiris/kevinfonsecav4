import { notFound } from "next/navigation";
import {
	fetchurl,
	getAuthTokenOnServer,
	getUserOnServer,
} from "@/helpers/setTokenOnServer";
import UpdateReviewForm from "@/forms/nfabusiness/reviews/updatereviewform";

async function getReview(params) {
	const res = await fetchurl(`/global/reviews${params}`, "GET", "no-cache");
	if (!res.success) notFound();
	return res;
}

const UpdateReview = async ({ params, searchParams }) => {
	const awtdParams = await params;
	const awtdSearchParams = await searchParams;
	const token = await getAuthTokenOnServer();
	const auth = await getUserOnServer();

	const review = await getReview(`/${awtdParams.id}`);

	return <UpdateReviewForm token={token} auth={auth} object={review} />;
};

export default UpdateReview;
