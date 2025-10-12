import { revalidatePath } from "next/cache";
import {
	fetchurl,
	getAuthTokenOnServer,
	getUserOnServer,
} from "@/helpers/setTokenOnServer";
import List from "@/components/dashboard/files/list";

async function getFiles(params) {
	const res = await fetchurl(`/global/files${params}`, "GET", "no-cache");
	return res;
}

const DashboardFilesIndex = async ({ params, searchParams }) => {
	const awtdParams = await params;
	const awtdSearchParams = await searchParams;
	const page = awtdSearchParams.page || 1;
	const limit = awtdSearchParams.limit || 10;
	const sort = awtdSearchParams.sort || "-createdAt";

	const token = await getAuthTokenOnServer();
	const auth = await getUserOnServer();

	const files = await getFiles(
		`?user=${auth?.userId}&page=${page}&limit=${limit}&sort=${sort}`
	);

	const handleDelete = async (id, publicId) => {
		"use server";
		// const rawFormData = {}
		await fetchurl(`/protected/files/${id}/permanently`, "DELETE", "no-cache");
		await fetchurl(
			`/uploads/deleteobject?publicId=${publicId}`,
			"DELETE",
			"no-cache"
		);
		revalidatePath(`/dashboard/files?page=${page}&limit=${limit}&sort=${sort}`);
	};

	const handleDeleteAll = async () => {
		"use server";
		// const rawFormData = {}
		await fetchurl(`/protected/files/deleteall`, "PUT", "no-cache");
		revalidatePath(`/dashboard/files?page=${page}&limit=${limit}&sort=${sort}`);
	};

	const handleDeleteAllPermanently = async () => {
		"use server";
		// const rawFormData = {}
		await fetchurl(
			`/protected/files/deleteall/failed/permanently`,
			"DELETE",
			"no-cache"
		);
		revalidatePath(`/dashboard/files?page=${page}&limit=${limit}&sort=${sort}`);
	};

	return (
		<div className="card rounded-0">
			<List
				auth={auth}
				token={token}
				id="single"
				name="single"
				multipleFiles={true}
				onModel="Blog"
				objects={files}
				searchParams={awtdSearchParams}
				handleDelete={handleDelete}
				handleDeleteAllFunction={handleDeleteAll}
				handleDeleteAllInvalidPermanentlyFunction={handleDeleteAllPermanently}
			/>
		</div>
	);
};

export default DashboardFilesIndex;
