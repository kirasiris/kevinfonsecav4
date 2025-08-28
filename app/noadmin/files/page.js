import { revalidatePath } from "next/cache";
import {
	fetchurl,
	getAuthTokenOnServer,
	getUserOnServer,
} from "@/helpers/setTokenOnServer";
import AdminStatusesMenu from "@/components/noadmin/adminstatusesmenu";
import List from "@/components/noadmin/files/list";

async function getFiles(params) {
	const res = await fetchurl(`/global/files${params}`, "GET", "no-cache");
	return res;
}

const AdminFilesIndex = async ({ params, searchParams }) => {
	const awtdParams = await params;
	const awtdSearchParams = await searchParams;
	const page = awtdSearchParams.page || 1;
	const limit = (awtdSearchParams.limit = 28);
	const sort = awtdSearchParams.sort || "-createdAt";

	const token = await getAuthTokenOnServer();
	const auth = await getUserOnServer();

	const files = await getFiles(`?page=${page}&limit=${limit}&sort=${sort}`);

	const handleDelete = async (id, publicId) => {
		"use server";
		// const rawFormData = {}
		await fetchurl(`/noadmin/files/${id}/permanently`, "DELETE", "no-cache");
		await fetchurl(
			`/uploads/deleteobject?publicId=${publicId}`,
			"DELETE",
			"no-cache"
		);
		revalidatePath(`/noadmin/files?page=${page}&limit=${limit}&sort=${sort}`);
	};

	const handleDeleteAll = async () => {
		"use server";
		// const rawFormData = {}
		await fetchurl(`/noadmin/files/deleteall`, "PUT", "no-cache");
		revalidatePath(`/noadmin/files?page=${page}&limit=${limit}&sort=${sort}`);
	};

	const handleDeleteAllPermanently = async () => {
		"use server";
		// const rawFormData = {}
		await fetchurl(
			`/noadmin/files/deleteall/failed/permanently`,
			"DELETE",
			"no-cache"
		);
		revalidatePath(`/noadmin/files?page=${page}&limit=${limit}&sort=${sort}`);
	};

	return (
		<>
			<AdminStatusesMenu
				allLink="/noadmin/files"
				publishedLink="/noadmin/files/images"
				draftLink=""
				scheduledLink="/noadmin/files/document"
				trashedLink="/noadmin/files/videos"
				categoriesLink="/noadmin/files/audios"
				categoryType=""
			/>
			<div className="card rounded-0">
				<List
					auth={auth}
					token={token}
					id="single"
					name="single"
					multipleFiles={true}
					onModel="Blog"
					allLink="/noadmin/files"
					pageText="Files"
					addLink="/noadmin/files/create"
					searchOn="/noadmin/files"
					objects={files}
					searchParams={awtdSearchParams}
					handleDelete={handleDelete}
					handleDeleteAllFunction={handleDeleteAll}
					handleDeleteAllInvalidPermanentlyFunction={handleDeleteAllPermanently}
				/>
			</div>
		</>
	);
};

export default AdminFilesIndex;
