import { revalidatePath } from "next/cache";
import { fetchurl, getAuthTokenOnServer } from "@/helpers/setTokenOnServer";
import { getGlobalData } from "@/helpers/globalData";
import FilesManager from "@/components/noadmin/files/filesmanager";

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
		<div className="row">
			<div className="col-lg-12">
				<FilesManager
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
			</div>
		</div>
	);
};

export default AdminFilesIndex;
