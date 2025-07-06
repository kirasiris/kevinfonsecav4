import { fetchurl } from "@/helpers/setTokenOnServer";
import AdminStatusesMenu from "@/components/noadmin/adminstatusesmenu";
import MyTextArea from "@/components/global/myfinaltextarea";
import FormButtons from "@/components/global/formbuttons";
import List from "@/components/noadmin/quotes/list";
import { revalidatePath } from "next/cache";
import { notFound } from "next/navigation";

async function getQuotes(params) {
	const res = await fetchurl(`/extras/quotes${params}`, "GET", "no-cache");
	if (!res.success) notFound();
	return res;
}

const UpdateQuote = async ({ params, searchParams }) => {
	const awtdParams = await params;
	const awtdSearchParams = await searchParams;
	const quote = await getQuotes(`/${awtdParams.id}`);
	const quotes = await getQuotes(
		`?page=${awtdSearchParams.page || 1}&limit=${
			awtdSearchParams.limit || 10
		}&sort=${awtdSearchParams.sort || "-createdAt"}`
	);

	const upgradeQuote = async (formData) => {
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

		await fetchurl(
			`/extras/quotes/${awtdParams.id}`,
			"PUT",
			"no-cache",
			rawFormData
		);
		revalidatePath(
			`/noadmin/quotes?page=${awtdSearchParams.page || 1}&limit=${
				awtdSearchParams.limit || 10
			}&sort=${awtdSearchParams.sort || "-createdAt"}`
		);
	};

	const draftIt = async (id) => {
		"use server";
		// const rawFormData = {}
		await fetchurl(`/extras/quotes/${id}/draftit`, "PUT", "no-cache");
		revalidatePath(
			`/noadmin/quotes?page=${awtdSearchParams.page || 1}&limit=${
				awtdSearchParams.limit || 10
			}&sort=${awtdSearchParams.sort || "-createdAt"}`
		);
	};

	const publishIt = async (id) => {
		"use server";
		// const rawFormData = {}
		await fetchurl(`/extras/quotes/${id}/publishit`, "PUT", "no-cache");
		revalidatePath(
			`/noadmin/quotes?page=${awtdSearchParams.page || 1}&limit=${
				awtdSearchParams.limit || 10
			}&sort=${awtdSearchParams.sort || "-createdAt"}`
		);
	};

	const trashIt = async (id) => {
		"use server";
		// const rawFormData = {}
		await fetchurl(`/extras/quotes/${id}/trashit`, "PUT", "no-cache");
		revalidatePath(
			`/noadmin/quotes?page=${awtdSearchParams.page || 1}&limit=${
				awtdSearchParams.limit || 10
			}&sort=${awtdSearchParams.sort || "-createdAt"}`
		);
	};

	const scheduleIt = async (id) => {
		"use server";
		// const rawFormData = {}
		await fetchurl(`/extras/quotes/${id}/scheduleit`, "PUT", "no-cache");
		revalidatePath(
			`/noadmin/quotes?page=${awtdSearchParams.page || 1}&limit=${
				awtdSearchParams.limit || 10
			}&sort=${awtdSearchParams.sort || "-createdAt"}`
		);
	};

	const handleDelete = async (id) => {
		"use server";
		// const rawFormData = {}
		await fetchurl(`/extras/quotes/${id}/permanently`, "DELETE", "no-cache");
		revalidatePath(
			`/noadmin/quotes?page=${awtdSearchParams.page || 1}&limit=${
				awtdSearchParams.limit || 10
			}&sort=${awtdSearchParams.sort || "-createdAt"}`
		);
	};

	const handleTrashAll = async () => {
		"use server";
		// const rawFormData = {}
		await fetchurl(`/extras/quotes/deleteall`, "PUT", "no-cache");
		revalidatePath(
			`/noadmin/quotes?page=${awtdSearchParams.page || 1}&limit=${
				awtdSearchParams.limit || 10
			}&sort=${awtdSearchParams.sort || "-createdAt"}`
		);
	};

	const handleDeleteAll = async () => {
		"use server";
		// const rawFormData = {}
		await fetchurl(
			`/extras/quotes/deleteall/permanently`,
			"DELETE",
			"no-cache"
		);
		revalidatePath(
			`/noadmin/quotes?page=${awtdSearchParams.page || 1}&limit=${
				awtdSearchParams.limit || 10
			}&sort=${awtdSearchParams.sort || "-createdAt"}`
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
			/>
			<div className="row">
				<div className="col">
					<form action={upgradeQuote}>
						<label htmlFor="text" className="form-label">
							Text
						</label>
						<MyTextArea
							auth={undefined}
							token={undefined}
							id="text"
							name="text"
							customPlaceholder="Type something..."
							defaultValue={quote?.data?.text}
							onModel="Quote"
							advancedTextEditor={false}
						/>
						<label htmlFor="authorName" className="form-label">
							Author Name
						</label>
						<input
							id="authorName"
							name="authorName"
							defaultValue={quote?.data?.authorName}
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
							defaultValue={quote?.data?.authorUrl}
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
							defaultValue={quote?.data?.sourceWebsite}
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
							defaultValue={quote?.data?.sourceUrl}
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
							defaultValue={quote?.data?.embedding.toString()}
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
							defaultValue={quote?.data?.status}
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
