import {
	getAuthTokenOnServer,
	getUserOnServer,
} from "@/helpers/setTokenOnServer";
import CreateWeaponForm from "@/forms/nfabusiness/weapons/createweaponform";

const CreateWeapon = async ({ params, searchParams }) => {
	const token = await getAuthTokenOnServer();
	const auth = await getUserOnServer();

	return (
		<div className="container-fluid px-0">
			<CreateWeaponForm token={token} auth={auth} />
		</div>
	);
};

export default CreateWeapon;
