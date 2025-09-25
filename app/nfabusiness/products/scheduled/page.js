import { revalidatePath } from "next/cache";
import { fetchurl } from "@/helpers/setTokenOnServer";
import NFAStatusesMenu from "@/components/nfabusiness/nfastatusesmenu";
import List from "@/components/nfabusiness/products/list";

async function getProducts(params) {
	const res = await fetchurl(
		`/global/products${params}&status=scheduled`,
		"GET",
		"no-cache"
	);
	return res;
}

const NFAProductsScheduledIndex = async ({ params, searchParams }) => {
	const awtdParams = await params;
	const awtdSearchParams = await searchParams;
	const page = awtdSearchParams.page || 1;
	const limit = awtdSearchParams.limit || 10;
	const sort = awtdSearchParams.sort || "-createdAt";

	const products = await getProducts(
		`?page=${page}&limit=${limit}&sort=${sort}`
	);

	const draftIt = async (id) => {
		"use server";
		// const rawFormData = {}
		await fetchurl(`/noadmin/stripe/products/${id}/draftit`, "PUT", "no-cache");
		revalidatePath(
			`/nfabusiness/products/scheduled?page=${page}&limit=${limit}&sort=${sort}`
		);
	};

	const publishIt = async (id) => {
		"use server";
		// const rawFormData = {}
		await fetchurl(
			`/noadmin/stripe/products/${id}/publishit`,
			"PUT",
			"no-cache"
		);
		revalidatePath(
			`/nfabusiness/products/scheduled?page=${page}&limit=${limit}&sort=${sort}`
		);
	};

	const trashIt = async (id) => {
		"use server";
		// const rawFormData = {}
		await fetchurl(`/noadmin/stripe/products/${id}/trashit`, "PUT", "no-cache");
		revalidatePath(
			`/nfabusiness/products/scheduled?page=${page}&limit=${limit}&sort=${sort}`
		);
	};

	const scheduleIt = async (id) => {
		"use server";
		// const rawFormData = {}
		await fetchurl(
			`/noadmin/stripe/products/${id}/scheduleit`,
			"PUT",
			"no-cache"
		);
		revalidatePath(
			`/nfabusiness/products/scheduled?page=${page}&limit=${limit}&sort=${sort}`
		);
	};

	const handleDelete = async (id) => {
		"use server";
		// const rawFormData = {}
		await fetchurl(
			`/noadmin/stripe/products/${id}/permanently`,
			"DELETE",
			"no-cache"
		);
		revalidatePath(
			`/nfabusiness/products/scheduled?page=${page}&limit=${limit}&sort=${sort}`
		);
	};

	const handleTrashAll = async () => {
		"use server";
		// const rawFormData = {}
		await fetchurl(`/noadmin/stripe/products/deleteall`, "PUT", "no-cache");
		revalidatePath(
			`/nfabusiness/products/scheduled?page=${page}&limit=${limit}&sort=${sort}`
		);
	};

	const handleDeleteAll = async () => {
		"use server";
		// const rawFormData = {}
		await fetchurl(
			`/noadmin/stripe/products/deleteall/permanently`,
			"DELETE",
			"no-cache"
		);
		revalidatePath(
			`/nfabusiness/products/scheduled?page=${page}&limit=${limit}&sort=${sort}`
		);
	};

	return (
		<>
			<NFAStatusesMenu
				allLink="/nfabusiness/products"
				publishedLink="/nfabusiness/products/published"
				draftLink="/nfabusiness/products/draft"
				scheduledLink="/nfabusiness/products/scheduled"
				trashedLink="/nfabusiness/products/trashed"
				categoriesLink=""
				categoryType=""
			/>
			<div className="card rounded-0">
				<List
					allLink="/nfabusiness/products"
					pageText="Products"
					addLink="/nfabusiness/products/create"
					searchOn="/nfabusiness/products"
					searchedKeyword=""
					objects={products}
					searchParams={awtdSearchParams}
					handleDraft={draftIt}
					handlePublish={publishIt}
					handleTrash={trashIt}
					handleSchedule={scheduleIt}
					handleFeature={undefined}
					handleUnfeature={undefined}
					handleDelete={handleDelete}
					handleTrashAllFunction={handleTrashAll}
					handleDeleteAllFunction={handleDeleteAll}
				/>
			</div>
		</>
	);
};

export default NFAProductsScheduledIndex;
