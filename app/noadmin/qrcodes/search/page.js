import { revalidatePath } from "next/cache";
import { fetchurl, getUserOnServer } from "@/helpers/setTokenOnServer";
import AdminStatusesMenu from "@/components/noadmin/adminstatusesmenu";
import CreateQrCodeForm from "@/forms/noadmin/qrcodes/createqrcodeform";
import List from "@/components/noadmin/qrcodes/list";

async function getQRCodes(params) {
	const res = await fetchurl(`/global/qrcodes${params}`, "GET", "no-cache");
	return res;
}

const AdminQRCodesGeneratorSearchIndex = async ({ params, searchParams }) => {
	const awtdParams = await params;
	const awtdSearchParams = await searchParams;
	const keyword = awtdSearchParams.keyword || "";
	const page = awtdSearchParams.page || 1;
	const limit = awtdSearchParams.limit || 10;
	const sort = awtdSearchParams.sort || "-createdAt";
	const keywordQuery =
		keyword !== "" && keyword !== undefined ? `&keyword=${keyword}` : "";

	const auth = await getUserOnServer();

	const qrcodes = await getQRCodes(
		`?page=${page}&limit=${limit}&sort=${sort}${keywordQuery}`,
	);

	const draftIt = async (id) => {
		"use server";
		// const rawFormData = {}
		await fetchurl(`/noadmin/qrcodes/${id}/draftit`, "PUT", "no-cache");
		revalidatePath(
			`/noadmin/qrcodes/search?page=${page}&limit=${limit}&sort=${sort}${keywordQuery}`,
		);
	};

	const publishIt = async (id) => {
		"use server";
		// const rawFormData = {}
		await fetchurl(`/noadmin/qrcodes/${id}/publishit`, "PUT", "no-cache");
		revalidatePath(
			`/noadmin/qrcodes/search?page=${page}&limit=${limit}&sort=${sort}${keywordQuery}`,
		);
	};

	const trashIt = async (id) => {
		"use server";
		// const rawFormData = {}
		await fetchurl(`/noadmin/qrcodes/${id}/trashit`, "PUT", "no-cache");
		revalidatePath(
			`/noadmin/qrcodes/search?page=${page}&limit=${limit}&sort=${sort}${keywordQuery}`,
		);
	};

	const scheduleIt = async (id) => {
		"use server";
		// const rawFormData = {}
		await fetchurl(`/noadmin/qrcodes/${id}/scheduleit`, "PUT", "no-cache");
		revalidatePath(
			`/noadmin/qrcodes/search?page=${page}&limit=${limit}&sort=${sort}${keywordQuery}`,
		);
	};

	const handleDelete = async (id) => {
		"use server";
		// const rawFormData = {}
		await fetchurl(`/noadmin/qrcodes/${id}/permanently`, "DELETE", "no-cache");
		revalidatePath(
			`/noadmin/qrcodes/search?page=${page}&limit=${limit}&sort=${sort}${keywordQuery}`,
		);
	};

	const handleTrashAll = async () => {
		"use server";
		// const rawFormData = {}
		await fetchurl(`/noadmin/qrcodes/deleteall`, "PUT", "no-cache");
		revalidatePath(
			`/noadmin/qrcodes/search?page=${page}&limit=${limit}&sort=${sort}${keywordQuery}`,
		);
	};

	const handleDeleteAll = async () => {
		"use server";
		// const rawFormData = {}
		await fetchurl(
			`/noadmin/qrcodes/deleteall/permanently`,
			"DELETE",
			"no-cache",
		);
		revalidatePath(
			`/noadmin/qrcodes/search?page=${page}&limit=${limit}&sort=${sort}${keywordQuery}`,
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
					<CreateQrCodeForm auth={auth} />
				</div>
				<div className="col-lg-10">
					<div className="card rounded-0">
						<List
							allLink="/noadmin/qrcodes"
							pageText="QR Codes"
							addLink=""
							searchOn="/noadmin/qrcodes"
							searchedKeyword={keyword}
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
