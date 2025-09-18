import {
	getAuthTokenOnServer,
	getUserOnServer,
} from "@/helpers/setTokenOnServer";
import CreateProductForm from "@/forms/nfabusiness/products/createproductform";

const CreateWeapon = async ({ params, searchParams }) => {
	const token = await getAuthTokenOnServer();
	const auth = await getUserOnServer();

	return <CreateProductForm token={token} auth={auth} />;
};

export default CreateWeapon;
