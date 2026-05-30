import { revalidatePath } from "next/cache";
import { fetchurl } from "@/helpers/setTokenOnServer";
import AdminStatusesMenu from "@/components/noadmin/adminstatusesmenu";
import List from "@/components/noadmin/presentations/list";

async function getPresentations(params) {
	const res = await fetchurl(
		`/global/presentations${params}`,
		"GET",
		"no-cache",
	);
	return res;
}

const AdminPresentationsIndex = async ({ params, searchParams }) => {
	const awtdParams = await params;
	const awtdSearchParams = await searchParams;
	const page = awtdSearchParams.page || 1;
	const limit = awtdSearchParams.limit || 10;
	const sort = awtdSearchParams.sort || "-createdAt";

	const presentations = await getPresentations(
		`?page=${page}&limit=${limit}&sort=${sort}`,
	);

	const handleDelete = async (id) => {
		"use server";
		// const rawFormData = {}
		await fetchurl(
			`/noadmin/presentations/${id}/permanently`,
			"DELETE",
			"no-cache",
		);
		revalidatePath(
			`/noadmin/presentations?page=${page}&limit=${limit}&sort=${sort}`,
		);
	};

	const handleDeleteAll = async () => {
		"use server";
		// const rawFormData = {}
		await fetchurl(
			`/noadmin/presentations/deleteall/permanently`,
			"DELETE",
			"no-cache",
		);
		revalidatePath(
			`/noadmin/presentations?page=${page}&limit=${limit}&sort=${sort}`,
		);
	};

	return (
		<>
			<AdminStatusesMenu
				allLink="/noadmin/presentations"
				publishedLink="/noadmin/presentations/published"
				draftLink="/noadmin/presentations/draft"
				scheduledLink="/noadmin/presentations/scheduled"
				trashedLink="/noadmin/presentations/trashed"
				categoriesLink=""
				categoryType=""
			/>
			<div className="card rounded-0">
				<List
					allLink="/noadmin/presentations"
					pageText="Presentations"
					addLink="/noadmin/presentations/create"
					searchOn="/noadmin/presentations"
					searchedKeyword=""
					objects={presentations}
					searchParams={awtdSearchParams}
					handleDraft={undefined}
					handlePublish={undefined}
					handleTrash={undefined}
					handleSchedule={undefined}
					handleFeature={undefined}
					handleUnfeature={undefined}
					handleDelete={handleDelete}
					handleTrashAllFunction={undefined}
					handleDeleteAllFunction={handleDeleteAll}
				/>
			</div>
		</>
	);
};

export default AdminPresentationsIndex;
