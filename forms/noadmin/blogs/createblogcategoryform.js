"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { fetchurl } from "@/helpers/setTokenOnServer";
import MyTextArea from "@/components/global/myfinaltextarea";
import FormButtons from "@/components/global/formbuttons";

const CreateBlogCategoryForm = ({
	page = "1",
	limit = "10",
	sort = "-createdAt",
	objects = [],
}) => {
	const router = useRouter();

	const [btnText, setBtnText] = useState(`Submit`);

	const createCategory = async (e) => {
		e.preventDefault();
		setBtnText("...");
		const form = e.target;
		const formData = new FormData(form);
		const rawFormData = {
			title: formData.get("title"),
			text: formData.get("text"),
			parentId: formData.get("parentId"),
			deletable: formData.get("deletable"),
		};

		const res = await fetchurl(`/noadmin/categories`, "POST", "no-cache", {
			...rawFormData,
			categoryType: "blog",
		});

		if (res.status === "error") {
			toast.error(res.message, "bottom");
			setBtnText("Submit");
			return;
		}
		if (res.status === "fail") {
			toast.error(res.message, "bottom");
			setBtnText("Submit");
			return;
		}
		setBtnText(btnText);
		//resetForm();
		router.push(
			`/noadmin/blogs/categories?page=${page}&limit=${limit}&sort=${sort}`
		);
	};

	const resetForm = (e) => {
		e.target.closest("form").reset();
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
				onModel="Category"
				advancedTextEditor={false}
				customPlaceholder="Type something..."
				charactersLimit={99999}
				isRequired={true}
			/>
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

export default CreateBlogCategoryForm;
