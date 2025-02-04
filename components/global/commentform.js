import { revalidatePath } from "next/cache";
import { checkEmptyObject } from "befree-utilities";
import { fetchurl } from "@/helpers/setTokenOnServer";
import FormButtons from "./formbuttons";

const CommentForm = ({
	auth = {},
	resourceId = null,
	parentId = null,
	returtopageurl = "/",
	onModel = "Blog",
}) => {
	const addComment = async (formData) => {
		"use server";
		const rawFormData = {
			title: formData.get("title"),
			text: formData.get("text"),
			name: formData.get("name"),
			email: formData.get("email"),
			website: formData.get("website"),
			resourceId: resourceId,
			parentId: parentId,
			onModel: onModel,
		};
		await fetchurl(`/comments/${resourceId}`, "POST", "no-cache", {
			...rawFormData,
			user: auth?.userId || undefined,
		});
		revalidatePath(returtopageurl);
	};

	return (
		<form id={parentId} className="mb-3" action={addComment}>
			<div className="alert alert-danger">
				Please, dont use the comments section yet!{" "}
				<b>There are still tests to be done</b>
			</div>
			<div className="card mb-3">
				<div className="card-body">
					<input
						id={`title`}
						name={`title`}
						type="text"
						className="form-control mb-3"
						required
						placeholder="Title *"
					/>
					<textarea
						id="text"
						name="text"
						className="form-control mb-3"
						rows="5"
						placeholder="Tell us what you think!"
					/>
					{checkEmptyObject(auth?.userId) && (
						<>
							<input
								id={`name`}
								name={`name`}
								type="text"
								className="form-control mb-3"
								required
								placeholder="Name *"
							/>
							<input
								id={`email`}
								name={`email`}
								type="email"
								className="form-control mb-3"
								required
								placeholder="Email *"
							/>
							<input
								id={`website`}
								name={`website`}
								type="url"
								className="form-control mb-3"
								required
								placeholder="Website"
							/>
						</>
					)}
				</div>
				<div className="card-footer">
					<FormButtons />
				</div>
			</div>
		</form>
	);
};
export default CommentForm;
