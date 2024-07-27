import { fetchurl } from "@/helpers/setTokenOnServer";
import { redirect } from "next/navigation";
import FormButtons from "@/components/global/formbuttons";
import { revalidatePath } from "next/cache";
import MyTextArea from "@/components/global/myfinaltextarea";

const Form = async ({ params, searchParams }) => {
	const createSecret = async (formData) => {
		"use server";
		const rawFormData = {
			title: formData.get("title"),
			text: formData.get("text"),
			password: formData.get("password"),
			age: formData.get("age"),
			sex: formData.get("sex"),
			nsfw: formData.get("nsfw"),
		};

		await fetchurl(`/extras/secrets`, "POST", "no-cache", rawFormData);

		searchParams?.returnpage
			? redirect(searchParams?.returnpage)
			: revalidatePath(
					`/secret?page=${searchParams.page}&limit=${searchParams.limit}&sort=${searchParams.sort}`
			  );
	};

	return (
		<div className="d-grid gap-2 mb-4">
			<form action={createSecret}>
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
				<label htmlFor="text" className="form-label">
					Text
				</label>
				<MyTextArea
					auth={undefined}
					token={undefined}
					id="text"
					name="text"
					onModel="Secret"
					advancedTextEditor={false}
					customPlaceholder="No description"
					defaultValue="No description"
				/>
				<label htmlFor="password" className="form-label">
					Password
				</label>
				<input
					id="password"
					name="password"
					type="password"
					className="form-control mb-3"
					placeholder="******"
				/>
				<label htmlFor="age" className="form-label">
					Age
				</label>
				<input
					id="age"
					name="age"
					type="number"
					className="form-control mb-3"
					min={13}
					max={100}
					placeholder="Enter age"
				/>
				<label htmlFor="sex" className="form-label">
					Sex
				</label>
				<select id="sex" name="sex" className="form-control mb-3">
					<option value={`male`}>Male</option>
					<option value={`female`}>Female</option>
					<option value={`non-binary`}>Non-binary</option>
				</select>
				<label htmlFor="nsfw" className="form-label">
					NSFW
				</label>
				<select id="nsfw" name="nsfw" className="form-control mb-3">
					<option value={true}>Yes</option>
					<option value={false}>No</option>
				</select>
				<br />
				<FormButtons />
			</form>
		</div>
	);
};

export default Form;
