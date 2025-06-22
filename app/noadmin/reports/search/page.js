import { revalidatePath } from "next/cache";
import { fetchurl } from "@/helpers/setTokenOnServer";
import AdminStatusesMenu from "@/components/admin/adminstatusesmenu";
import List from "@/components/admin/reports/list";

async function getReports(params) {
	const res = await fetchurl(`/global/reports${params}`, "GET", "no-cache");
	return res;
}

const AdminReportsSearchIndex = async ({ params, searchParams }) => {
	const awtdParams = await params;
	const awtdSearchParams = await searchParams;
	const keyword = awtdSearchParams.keyword || "";
	const page = awtdSearchParams.page || 1;
	const limit = awtdSearchParams.limit || 10;
	const sort = awtdSearchParams.sort || "-createdAt";

	const reports = await getReports(
		`?keyword=${keyword}&page=${page}&limit=${limit}&sort=${sort}`
	);

	const handleDelete = async (id) => {
		"use server";
		// const rawFormData = {}
		await fetchurl(`/noadmin/reports/${id}/permanently`, "DELETE", "no-cache");
		revalidatePath(
			`/noadmin/reports/search?keyword=${keyword}&page=${page}&limit=${limit}&sort=${sort}`
		);
	};

	const handleDeleteAll = async () => {
		"use server";
		// const rawFormData = {}
		await fetchurl(
			`/noadmin/reports/deleteall/permanently`,
			"DELETE",
			"no-cache"
		);
		revalidatePath(
			`/noadmin/reports/search?keyword=${keyword}&page=${page}&limit=${limit}&sort=${sort}`
		);
	};

	return (
		<>
			<AdminStatusesMenu
				allLink="/noadmin/reports"
				publishedLink=""
				draftLink=""
				scheduledLink=""
				trashedLink=""
				categoriesLink=""
				categoryType=""
			/>
			<div className="card rounded-0">
				<List
					allLink="/noadmin/reports"
					pageText="Reports"
					addLink=""
					searchOn="/noadmin/reports"
					searchedKeyword={keyword}
					objects={reports}
					searchParams={awtdSearchParams}
					handleDraft={undefined}
					handlePublish={undefined}
					handleTrash={undefined}
					handleSchedule={undefined}
					handleDelete={handleDelete}
					handleTrashAllFunction={undefined}
					handleDeleteAllFunction={handleDeleteAll}
				/>
			</div>
		</>
	);
};

export default AdminReportsSearchIndex;
