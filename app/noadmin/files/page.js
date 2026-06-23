import { revalidatePath } from "next/cache";
import { fetchurl, getAuthTokenOnServer } from "@/helpers/setTokenOnServer";
import AdminStatusesMenu from "@/components/noadmin/adminstatusesmenu";
import { getGlobalData } from "@/helpers/globalData";
import FilesWorkSpace from "@/components/noadmin/files/filesworkspace";

async function getFiles(params) {
	const res = await fetchurl(`/global/files${params}`, "GET", "no-cache");
	return res;
}

const AdminFilesIndex = async ({ params, searchParams }) => {
	const awtdParams = await params;
	const awtdSearchParams = await searchParams;
	const page = awtdSearchParams.page || 1;
	const limit = awtdSearchParams.limit || 32;
	const sort = awtdSearchParams.sort || "-createdAt";

	const token = await getAuthTokenOnServer();
	const { auth } = await getGlobalData();

	const files = await getFiles(`?page=${page}&limit=${limit}&sort=${sort}`);

	const handleDeleteAllPermanently = async () => {
		"use server";
		// const rawFormData = {}
		await fetchurl(`/noadmin/files/deleteall`, "DELETE", "no-cache");
		revalidatePath(`/noadmin/files?page=${page}&limit=${limit}&sort=${sort}`);
	};

	const handleDeleteAllUnusedPermanently = async () => {
		"use server";
		// const rawFormData = {}
		await fetchurl(
			`/noadmin/files/deleteall/unused/permanently`,
			"DELETE",
			"no-cache",
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
			<FilesWorkSpace
				auth={auth}
				token={token}
				onModel="Blog"
				allLink="/noadmin/files"
				pageText="Files"
				searchOn="/noadmin/files"
				objects={files}
				searchParams={awtdSearchParams}
				handleDeleteAllFunction={handleDeleteAllPermanently}
				handleDeleteAllUnusedPermanently={handleDeleteAllUnusedPermanently}
			/>
		</>
	);
};

export default AdminFilesIndex;
