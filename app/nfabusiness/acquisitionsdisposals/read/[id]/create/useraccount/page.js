import { notFound } from "next/navigation";
import { fetchurl } from "@/helpers/setTokenOnServer";
import CreateUserForm from "@/forms/nfabusiness/acquisitionsdisposals/createuserform";

async function getAcquisitionsDisposals(params) {
	const res = await fetchurl(
		`/global/weaponacquisitionsdisposals${params}`,
		"GET",
		"no-cache",
	);
	if (!res.success) notFound();
	return res;
}

const CreateUser = async ({ params, searchParams }) => {
	const awtdParams = await params;
	const awtdSearchParams = await searchParams;

	const acquisitionsdisposal = await getAcquisitionsDisposals(
		`/${awtdParams.id}`,
	);

	return (
		<div className="container-fluid px-0">
			<CreateUserForm object={acquisitionsdisposal.data} />
		</div>
	);
};

export default CreateUser;
