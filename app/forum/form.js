import { fetchurl } from "@/helpers/setTokenOnServer";
import { redirect } from "next/navigation";
import MyTextArea from "@/components/global/myfinaltextarea";
import FormButtons from "@/components/global/formbuttons";

const Form = async ({ params, searchParams }) => {
	const addForum = async (formData) => {
		"use server";
		const rawFormData = {
			title: formData.get("title"),
			text: formData.get("text"),
			category: params.category,
			sub_category: params.subcategory,
			status: "published",
			commented: true,
		};
		await fetchurl(`/global/forums`, "POST", "no-cache", {
			...rawFormData,
		});
		redirect(
			`/forum/category/${params.category}/subcategory/${params.subcategory}?page=${searchParams.page}&limit=${searchParams.limit}&sort=${searchParams.sort}`
		);
	};

	return (
		<form className="mb-5" action={addForum}>
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
					placeholder="Untitled"
				/>

				<label htmlFor="text" className="form-label">
					Text
				</label>
				<MyTextArea
					auth={undefined}
					id="text"
					name="text"
					onModel="Forum"
					advancedTextEditor={true}
					customPlaceholder="No description"
					defaultValue="No description..."
				/>
				<br />
				<FormButtons />
			</div>
		</form>
	);
};

export default Form;
