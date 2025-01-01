import { fetchurl, getUserOnServer } from "@/helpers/setTokenOnServer";
import AdminStatusesMenu from "@/components/admin/adminstatusesmenu";
import Form from "../form";
import List from "@/components/admin/qrcodes/list";
import { revalidatePath } from "next/cache";

async function getQRCodes(params) {
	const res = await fetchurl(
		`/extras/tools/qrcodes${params}`,
		"GET",
		"no-cache"
	);
	return res;
}

const AdminQRCodesGeneratorSearchIndex = async ({ params, searchParams }) => {
	const awtdParams = await params;
	const awtdSearchParams = await searchParams;
	const keyword = awtdSearchParams.keyword || "";
	const page = awtdSearchParams.page || 1;
	const limit = awtdSearchParams.limit || 10;
	const sort = awtdSearchParams.sort || "-createdAt";

	const auth = await getUserOnServer();

	const qrcodes = await getQRCodes(
		`?keyword=${keyword}&page=${page}&limit=${limit}&sort=${sort}`
	);

	const draftIt = async (id) => {
		"use server";
		// const rawFormData = {}
		await fetchurl(`/extras/tools/qrcodes/${id}/draftit`, "PUT", "no-cache");
		revalidatePath(
			`/noadmin/qrcodes/search?keyword=${keyword}&page=${page}&limit=${limit}&sort=${sort}`
		);
	};

	const publishIt = async (id) => {
		"use server";
		// const rawFormData = {}
		await fetchurl(`/extras/tools/qrcodes/${id}/publishit`, "PUT", "no-cache");
		revalidatePath(
			`/noadmin/qrcodes/search?keyword=${keyword}&page=${page}&limit=${limit}&sort=${sort}`
		);
	};

	const trashIt = async (id) => {
		"use server";
		// const rawFormData = {}
		await fetchurl(`/extras/tools/qrcodes/${id}/trashit`, "PUT", "no-cache");
		revalidatePath(
			`/noadmin/qrcodes/search?keyword=${keyword}&page=${page}&limit=${limit}&sort=${sort}`
		);
	};

	const scheduleIt = async (id) => {
		"use server";
		// const rawFormData = {}
		await fetchurl(`/extras/tools/qrcodes/${id}/scheduleit`, "PUT", "no-cache");
		revalidatePath(
			`/noadmin/qrcodes/search?keyword=${keyword}&page=${page}&limit=${limit}&sort=${sort}`
		);
	};

	const handleDelete = async (id) => {
		"use server";
		// const rawFormData = {}
		await fetchurl(
			`/extras/tools/qrcodes/${id}/permanently`,
			"DELETE",
			"no-cache"
		);
		revalidatePath(
			`/noadmin/qrcodes/search?keyword=${keyword}&page=${page}&limit=${limit}&sort=${sort}`
		);
	};

	const handleTrashAll = async () => {
		"use server";
		// const rawFormData = {}
		await fetchurl(`/extras/tools/qrcodes/deleteall`, "PUT", "no-cache");
		revalidatePath(
			`/noadmin/qrcodes/search?keyword=${keyword}&page=${page}&limit=${limit}&sort=${sort}`
		);
	};

	const handleDeleteAll = async () => {
		"use server";
		// const rawFormData = {}
		await fetchurl(
			`/extras/tools/qrcodes/deleteall/permanently`,
			"DELETE",
			"no-cache"
		);
		revalidatePath(
			`/noadmin/qrcodes/search?keyword=${keyword}&page=${page}&limit=${limit}&sort=${sort}`
		);
	};

	return (
		<>
			<AdminStatusesMenu
				allLink="/noadmin/qrcodes"
				publishedLink="/noadmin/qrcodes/published"
				draftLink="/noadmin/qrcodes/draft"
				scheduledLink="/noadmin/qrcodes/scheduled"
				trashedLink="/noadmin/qrcodes/trashed"
				categoriesLink=""
				categoryType=""
			/>
			<div className="row">
				<div className="col">
					<Form auth={auth} />
				</div>
				<div className="col-lg-10">
					<div className="card rounded-0">
						<List
							allLink="/noadmin/qrcodes"
							pageText="QR Codes"
							addLink="/noadmin/qrcodes"
							searchOn="/noadmin/qrcodes"
							objects={qrcodes}
							searchParams={awtdSearchParams}
							handleDraft={draftIt}
							handlePublish={publishIt}
							handleTrash={trashIt}
							handleSchedule={scheduleIt}
							handleDelete={handleDelete}
							handleTrashAllFunction={handleTrashAll}
							handleDeleteAllFunction={handleDeleteAll}
						/>
					</div>
				</div>
			</div>
		</>
	);
};

export default AdminQRCodesGeneratorSearchIndex;
