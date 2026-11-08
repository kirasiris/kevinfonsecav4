import {
	getAuthTokenOnServer,
	getUserOnServer,
} from "@/helpers/setTokenOnServer";
import CreateSettingForm from "@/forms/noadmin/settings/createsettingform";

const CreateSetting = async ({ params, searchParams }) => {
	const token = await getAuthTokenOnServer();
	const auth = await getUserOnServer();
	return (
		<div className="container-fluid px-0">
			<CreateSettingForm token={token} auth={auth} />
		</div>
	);
};

export default CreateSetting;
