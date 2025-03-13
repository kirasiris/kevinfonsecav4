import { revalidatePath } from "next/cache";
import { fetchurl } from "@/helpers/setTokenOnServer";
import AdminStatusesMenu from "@/components/admin/adminstatusesmenu";
import List from "@/components/admin/emails/list";

async function getEmails(params) {
	const res = await fetchurl(`/emails${params}`, "GET", "no-cache");
	return res;
}

const AdminEmailsSearchIndex = async ({ params, searchParams }) => {
	const awtdParams = await params;
	const awtdSearchParams = await searchParams;
	const keyword = awtdSearchParams.keyword || "";
	const page = awtdSearchParams.page || 1;
	const limit = awtdSearchParams.limit || 10;
	const sort = awtdSearchParams.sort || "-createdAt";

	const emails = await getEmails(
		`?keyword=${keyword}&page=${page}&limit=${limit}&sort=${sort}`
	);

	const handleDelete = async (id) => {
		"use server";
		// const rawFormData = {}
		await fetchurl(`/emails/${id}/permanently`, "DELETE", "no-cache");
		revalidatePath(
			`/noadmin/emails/search?keyword=${keyword}&page=${page}&limit=${limit}&sort=${sort}`
		);
	};

	const handleDeleteAll = async () => {
		"use server";
		// const rawFormData = {}
		await fetchurl(`/emails/deleteall/permanently`, "DELETE", "no-cache");
		revalidatePath(
			`/noadmin/emails/search?keyword=${keyword}&page=${page}&limit=${limit}&sort=${sort}`
		);
	};

	return (
		<>
			<AdminStatusesMenu
				allLink="/noadmin/emails"
				publishedLink=""
				draftLink=""
				scheduledLink=""
				trashedLink=""
				categoriesLink=""
				categoryType=""
			/>
			<div className="card rounded-0">
				<List
					allLink="/noadmin/emails"
					pageText="Emails"
					addLink=""
					searchOn="/noadmin/emails"
					objects={emails}
					searchParams={awtdSearchParams}
					handleDelete={handleDelete}
					handleDeleteAllFunction={handleDeleteAll}
				/>
			</div>
		</>
	);
};

export default AdminEmailsSearchIndex;
