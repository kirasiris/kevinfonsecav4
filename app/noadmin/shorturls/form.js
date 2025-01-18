import { fetchurl, getUserOnServer } from "@/helpers/setTokenOnServer";
import FormButtons from "@/components/global/formbuttons";
import { revalidatePath } from "next/cache";
import MyTextArea from "@/components/global/myfinaltextarea";

const Form = async ({ params, searchParams, revalidateUrl = `` }) => {
	const auth = await getUserOnServer();

	const addShortUrl = async (formData) => {
		"use server";
		const rawFormData = {
			title: formData.get("title"),
			longUrl: formData.get("longUrl"),
			text: formData.get("text"),
		};

		await fetchurl(
			`/extras/shorturls${auth ? `?user=${auth?.userId}` : ``}`,
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
				<MyTextArea
					auth={undefined}
					id="text"
					name="text"
					onModel="ShortUrl"
					advancedTextEditor={false}
					customPlaceholder="No description"
					defaultValue="No description..."
				/>
				<br />
				<FormButtons />
			</form>
		</div>
	);
};

export default Form;
