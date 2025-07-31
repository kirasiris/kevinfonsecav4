import {
	getAuthTokenOnServer,
	getUserOnServer,
} from "@/helpers/setTokenOnServer";
import CreateReportForm from "@/forms/noadmin/reports/createreportform";

const CreateReport = async ({ params, searchParams }) => {
	const awtdParams = await params;
	const awtdSearchParams = await searchParams;

	const token = await getAuthTokenOnServer();
	const auth = await getUserOnServer();

	return (
		<CreateReportForm
			token={token}
			auth={auth}
			searchParams={awtdSearchParams}
		/>
	);
};

export default CreateReport;
