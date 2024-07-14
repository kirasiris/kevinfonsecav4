import { fetchurl } from "@/helpers/setTokenOnServer";
import { revalidatePath } from "next/cache";
import MyTextArea from "./myfinaltextarea";
import FormButtons from "./formbuttons";

const MyFinalCommentForm = ({
	resourceId = null,
	parentId = null,
	returtopageurl = ``,
	postType = "blog",
	onModel = "Blog",
}) => {
	const addComment = async (formData) => {
		"use server";
		const rawFormData = {
			title: formData.get("title"),
			text: formData.get("text"),
			parentId: parentId,
			postType: postType,
			onModel: onModel,
		};
		await fetchurl(`/comments/${resourceId}`, "POST", "no-cache", rawFormData);
		revalidatePath(returtopageurl);
	};
	return (
		<form className="mb-3" action={addComment}>
			<div className="card mb-3">
				<div className="card-body">
					<input
						id={`title`}
						name={`title`}
						type="text"
						className="form-control mb-3"
						required
						placeholder="Title *"
						defaultValue=""
					/>
					<MyTextArea
						auth={undefined}
						token={undefined}
						id="text"
						name="text"
						onModel="Comment"
						advancedTextEditor={false}
						customPlaceholder="Tell us what you think!"
						defaultValue=""
					/>
				</div>
				<div className="card-footer">
					<FormButtons />
				</div>
			</div>
		</form>
	);
};

export default MyFinalCommentForm;
