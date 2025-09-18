import { revalidatePath } from "next/cache";
import { fetchurl } from "@/helpers/setTokenOnServer";
import NFAStatusesMenu from "@/components/nfabusiness/nfastatusesmenu";
import List from "@/components/nfabusiness/products/list";

async function getProducts(params) {
	const res = await fetchurl(`/global/products`, "GET", "no-cache");
	return res;
}

const NFAProductsIndex = async ({ params, searchParams }) => {
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
		await fetchurl(`/noadmin/store/products/${id}/draftit`, "PUT", "no-cache");
		revalidatePath(
			`/nfabusiness/products?page=${page}&limit=${limit}&sort=${sort}`
		);
	};

	const publishIt = async (id) => {
		"use server";
		// const rawFormData = {}
		await fetchurl(
			`/noadmin/store/products/${id}/publishit`,
			"PUT",
			"no-cache"
		);
		revalidatePath(
			`/nfabusiness/products?page=${page}&limit=${limit}&sort=${sort}`
		);
	};

	const handleDelete = async (id) => {
		"use server";
		// const rawFormData = {}
		await fetchurl(
			`/noadmin/store/products/${id}/permanently`,
			"DELETE",
			"no-cache"
		);
		revalidatePath(
			`/nfabusiness/products?page=${page}&limit=${limit}&sort=${sort}`
		);
	};

	const handleDeleteAll = async () => {
		"use server";
		// const rawFormData = {}
		await fetchurl(
			`/noadmin/store/products/deleteall/permanently`,
			"DELETE",
			"no-cache"
		);
		revalidatePath(
			`/nfabusiness/products?page=${page}&limit=${limit}&sort=${sort}`
		);
	};

	return (
		<>
			<NFAStatusesMenu
				allLink="/nfabusiness/products"
				publishedLink="/nfabusiness/products/published"
				draftLink="/nfabusiness/products/draft"
				scheduledLink=""
				trashedLink=""
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

export default NFAProductsIndex;
