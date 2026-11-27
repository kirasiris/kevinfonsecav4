import { fetchurl } from "@/helpers/setTokenOnServer";
import AdminStatusesMenu from "@/components/noadmin/adminstatusesmenu";
import List from "@/components/noadmin/contactemails/list";

async function getContactEmails(params) {
	const res = await fetchurl(
		`/global/contactemails${params}`,
		"GET",
		"no-cache",
	);
	return res instanceof Error ? { status: "error", message: res.message } : res;
}

const AdminContactEmailsIndex = async ({ params, searchParams }) => {
	const awtdParams = await params;
	const awtdSearchParams = await searchParams;
	const page = awtdSearchParams.page || 1;
	const limit = awtdSearchParams.limit || 10;
	const sort = awtdSearchParams.sort || "-createdAt";

	const contactemails = await getContactEmails(
		`?page=${page}&limit=${limit}&sort=${sort}`,
	);

	return (
		<div className="container-fluid px-0">
			<AdminStatusesMenu
				allLink="/noadmin/contactemails"
				publishedLink=""
				draftLink=""
				scheduledLink=""
				trashedLink=""
				filledLink=""
				categoriesLink=""
				categoryType=""
			/>
			<div className="card rounded-0">
				<List
					allLink="/noadmin/contactemails"
					pageText="Contact Emails"
					addLink=""
					searchOn="/noadmin/contactemails"
					searchedKeyword=""
					objects={contactemails}
					searchParams={awtdSearchParams}
				/>
			</div>
		</div>
	);
};

export default AdminContactEmailsIndex;
