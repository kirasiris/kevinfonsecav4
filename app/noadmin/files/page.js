import { revalidatePath } from "next/cache";
import { fetchurl } from "@/helpers/setTokenOnServer";
import AdminMediaLibrary from "@/components/noadmin/adminmedialibrary";
import AdminStatusesMenu from "@/components/noadmin/adminstatusesmenu";

const AdminFilesIndex = async ({ params, searchParams }) => {
	const awtdParams = await params;
	const awtdSearchParams = await searchParams;
	const page = awtdSearchParams.page || 1;
	const limit = awtdSearchParams.limit || 25;
	const sort = awtdSearchParams.sort || "-createdAt";

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
				<AdminMediaLibrary
					params={awtdParams}
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
