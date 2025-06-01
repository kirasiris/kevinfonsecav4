import { fetchurl } from "@/helpers/setTokenOnServer";
import FormButtons from "@/components/global/formbuttons";
import { revalidatePath } from "next/cache";

const Form = async ({ params, searchParams, revalidateUrl = "" }) => {
	const createSecret = async (formData) => {
		"use server";
		const rawFormData = {
			age: formData.get("age"),
			sex: formData.get("sex"),
			password: formData.get("password"),
			text: formData.get("text"),
			nsfw: formData.get("nsfw"),
			status: formData.get("status"),
		};

		await fetchurl(`/noadmin/secrets`, "POST", "no-cache", rawFormData);

		revalidatePath(revalidateUrl);
	};

	return (
		<div className="d-grid gap-2 mb-4">
			<form action={createSecret}>
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
				<label htmlFor="nsfw" className="form-label">
					NSFW
				</label>
				<select id="nsfw" name="nsfw" className="form-control mb-3">
					<option value={true}>Yes</option>
					<option value={false}>No</option>
				</select>
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
				<label htmlFor="status" className="form-label">
					Status
				</label>
				<select id="status" name="status" className="form-control">
					<option value={`draft`}>Draft</option>
					<option value={`published`}>Published</option>
					<option value={`trash`}>Trash</option>
					<option value={`scheduled`}>Scheduled</option>
				</select>
				<br />
				<FormButtons />
			</form>
		</div>
	);
};

export default Form;
