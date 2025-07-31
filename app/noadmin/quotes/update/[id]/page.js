import { revalidatePath } from "next/cache";
import { notFound } from "next/navigation";
import { fetchurl } from "@/helpers/setTokenOnServer";
import AdminStatusesMenu from "@/components/noadmin/adminstatusesmenu";
import List from "@/components/noadmin/quotes/list";
import UpdateQuoteForm from "@/forms/noadmin/quotes/updatequoteform";

async function getQuotes(params) {
	const res = await fetchurl(`/extras/quotes${params}`, "GET", "no-cache");
	if (!res.success) notFound();
	return res;
}

const UpdateQuote = async ({ params, searchParams }) => {
	const awtdParams = await params;
	const awtdSearchParams = await searchParams;
	const page = awtdSearchParams.page || 1;
	const limit = awtdSearchParams.limit || 10;
	const sort = awtdSearchParams.sort || "-createdAt";

	const quote = await getQuotes(`/${awtdParams.id}`);
	const quotes = await getQuotes(`?page=${page}&limit=${limit}&sort=${sort}`);

	const draftIt = async (id) => {
		"use server";
		// const rawFormData = {}
		await fetchurl(`/extras/quotes/${id}/draftit`, "PUT", "no-cache");
		revalidatePath(`/noadmin/quotes?page=${page}&limit=${limit}&sort=${sort}`);
	};

	const publishIt = async (id) => {
		"use server";
		// const rawFormData = {}
		await fetchurl(`/extras/quotes/${id}/publishit`, "PUT", "no-cache");
		revalidatePath(`/noadmin/quotes?page=${page}&limit=${limit}&sort=${sort}`);
	};

	const trashIt = async (id) => {
		"use server";
		// const rawFormData = {}
		await fetchurl(`/extras/quotes/${id}/trashit`, "PUT", "no-cache");
		revalidatePath(`/noadmin/quotes?page=${page}&limit=${limit}&sort=${sort}`);
	};

	const scheduleIt = async (id) => {
		"use server";
		// const rawFormData = {}
		await fetchurl(`/extras/quotes/${id}/scheduleit`, "PUT", "no-cache");
		revalidatePath(`/noadmin/quotes?page=${page}&limit=${limit}&sort=${sort}`);
	};

	const handleDelete = async (id) => {
		"use server";
		// const rawFormData = {}
		await fetchurl(`/extras/quotes/${id}/permanently`, "DELETE", "no-cache");
		revalidatePath(`/noadmin/quotes?page=${page}&limit=${limit}&sort=${sort}`);
	};

	const handleTrashAll = async () => {
		"use server";
		// const rawFormData = {}
		await fetchurl(`/extras/quotes/deleteall`, "PUT", "no-cache");
		revalidatePath(`/noadmin/quotes?page=${page}&limit=${limit}&sort=${sort}`);
	};

	const handleDeleteAll = async () => {
		"use server";
		// const rawFormData = {}
		await fetchurl(
			`/extras/quotes/deleteall/permanently`,
			"DELETE",
			"no-cache"
		);
		revalidatePath(`/noadmin/quotes?page=${page}&limit=${limit}&sort=${sort}`);
	};

	return (
		<>
			<AdminStatusesMenu
				allLink="/noadmin/quotes"
				publishedLink="/noadmin/quotes/published"
				draftLink="/noadmin/quotes/draft"
				scheduledLink="/noadmin/quotes/scheduled"
				trashedLink="/noadmin/quotes/trashed"
			/>
			<div className="row">
				<div className="col">
					<UpdateQuoteForm
						currentpage={`/noadmin/quotes?page=${page}&limit=${limit}&sort=${sort}`}
						object={quote}
					/>
				</div>
				<div className="col-lg-10">
					<div className="card rounded-0">
						<List
							allLink="/noadmin/quotes"
							pageText="Quotes"
							addLink="/noadmin/quotes"
							searchOn="/noadmin/quotes"
							objects={quotes}
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

export default UpdateQuote;
