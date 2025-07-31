import CreateSettingForm from "@/forms/noadmin/settings/createsettingform";

const CreateSetting = async ({ params, searchParams }) => {
	return <CreateSettingForm token={token} auth={auth} />;
};

export default CreateSetting;
