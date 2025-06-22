import { redirect } from "next/navigation";
import {
	fetchurl,
	getAuthTokenOnServer,
	getUserOnServer,
} from "@/helpers/setTokenOnServer";
import MyTextArea from "@/components/global/myfinaltextarea";
import FormButtons from "@/components/global/formbuttons";

const CreateReport = async ({ params, searchParams }) => {
	const awtdParams = await params;
	const awtdSearchParams = await searchParams;

	const token = await getAuthTokenOnServer();
	const auth = await getUserOnServer();

	const addComment = async (formData) => {
		"use server";
		const rawFormData = {
			title: formData.get("title"),
			text: formData.get("text"),
			website: formData.get("website"),
		};

		await fetchurl(`/noadmin/reports`, "POST", "no-cache", {
			...rawFormData,
			resourceId: awtdSearchParams.resourceId,
			onModel: awtdSearchParams.onModel,
		});
		redirect(`/noadmin/reports`);
	};

	return (
		<form className="row" action={addComment}>
			<div className="col">
				<label htmlFor="blog-title" className="form-label">
					Title
				</label>
				<input
					id="blog-title"
					name="title"
					defaultValue="Untitled"
					type="text"
					className="form-control mb-3"
					placeholder=""
					required={true}
				/>
				<label htmlFor="text" className="form-label">
					Text
				</label>
				<MyTextArea
					auth={auth}
					token={token}
					id="text"
					name="text"
					defaultValue="No description..."
					onModel="Report"
					advancedTextEditor={false}
					customPlaceholder="No description"
					charactersLimit={99999}
					isRequired={true}
				/>
				<label htmlFor="website" className="form-label">
					Website
				</label>
				<input
					id="website"
					name="website"
					defaultValue=""
					type="website"
					className="form-control"
					placeholder="https://demo.com/"
				/>
				<br />
				<FormButtons />
			</div>
		</form>
	);
};

export default CreateReport;
