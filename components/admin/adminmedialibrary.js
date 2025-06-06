import {
	fetchurl,
	getAuthTokenOnServer,
	getUserOnServer,
} from "@/helpers/setTokenOnServer";
import List from "../admin/files/list";

async function getFiles(params) {
	const res = await fetchurl(`/global/files${params}`, "GET", "no-cache");
	return res;
}

const AdminMediaLibrary = async ({
	id = "single",
	name = "single",
	multipleFiles = true,
	onModel = "Blog",
	params = [],
	searchParams = {},
	handleDelete = () => {},
	handleDeleteAllFunction = () => {},
	handleDeleteAllInvalidPermanentlyFunction = () => {},
}) => {
	const token = await getAuthTokenOnServer();
	const auth = await getUserOnServer();

	const page = searchParams.page || 1;
	const limit = searchParams.limit || 50;
	const sort = searchParams.sort || "-createdAt";

	const files = await getFiles(`?page=${page}&limit=${limit}&sort=${sort}`);

	return (
		<List
			auth={auth}
			token={token}
			id={id}
			name={name}
			multipleFiles={multipleFiles}
			onModel={onModel}
			allLink="/noadmin/files"
			pageText="Files"
			addLink="/noadmin/files/create"
			searchOn="/noadmin/files"
			objects={files}
			searchParams={searchParams}
			handleDraft={undefined}
			handlePublish={undefined}
			handleTrash={undefined}
			handleSchedule={undefined}
			handleDelete={handleDelete}
			handleDeleteAllFunction={handleDeleteAllFunction}
			handleDeleteAllInvalidPermanentlyFunction={
				handleDeleteAllInvalidPermanentlyFunction
			}
		/>
	);
};

export default AdminMediaLibrary;
