"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { fetchurl } from "@/helpers/setTokenOnServer";
import MyTextArea from "@/components/global/myfinaltextarea";
import FormButtons from "@/components/global/formbuttons";

const CreateQuizCategoryForm = ({
	page = "1",
	limit = "10",
	sort = "-createdAt",
	objects = [],
}) => {
	const router = useRouter();

	const [btnText, setBtnText] = useState(`Submit`);
	const [draft, setDraft] = useState({ html: null, users: [], hashtags: [] });

	const createCategory = async (e) => {
		e.preventDefault();
		setBtnText("...");
		const form = e.target;
		const formData = new FormData(form);
		const rawFormData = {
			title: formData.get("title"),
			text: formData.get("text"),
			// mentions: JSON.parse(formData.get("text_users") || "[]"),
			// hashtags: JSON.parse(formData.get("text_hashtags") || "[]"),
			parentId: formData.get("parentId"),
			deletable: formData.get("deletable"),
			categoryType: "quiz",
		};

		const res = await fetchurl(
			`/noadmin/categories`,
			"POST",
			"no-cache",
			rawFormData,
			undefined,
			false,
			false,
		);

		if (res.status === "error") {
			toast.error(res.message);
			setBtnText("Submit");
			return;
		}
		if (res.status === "fail") {
			toast.error(res.message);
			setBtnText("Submit");
			return;
		}
		setBtnText(btnText);
		router.push(
			`/noadmin/quizzes/categories?page=${page}&limit=${limit}&sort=${sort}`,
		);
	};

	return (
		<form onSubmit={createCategory}>
			<label htmlFor="category-title" className="form-label">
				Title
			</label>
			<input
				id="category-title"
				name="title"
				defaultValue=""
				type="text"
				className="form-control mb-3"
				required
				placeholder="Untitled"
			/>
			<label htmlFor="text" className="form-label">
				Text
			</label>
			<MyTextArea
				auth={undefined}
				token={undefined}
				id="text"
				name="text"
				defaultValue=""
				value={draft.html ?? undefined}
				onChange={setDraft}
				onModel="Category"
				advancedTextEditor={false}
				customPlaceholder="Type something..."
				charactersLimit={99999}
				isRequired={true}
			/>
			{/* <p className="form-text mt-1 mb-3">
				{draft.html.replace(/<[^>]*>/g, "").length} characters
				{draft.users.length > 0 &&
					" · mentions: " + draft.users.map((u) => "@" + u.username).join(", ")}
				{draft.hashtags.length > 0 &&
					" · tags: " + draft.hashtags.map((t) => "#" + t).join(", ")}
			</p> */}
			<label htmlFor="parentId" className="form-label">
				Parent Category
			</label>
			<select
				id="parentId"
				name="parentId"
				defaultValue=""
				className="form-control mb-3"
			>
				<option value="">Select category</option>
				{objects?.data?.map((item) => (
					<option key={item._id} value={item._id}>
						{item.title}
					</option>
				))}
			</select>
			<label htmlFor="deletable" className="form-label">
				Deletable
			</label>
			<select
				id="deletable"
				name="deletable"
				defaultValue={false}
				className="form-control"
			>
				<option value={true}>Yes</option>
				<option value={false}>No</option>
			</select>
			<br />
			<FormButtons />
		</form>
	);
};

export default CreateQuizCategoryForm;
