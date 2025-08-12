import {
	getAuthTokenOnServer,
	getUserOnServer,
} from "@/helpers/setTokenOnServer";
import CreateReviewForm from "@/forms/nfabusiness/reviews/createreviewform";

const CreateReview = async ({ params, searchParams }) => {
	const awtdParams = await params;
	const awtdSearchParams = await searchParams;

	const token = await getAuthTokenOnServer();
	const auth = await getUserOnServer();

	return (
		<CreateReviewForm
			token={token}
			auth={auth}
			params={awtdParams}
			searchParams={awtdSearchParams}
		/>
	);
};

export default CreateReview;
