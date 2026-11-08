import { notFound } from "next/navigation";
import {
	fetchurl,
	getAuthTokenOnServer,
	getUserOnServer,
} from "@/helpers/setTokenOnServer";
import UpdateCompanyForm from "@/forms/nfabusiness/companies/updatecompanyform";

async function getCompany(params) {
	const res = await fetchurl(`/global/companies${params}`, "GET", "no-cache");
	if (!res.success) notFound();
	return res;
}

const UpdateCompany = async ({ params, searchParams }) => {
	const awtdParams = await params;
	const awtdSearchParams = await searchParams;
	const token = await getAuthTokenOnServer();
	const auth = await getUserOnServer();

	const company = await getCompany(`/${awtdParams.id}`);

	return (
		<div className="container-fluid px-0">
			<UpdateCompanyForm token={token} auth={auth} object={company} />
		</div>
	);
};

export default UpdateCompany;
