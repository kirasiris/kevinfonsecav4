import {
	fetchurl,
	getAuthTokenOnServer,
	getUserOnServer,
} from "@/helpers/setTokenOnServer";
import UpdateWeaponForm from "@/forms/nfabusiness/weapons/updateweaponform";

async function getWeapon(params) {
	const res = await fetchurl(`/noadmin/weapons${params}`, "GET", "no-cache");
	return res;
}

const UpdateWeapon = async ({ params, searchParams }) => {
	const awtdParams = await params;
	const awtdSearchParams = await searchParams;
	const token = await getAuthTokenOnServer();
	const auth = await getUserOnServer();

	const weapon = await getWeapon(`/${awtdParams.id}`);

	return <UpdateWeaponForm token={token} auth={auth} object={weapon} />;
};

export default UpdateWeapon;
