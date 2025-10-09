import { notFound } from "next/navigation";
import {
	fetchurl,
	getAuthTokenOnServer,
	getUserOnServer,
} from "@/helpers/setTokenOnServer";
import UpdateCertificateForm from "@/forms/noadmin/companies/updatecertificateform";

async function getCertificate(params) {
	const res = await fetchurl(`/global/companies${params}`, "GET", "no-cache");
	if (!res.success) notFound();
	return res;
}

const UpdateCertificate = async ({ params, searchParams }) => {
	const awtdParams = await params;
	const awtdSearchParams = await searchParams;
	const token = await getAuthTokenOnServer();
	const auth = await getUserOnServer();

	const certificate = await getCertificate(
		`/${awtdParams.id}/certificates/${awtdParams.cert_id}`
	);

	// Redirect if not company
	// !auth?.data?.hasCompany && redirect(`/noadmin/companies`);

	return (
		<UpdateCertificateForm
			token={token}
			auth={auth}
			object={certificate}
			params={awtdParams}
		/>
	);
};

export default UpdateCertificate;
