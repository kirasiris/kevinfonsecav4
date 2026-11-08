import {
	getAuthTokenOnServer,
	getUserOnServer,
} from "@/helpers/setTokenOnServer";
import CreateChangelogForm from "@/forms/noadmin/changelogs/createchangelogform";

const CreateChangelog = async ({ params, searchParams }) => {
	const token = await getAuthTokenOnServer();
	const auth = await getUserOnServer();

	return (
		<div className="container-fluid px-0">
			<CreateChangelogForm token={token} auth={auth} />
		</div>
	);
};

export default CreateChangelog;
