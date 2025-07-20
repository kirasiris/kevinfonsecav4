import {
	getAuthTokenOnServer,
	getUserOnServer,
} from "@/helpers/setTokenOnServer";
import CreateChangelogForm from "@/forms/noadmin/changelogs/createchangelogform";

const CreateChangelog = async ({ params, searchParams }) => {
	const token = await getAuthTokenOnServer();
	const auth = await getUserOnServer();

	return <CreateChangelogForm token={token} auth={auth} />;
};

export default CreateChangelog;
