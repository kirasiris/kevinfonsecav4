import Globalcontent from "@/layout/content";
import Sidebar from "@/layout/secret/sidebar";
import { fetchurl } from "@/helpers/setTokenOnServer";
import { redirect } from "next/navigation";
import FormButtons from "@/components/global/formbuttons";

const CreateSecret = async ({ params, searchParams }) => {
	const createContact = async (formData) => {
		"use server";
		const rawFormData = {
			age: formData.get("age"),
			sex: formData.get("sex"),
			nsfw: formData.get("nsfw"),
			text: formData.get("text"),
		};

		await fetchurl(`/extras/secrets`, "POST", "no-cache", rawFormData);
		searchParams?.returnpage
			? redirect(searchParams.returnpage)
			: redirect(`/secret`);
	};

	return (
		<>
			<div className="container mt-4">
				<div className="row">
					<Globalcontent>
						<form action={createContact}>
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
					</Globalcontent>
					<Sidebar />
				</div>
			</div>
		</>
	);
};

export default CreateSecret;
