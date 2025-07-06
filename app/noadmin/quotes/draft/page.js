import { revalidatePath } from "next/cache";
import { fetchurl } from "@/helpers/setTokenOnServer";
import AdminStatusesMenu from "@/components/noadmin/adminstatusesmenu";
import MyTextArea from "@/components/global/myfinaltextarea";
import FormButtons from "@/components/global/formbuttons";
import List from "@/components/noadmin/quotes/list";

async function getQuotes(params) {
	const res = await fetchurl(
		`/global/quotes${params}&status=draft`,
		"GET",
		"no-cache"
	);
	return res;
}

const AdminQuotesDraftIndex = async ({ params, searchParams }) => {
	const awtdParams = await params;
	const awtdSearchParams = await searchParams;
	const page = awtdSearchParams.page || 1;
	const limit = awtdSearchParams.limit || 10;
	const sort = awtdSearchParams.sort || "-createdAt";

	const quotes = await getQuotes(`?page=${page}&limit=${limit}&sort=${sort}`);

	const createQuote = async (formData) => {
		"use server";
		const rawFormData = {
			text: formData.get("text"),
			authorName: formData.get("authorName"),
			authorUrl: formData.get("authorUrl"),
			sourceWebsite: formData.get("sourceWebsite"),
			sourceUrl: formData.get("sourceUrl"),
			status: formData.get("status"),
			embedding: formData.get("embedding"),
		};

		await fetchurl(`/noadmin/quotes`, "POST", "no-cache", rawFormData);
		revalidatePath(
			`/noadmin/quotes/draft?page=${page}&limit=${limit}&sort=${sort}`
		);
	};

	const draftIt = async (id) => {
		"use server";
		// const rawFormData = {}
		await fetchurl(`/noadmin/quotes/${id}/draftit`, "PUT", "no-cache");
		revalidatePath(
			`/noadmin/quotes/draft?page=${page}&limit=${limit}&sort=${sort}`
		);
	};

	const publishIt = async (id) => {
		"use server";
		// const rawFormData = {}
		await fetchurl(`/noadmin/quotes/${id}/publishit`, "PUT", "no-cache");
		revalidatePath(
			`/noadmin/quotes/draft?page=${page}&limit=${limit}&sort=${sort}`
		);
	};

	const trashIt = async (id) => {
		"use server";
		// const rawFormData = {}
		await fetchurl(`/noadmin/quotes/${id}/trashit`, "PUT", "no-cache");
		revalidatePath(
			`/noadmin/quotes/draft?page=${page}&limit=${limit}&sort=${sort}`
		);
	};

	const scheduleIt = async (id) => {
		"use server";
		// const rawFormData = {}
		await fetchurl(`/noadmin/quotes/${id}/scheduleit`, "PUT", "no-cache");
		revalidatePath(
			`/noadmin/quotes/draft?page=${page}&limit=${limit}&sort=${sort}`
		);
	};

	const handleDelete = async (id) => {
		"use server";
		// const rawFormData = {}
		await fetchurl(`/noadmin/quotes/${id}/permanently`, "DELETE", "no-cache");
		revalidatePath(
			`/noadmin/quotes/draft?page=${page}&limit=${limit}&sort=${sort}`
		);
	};

	const handleTrashAll = async () => {
		"use server";
		// const rawFormData = {}
		await fetchurl(`/noadmin/quotes/deleteall`, "PUT", "no-cache");
		revalidatePath(
			`/noadmin/quotes/draft?page=${page}&limit=${limit}&sort=${sort}`
		);
	};

	const handleDeleteAll = async () => {
		"use server";
		// const rawFormData = {}
		await fetchurl(
			`/noadmin/quotes/deleteall/permanently`,
			"DELETE",
			"no-cache"
		);
		revalidatePath(
			`/noadmin/quotes/draft?page=${page}&limit=${limit}&sort=${sort}`
		);
	};

	return (
		<>
			<AdminStatusesMenu
				allLink="/noadmin/quotes"
				publishedLink="/noadmin/quotes/published"
				draftLink="/noadmin/quotes/draft"
				scheduledLink="/noadmin/quotes/scheduled"
				trashedLink="/noadmin/quotes/trashed"
				categoriesLink=""
				categoryType=""
			/>
			<div className="row">
				<div className="col">
					<form action={createQuote}>
						<label htmlFor="text" className="form-label">
							Text
						</label>
						<MyTextArea
							auth={undefined}
							token={undefined}
							id="text"
							name="text"
							customPlaceholder="Type something..."
							defaultValue=""
							onModel="Quote"
							advancedTextEditor={false}
						/>
						<label htmlFor="authorName" className="form-label">
							Author Name
						</label>
						<input
							id="authorName"
							name="authorName"
							defaultValue="John Doe"
							type="text"
							className="form-control mb-3"
							placeholder="Someone"
						/>
						<label htmlFor="authorUrl" className="form-label">
							Author Url
						</label>
						<input
							id="authorUrl"
							name="authorUrl"
							defaultValue="#"
							type="text"
							className="form-control mb-3"
							placeholder="#"
						/>
						<label htmlFor="sourceWebsite" className="form-label">
							Source Website
						</label>
						<input
							id="sourceWebsite"
							name="sourceWebsite"
							defaultValue=""
							type="text"
							className="form-control mb-3"
							placeholder="Somewhere"
						/>
						<label htmlFor="sourceUrl" className="form-label">
							Source Url
						</label>
						<input
							id="sourceUrl"
							name="sourceUrl"
							defaultValue="#"
							type="text"
							className="form-control mb-3"
							placeholder="#"
						/>
						<label htmlFor="embedding" className="form-label">
							Embedding
						</label>
						<select
							id="embedding"
							name="embedding"
							defaultValue={true}
							className="form-control"
						>
							<option value={true}>Yes</option>
							<option value={false}>No</option>
						</select>
						<label htmlFor="status" className="form-label">
							Status
						</label>
						<select
							id="status"
							name="status"
							defaultValue="draft"
							className="form-control"
						>
							<option value={`draft`}>Draft</option>
							<option value={`published`}>Published</option>
							<option value={`trash`}>Trash</option>
							<option value={`scheduled`}>Scheduled</option>
						</select>
						<br />
						<FormButtons />
					</form>
				</div>
				<div className="col-lg-10">
					<div className="card rounded-0">
						<List
							allLink="/noadmin/quotes"
							pageText="Quotes"
							addLink="/noadmin/quotes"
							searchOn="/noadmin/quotes"
							searchedKeyword=""
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

export default AdminQuotesDraftIndex;
