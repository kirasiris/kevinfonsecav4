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
		<div className="container-fluid px-0">
			<CreateReviewForm
				token={token}
				auth={auth}
				params={awtdParams}
				searchParams={awtdSearchParams}
			/>
		</div>
	);
};

export default CreateReview;
