import {
	getAuthTokenOnServer,
	getUserOnServer,
} from "@/helpers/setTokenOnServer";
import CreateSettingForm from "@/forms/noadmin/settings/createsettingform";

const CreateSetting = async ({ params, searchParams }) => {
	const token = await getAuthTokenOnServer();
	const auth = await getUserOnServer();
	return <CreateSettingForm token={token} auth={auth} />;
};

export default CreateSetting;
