import { notFound } from "next/navigation";
import { fetchurl } from "@/helpers/setTokenOnServer";
import UpdateSettingForm from "@/forms/noadmin/settings/updatesettingform";

async function getSetting(params) {
	const res = await fetchurl(`/global/settings${params}`, "GET", "no-cache");
	if (!res.success) notFound();
	return res;
}

const UpdateSetting = async ({ params, searchParams }) => {
	const awtdParams = await params;
	const awtdSearchParams = await searchParams;
	const setting = await getSetting(`/${awtdParams.id}`);

	return <UpdateSettingForm token={token} auth={auth} object={setting} />;
};

export default UpdateSetting;
