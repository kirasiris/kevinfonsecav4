import {
	getAuthTokenOnServer,
	getUserOnServer,
} from "@/helpers/setTokenOnServer";
import CreateSongForm from "@/forms/noadmin/cdalbums/createsongform";

const CreateSong = async ({ params, searchParams }) => {
	const awtdParams = await params;
	const awtdSearchParams = await searchParams;
	const token = await getAuthTokenOnServer();
	const auth = await getUserOnServer();

	return (
		<div className="container-fluid px-0">
			<CreateSongForm token={token} auth={auth} params={awtdParams} />
		</div>
	);
};

export default CreateSong;
