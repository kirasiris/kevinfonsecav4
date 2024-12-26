import { fetchurl } from "@/helpers/setTokenOnServer";
import ParseHtml from "@/layout/parseHtml";
import PageList from "@/components/admin/menus/pagelist";
import { revalidatePath } from "next/cache";
import { notFound } from "next/navigation";

async function getMenu(params) {
	const res = await fetchurl(`/menus${params}`, "GET", "no-cache");
	if (!res.success) notFound();
	return res;
}

async function getPages(params) {
	const res = await fetchurl(`/pages${params}`, "GET", "no-cache");
	return res;
}

const ReadMenu = async ({ params, searchParams }) => {
	const awtdParams = await params;
	const awtdSearchParams = await searchParams;
	const page = awtdSearchParams.page || 1;
	const limit = awtdSearchParams.limit || 10;
	const sort = awtdSearchParams.sort || "orderingNumber";

	const menu = await getMenu(`/${awtdParams.id}`);
	const pages = await getPages(
		`?resourceId=${menu?.data?._id}&page=${page}&limit=${limit}&sort=${sort}`
	);

	const draftIt = async (id) => {
		"use server";
		// const rawFormData = {}
		await fetchurl(`/pages/${id}/draftit`, "PUT", "no-cache");
		revalidatePath(`/noadmin/menus/read/${awtdParams.id}`);
	};

	const publishIt = async (id) => {
		"use server";
		// const rawFormData = {}
		await fetchurl(`/pages/${id}/publishit`, "PUT", "no-cache");
		revalidatePath(`/noadmin/menus/read/${awtdParams.id}`);
	};

	const trashIt = async (id) => {
		"use server";
		// const rawFormData = {}
		await fetchurl(`/pages/${id}/trashit`, "PUT", "no-cache");
		revalidatePath(`/noadmin/menus/read/${awtdParams.id}`);
	};

	const scheduleIt = async (id) => {
		"use server";
		// const rawFormData = {}
		await fetchurl(`/pages/${id}/scheduleit`, "PUT", "no-cache");
		revalidatePath(`/noadmin/menus/read/${awtdParams.id}`);
	};

	const handleDelete = async (id) => {
		"use server";
		// const rawFormData = {}
		await fetchurl(`/pages/${id}/permanently`, "DELETE", "no-cache");
		revalidatePath(`/noadmin/menus/read/${awtdParams.id}`);
	};

	const handleTrashAll = async (id) => {
		"use server";
		// const rawFormData = {}
		await fetchurl(`/pages/deleteall`, "PUT", "no-cache");
		revalidatePath(`/noadmin/menus/read/${awtdParams.id}`);
	};

	const handleDeleteAll = async (id) => {
		"use server";
		// const rawFormData = {}
		await fetchurl(`/pages/deleteall/permanently`, "DELETE", "no-cache");
		revalidatePath(`/noadmin/menus/read/${awtdParams.id}`);
	};

	return (
		<div className="row">
			<div className="col-lg-12">
				<div className="card rounded-0 mb-3">
					<div className="card-header">{menu?.data?.title || "Untitled"}</div>
					<div className="card-body">
						<ParseHtml text={menu?.data?.text} />
					</div>
				</div>
				<div className="card rounded-0">
					<PageList
						allLink={`/noadmin/menus/read/${menu?.data?._id}`}
						pageText="Pages"
						addLink={`/noadmin/menus/page/${menu?.data?._id}/create`}
						searchOn={`/noadmin/menus/read/${menu?.data?._id}`}
						objects={pages}
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
	);
};

export default ReadMenu;
