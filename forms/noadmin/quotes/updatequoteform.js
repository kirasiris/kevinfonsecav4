"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { fetchurl } from "@/helpers/setTokenOnServer";
import MyTextArea from "@/components/global/myfinaltextarea";
import FormButtons from "@/components/global/formbuttons";

const UpdateQuoteForm = ({ currentpage = "", object = {} }) => {
	const router = useRouter();

	const [btnText, setBtnText] = useState(`Submit`);

	const upgradeQuote = async (e) => {
		e.preventDefault();
		setBtnText("...");
		const form = e.target;
		const formData = new FormData(form);
		const rawFormData = {
			text: formData.get("text"),
			authorName: formData.get("authorName"),
			authorUrl: formData.get("authorUrl"),
			sourceWebsite: formData.get("sourceWebsite"),
			sourceUrl: formData.get("sourceUrl"),
			status: formData.get("status"),
			embedding: formData.get("embedding"),
		};

		const res = await fetchurl(
			`/extras/quotes/${object?.data?._id}`,
			"PUT",
			"no-cache",
			rawFormData
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
		<form onSubmit={upgradeQuote}>
			<label htmlFor="text" className="form-label">
				Text
			</label>
			<MyTextArea
				auth={undefined}
				token={undefined}
				id="text"
				name="text"
				defaultValue={object?.data?.text}
				onModel="Quote"
				advancedTextEditor={false}
				customPlaceholder="Type something..."
				charactersLimit={99999}
				isRequired={true}
			/>
			<label htmlFor="authorName" className="form-label">
				Author Name
			</label>
			<input
				id="authorName"
				name="authorName"
				defaultValue={object?.data?.authorName}
				type="text"
				className="form-control mb-3"
				placeholder="Someone"
			/>
			<label htmlFor="authorUrl" className="form-label">
				Author Url
			</label>
			<input
				id="authorUrl"
				name="authorUrl"
				defaultValue={object?.data?.authorUrl}
				type="text"
				className="form-control mb-3"
				placeholder="#"
			/>
			<label htmlFor="sourceWebsite" className="form-label">
				Source Website
			</label>
			<input
				id="sourceWebsite"
				name="sourceWebsite"
				defaultValue={object?.data?.sourceWebsite}
				type="text"
				className="form-control mb-3"
				placeholder="Somewhere"
			/>
			<label htmlFor="sourceUrl" className="form-label">
				Source Url
			</label>
			<input
				id="sourceUrl"
				name="sourceUrl"
				defaultValue={object?.data?.sourceUrl}
				type="text"
				className="form-control mb-3"
				placeholder="#"
			/>
			<label htmlFor="embedding" className="form-label">
				Embedding
			</label>
			<select
				id="embedding"
				name="embedding"
				defaultValue={object?.data?.embedding.toString()}
				className="form-control"
			>
				<option value={true}>Yes</option>
				<option value={false}>No</option>
			</select>
			<label htmlFor="status" className="form-label">
				Status
			</label>
			<select
				id="status"
				name="status"
				defaultValue={object?.data?.status}
				className="form-control"
			>
				<option value={`draft`}>Draft</option>
				<option value={`published`}>Published</option>
				<option value={`trash`}>Trash</option>
				<option value={`scheduled`}>Scheduled</option>
			</select>
			<br />
			<FormButtons />
		</form>
	);
};

export default UpdateQuoteForm;
