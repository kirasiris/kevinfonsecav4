import { fetchurl } from "@/helpers/setTokenOnServer";
import AdminStatusesMenu from "@/components/admin/adminstatusesmenu";
import MyTextArea from "@/components/global/myfinaltextarea";
import FormButtons from "@/components/global/formbuttons";
import List from "@/components/admin/quotes/list";
import { revalidatePath } from "next/cache";

async function getQuotes(params) {
	const res = await fetchurl(`/extras/quotes${params}`, "GET", "no-cache");
	return res;
}

const AdminQuotesIndex = async ({ params, searchParams }) => {
	const quotes = await getQuotes(
		`?page=${searchParams.page}&limit=${searchParams.limit}&sort=${searchParams.sort}`
	);

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

		await fetchurl(`/extras/quotes`, "POST", "no-cache", rawFormData);
		revalidatePath(
			`?page=${searchParams.page}&limit=${searchParams.limit}&sort=${searchParams.sort}`
		);
	};

	const draftIt = async (id) => {
		"use server";
		// const rawFormData = {}
		await fetchurl(`/extras/quotes/${id}/draftit`, "PUT", "no-cache");
		revalidatePath(
			`?page=${searchParams.page}&limit=${searchParams.limit}&sort=${searchParams.sort}`
		);
	};

	const publishIt = async (id) => {
		"use server";
		// const rawFormData = {}
		await fetchurl(`/extras/quotes/${id}/publishit`, "PUT", "no-cache");
		revalidatePath(
			`?page=${searchParams.page}&limit=${searchParams.limit}&sort=${searchParams.sort}`
		);
	};

	const trashIt = async (id) => {
		"use server";
		// const rawFormData = {}
		await fetchurl(`/extras/quotes/${id}/trashit`, "PUT", "no-cache");
		revalidatePath(
			`?page=${searchParams.page}&limit=${searchParams.limit}&sort=${searchParams.sort}`
		);
	};

	const scheduleIt = async (id) => {
		"use server";
		// const rawFormData = {}
		await fetchurl(`/extras/quotes/${id}/scheduleit`, "PUT", "no-cache");
		revalidatePath(
			`?page=${searchParams.page}&limit=${searchParams.limit}&sort=${searchParams.sort}`
		);
	};

	const handleDelete = async (id) => {
		"use server";
		// const rawFormData = {}
		await fetchurl(`/extras/quotes/${id}/permanently`, "DELETE", "no-cache");
		revalidatePath(
			`?page=${searchParams.page}&limit=${searchParams.limit}&sort=${searchParams.sort}`
		);
	};

	const handleTrashAll = async () => {
		"use server";
		// const rawFormData = {}
		await fetchurl(`/extras/quotes/deleteall`, "PUT", "no-cache");
		revalidatePath(
			`?page=${searchParams.page}&limit=${searchParams.limit}&sort=${searchParams.sort}`
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
			`?page=${searchParams.page}&limit=${searchParams.limit}&sort=${searchParams.sort}`
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
					<form action={createQuote}>
						<label htmlFor="text" className="form-label">
							Text
						</label>
						<MyTextArea
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
							objects={quotes}
							searchParams={searchParams}
							handleDraft={draftIt}
							handlePublish={publishIt}
							handleTrash={trashIt}
							handleSchedule={scheduleIt}
							handleDelete={handleDelete}
							handleTrashAllFunction={handleTrashAll}
							handleDeleteAllFunction={handleDeleteAll}
						/>
						{/* <AdminCardHeaderMenu
							allLink={`/noadmin/quotes`}
							pageText="Quotes"
							currentResults={currentResults}
							totalResults={totalResults.quotes}
							addLink={`/noadmin/quotes/create`}
							addLinkText={`quote`}
							handleDeleteAllFunction={handleDeleteAll}
							keyword={keyword}
							setKeyword={setKeyword}
						/>
						{list?.length > 0 ? (
							<>
								<ul className="list-group list-group-flush">
									{list?.map((quote) => (
										<Single
											key={quote._id}
											object={quote}
											handleDelete={handleDelete}
											objects={list}
											setObjects={setQuotes}
											setTotalResults={setTotalResults}
										/>
									))}
									<li className="list-group-item">
										{page} / {totalPages}
									</li>
								</ul>
								<ClientNumericPagination
									totalPages={totalPages || Math.ceil(list.length / limit)}
									page={page}
									limit={limit}
									sortby={sortby}
									siblings={1}
									setParams={setParams}
									router={router}
								/>
							</>
						) : (
							<div
								className={`alert alert-${
									loading ? "primary" : "danger"
								} rounded-0 m-0 border-0`}
							>
								{loading ? "Loading" : "Nothing found"}
							</div>
						)} */}
					</div>
				</div>
			</div>
		</>
	);
};

export default AdminQuotesIndex;
