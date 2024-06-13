import { fetchurl, getUserIdOnServer } from "@/helpers/setTokenOnServer";
import FormButtons from "@/components/global/formbuttons";
import { revalidatePath } from "next/cache";

const Form = async ({ params, searchParams, revalidateUrl = `` }) => {
	const addShortUrl = async (formData) => {
		"use server";
		const rawFormData = {
			title: formData.get("title"),
			longUrl: formData.get("longUrl"),
			text: formData.get("text"),
		};

		const userId = await getUserIdOnServer();

		await fetchurl(
			`/extras/shorturls${userId ? `?user=${userId.value}` : ``}`,
			"POST",
			"no-cache",
			rawFormData
		);

		revalidatePath(revalidateUrl);
	};

	return (
		<div className="d-grid gap-2 mb-4">
			<form action={addShortUrl}>
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
				/>
				<label htmlFor="longUrl" className="form-label">
					Long Url
				</label>
				<input
					id="longUrl"
					name="longUrl"
					defaultValue=""
					type="text"
					className="form-control mb-3"
					placeholder=""
				/>
				<label htmlFor="text" className="form-label">
					Text
				</label>
				<textarea
					id="text"
					name="text"
					className="form-control"
					placeholder={`Here goes the message`}
					rows={`3`}
				/>
				<br />
				<FormButtons />
			</form>
		</div>
	);
};

export default Form;
