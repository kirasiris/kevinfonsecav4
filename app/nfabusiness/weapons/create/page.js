import {
	getAuthTokenOnServer,
	getUserOnServer,
} from "@/helpers/setTokenOnServer";
import CreateWeaponForm from "@/forms/nfabusiness/weapons/createweaponform";

const CreateWeapon = async ({ params, searchParams }) => {
	const token = await getAuthTokenOnServer();
	const auth = await getUserOnServer();

	return <CreateWeaponForm token={token} auth={auth} />;
};

export default CreateWeapon;
