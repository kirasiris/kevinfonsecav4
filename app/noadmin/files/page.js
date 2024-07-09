import { fetchurl } from "@/helpers/setTokenOnServer";
import AdminMediaLibrary from "@/components/admin/adminmedialibrary";
import AdminStatusesMenu from "@/components/admin/adminstatusesmenu";
import { revalidatePath } from "next/cache";

const AdminFilesIndex = async ({ params, searchParams }) => {
	const page = searchParams.page || 1;
	const limit = searchParams.limit || 50;
	const sort = searchParams.sort || "-createdAt";

	const handleDelete = async (id, publicId) => {
		"use server";
		// const rawFormData = {}
		await fetchurl(`/files/${id}/permanently`, "DELETE", "no-cache");
		await fetchurl(
			`/uploads/deleteobject?publicId=${publicId}`,
			"DELETE",
			"no-cache"
		);
		revalidatePath(`/noadmin/files?page=${page}&limit=${limit}&sort=${sort}`);
	};

	const handleTrashAll = async () => {
		"use server";
		// const rawFormData = {}
		await fetchurl(`/files/deleteall`, "PUT", "no-cache");
		revalidatePath(`/noadmin/files?page=${page}&limit=${limit}&sort=${sort}`);
	};

	const handleDeleteAll = async () => {
		"use server";
		// const rawFormData = {}
		await fetchurl(`/files/deleteall`, "DELETE", "no-cache");
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
					params={params}
					searchParams={searchParams}
					handleDelete={handleDelete}
					handleTrashAllFunction={handleTrashAll}
					handleDeleteAllFunction={handleDeleteAll}
				/>
			</div>
		</>
	);
};

export default AdminFilesIndex;
