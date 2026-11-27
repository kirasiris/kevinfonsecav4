"use client";
import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import MyTextArea from "@/components/global/myfinaltextarea";
import FormButtons from "@/components/global/formbuttons";
import { isFailure, safeFetch } from "@/helpers/filemanagerhelpers";
import { useIsMounted } from "@/components/global/filemanagerui";
import {
	actionMessage,
	shakeElement,
} from "@/components/global/actionfeedback";

const CreateeQuoteForm = () => {
	const router = useRouter();
	const isMountedRef = useIsMounted();
	const submittingRef = useRef(false);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [error, setError] = useState("");

	const addQuote = async (e) => {
		e.preventDefault();

		if (submittingRef.current) {
			return;
		}
		const form = e.currentTarget;
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

		submittingRef.current = true;
		setIsSubmitting(true);
		setError("");
		const res = await safeFetch(
			`/extras/quotes`,
			"POST",
			"no-cache",
			rawFormData,
			undefined,
			false,
			false,
		);
		submittingRef.current = false;
		if (!isMountedRef.current) {
			return;
		}
		setIsSubmitting(false);

		if (isFailure(res)) {
			setError(actionMessage(res, "Could not create the quote"));
			shakeElement(form);
			return;
		}
		toast.success("Quote created");
		form.reset();
		router.refresh();
	};

	return (
		<form onSubmit={addQuote} onReset={() => setError("")}>
			<label htmlFor="text" className="form-label">
				Text
			</label>
			<MyTextArea
				auth={undefined}
				token={undefined}
				id="text"
				name="text"
				defaultValue=""
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
				defaultValue=""
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
				defaultValue=""
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
				defaultValue=""
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
				defaultValue=""
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
				defaultValue={true}
				className="form-select"
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
				defaultValue="draft"
				className="form-select"
			>
				<option value={`draft`}>Draft</option>
				<option value={`published`}>Published</option>
				<option value={`trash`}>Trash</option>
			</select>
			{error && (
				<div
					className="alert alert-danger py-2 px-3 mt-3 mb-0 small"
					role="alert"
				>
					{error}
				</div>
			)}
			<br />
			<FormButtons pending={isSubmitting} />
		</form>
	);
};

export default CreateeQuoteForm;
