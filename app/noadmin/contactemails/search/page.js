import { revalidatePath } from "next/cache";
import { fetchurl } from "@/helpers/setTokenOnServer";
import AdminStatusesMenu from "@/components/noadmin/adminstatusesmenu";
import List from "@/components/noadmin/contactemails/list";

async function getContactEmails(params) {
	const res = await fetchurl(
		`/global/contactemails${params}`,
		"GET",
		"no-cache"
	);
	return res;
}

const AdminContactEmailsSearchIndex = async ({ params, searchParams }) => {
	const awtdParams = await params;
	const awtdSearchParams = await searchParams;
	const keyword = awtdSearchParams.keyword || "";
	const page = awtdSearchParams.page || 1;
	const limit = awtdSearchParams.limit || 10;
	const sort = awtdSearchParams.sort || "-createdAt";

	const contactemails = await getContactEmails(
		`?keyword=${keyword}&page=${page}&limit=${limit}&sort=${sort}`
	);

	const handleDelete = async (id) => {
		"use server";
		// const rawFormData = {}
		await fetchurl(
			`/noadmin/contactemails/${id}/permanently`,
			"DELETE",
			"no-cache"
		);
		revalidatePath(
			`/noadmin/contactemails/search?keyword=${keyword}&page=${page}&limit=${limit}&sort=${sort}`
		);
	};

	const handleDeleteAll = async () => {
		"use server";
		// const rawFormData = {}
		await fetchurl(
			`/noadmin/contactemails/deleteall/permanently`,
			"DELETE",
			"no-cache"
		);
		revalidatePath(
			`/noadmin/contactemails/search?keyword=${keyword}&page=${page}&limit=${limit}&sort=${sort}`
		);
	};

	return (
		<>
			<AdminStatusesMenu
				allLink="/noadmin/contactemails"
				publishedLink=""
				draftLink=""
				scheduledLink=""
				trashedLink=""
				categoriesLink=""
				categoryType=""
			/>
			<div className="card rounded-0">
				<List
					allLink="/noadmin/contactemails"
					pageText="Contact Emails"
					addLink=""
					searchOn="/noadmin/contactemails"
					searchedKeyword={keyword}
					objects={contactemails}
					searchParams={awtdSearchParams}
					handleDelete={handleDelete}
					handleDeleteAllFunction={handleDeleteAll}
				/>
			</div>
		</>
	);
};

export default AdminContactEmailsSearchIndex;
