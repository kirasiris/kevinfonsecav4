"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { fetchurl } from "@/helpers/setTokenOnServer";
import MyTextArea from "@/components/global/myfinaltextarea";
import FormButtons from "@/components/global/formbuttons";

const UpdateCategoryForm = ({
	currentpage = "",
	object = {},
	objects = [],
}) => {
	const router = useRouter();

	const [btnText, setBtnText] = useState(`Submit`);

	const upgradeCategory = async (e) => {
		e.preventDefault();
		setBtnText("...");
		const form = e.target;
		const formData = new FormData(form);

		const rawFormData = {
			title: formData.get("title"),
			text: formData.get("text"),
			parentId: formData.get("parentId") || undefined,
			deletable: formData.get("deletable"),
		};

		const res = await fetchurl(
			`/noadmin/categories/${object?.data?._id}`,
			"PUT",
			"no-cache",
			rawFormData,
		);

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
		router.push(currentpage);
	};

	const resetForm = (e) => {
		e.target.closest("form").reset();
	};

	return (
		<form onSubmit={upgradeCategory}>
			<label htmlFor="category-title" className="form-label">
				Title
			</label>
			<input
				id="category-title"
				name="title"
				defaultValue={object?.data?.title}
				type="text"
				className="form-control mb-3"
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
				defaultValue={object?.data?.text}
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
				defaultValue={object?.data?.parentId}
				className="form-control mb-3"
			>
				{object?.data?.parentId && (
					<option value={object.data.parentId}>
						{
							objects?.data?.find((item) => item._id === object.data.parentId)
								?.title
						}
					</option>
				)}
				<option>Select category</option>
				{objects?.data
					?.filter((item) => item._id !== object?.data?.parentId)
					.map((item) => (
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
				defaultValue={object?.data?.deletable}
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

export default UpdateCategoryForm;
