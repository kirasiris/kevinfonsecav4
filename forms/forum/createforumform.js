"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { fetchurl } from "@/helpers/setTokenOnServer";
import MyTextArea from "@/components/global/myfinaltextarea";
import FormButtons from "@/components/global/formbuttons";

const CreateForumForm = ({ params, searchParams }) => {
	const router = useRouter();

	const [, setBtnText] = useState(`Submit`);

	const addForum = async (e) => {
		e.preventDefault();
		setBtnText("...");
		const form = e.target;
		const formData = new FormData(form);

		const rawFormData = {
			title: formData.get("title"),
			text: formData.get("text"),
			category: params.category,
			sub_category: params.subcategory,
			status: "published",
			commented: true,
		};

		const res = await fetchurl(
			`/protected/forums`,
			"POST",
			"no-cache",
			rawFormData,
			undefined,
			false,
			false,
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
		toast.success(`Forum created`, "bottom");
		router.push(`/forum`);
	};

	const resetForm = (e) => {
		e.target.closest("form").reset();
	};

	return (
		<form className="row mb-5" onSubmit={addForum}>
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
					defaultValue="No description..."
					onModel="Forum"
					advancedTextEditor={true}
					customPlaceholder="No description"
					charactersLimit={99999}
					isRequired={true}
				/>
				<br />
				<FormButtons />
			</div>
		</form>
	);
};

export default CreateForumForm;
