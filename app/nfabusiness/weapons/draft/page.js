import { revalidatePath } from "next/cache";
import { fetchurl } from "@/helpers/setTokenOnServer";
import NFAStatusesMenu from "@/components/nfabusiness/nfastatusesmenu";
import List from "@/components/nfabusiness/weapons/list";

async function getWeapons(params) {
	const res = await fetchurl(
		`/noadmin/weapons${params}&status=draft`,
		"GET",
		"no-cache"
	);
	return res;
}

const NFAWeaponsDraftIndex = async ({ params, searchParams }) => {
	const awtdParams = await params;
	const awtdSearchParams = await searchParams;
	const page = awtdSearchParams.page || 1;
	const limit = awtdSearchParams.limit || 10;
	const sort = awtdSearchParams.sort || "-createdAt";

	const weapons = await getWeapons(`?page=${page}&limit=${limit}&sort=${sort}`);

	const draftIt = async (id) => {
		"use server";
		// const rawFormData = {}
		await fetchurl(`/noadmin/weapons/${id}/draftit`, "PUT", "no-cache");
		revalidatePath(
			`/nfabusiness/weapons/draft?page=${page}&limit=${limit}&sort=${sort}`
		);
	};

	const publishIt = async (id) => {
		"use server";
		// const rawFormData = {}
		await fetchurl(`/noadmin/weapons/${id}/publishit`, "PUT", "no-cache");
		revalidatePath(
			`/nfabusiness/weapons/draft?page=${page}&limit=${limit}&sort=${sort}`
		);
	};

	const handleDelete = async (id) => {
		"use server";
		// const rawFormData = {}
		await fetchurl(`/noadmin/weapons/${id}/permanently`, "DELETE", "no-cache");
		revalidatePath(
			`/nfabusiness/weapons/draft?page=${page}&limit=${limit}&sort=${sort}`
		);
	};

	const handleDeleteAll = async () => {
		"use server";
		// const rawFormData = {}
		await fetchurl(
			`/noadmin/weapons/deleteall/permanently`,
			"DELETE",
			"no-cache"
		);
		revalidatePath(
			`/nfabusiness/weapons/draft?page=${page}&limit=${limit}&sort=${sort}`
		);
	};

	return (
		<>
			<NFAStatusesMenu
				allLink="/nfabusiness/weapons"
				publishedLink="/nfabusiness/weapons/published"
				draftLink="/nfabusiness/weapons/draft"
				scheduledLink=""
				trashedLink=""
				categoriesLink=""
				categoryType=""
			/>
			<div className="card rounded-0">
				<List
					allLink="/nfabusiness/weapons"
					pageText="Weapons"
					addLink="/nfabusiness/weapons/create"
					searchOn="/nfabusiness/weapons"
					searchedKeyword=""
					objects={weapons}
					searchParams={awtdSearchParams}
					handleDraft={draftIt}
					handlePublish={publishIt}
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

export default NFAWeaponsDraftIndex;
