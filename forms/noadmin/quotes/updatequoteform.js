"use client";
import { useRef, useState, useTransition } from "react";
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

const toId = (value) => {
	if (!value) {
		return "";
	}
	if (typeof value === "string" || typeof value === "number") {
		return String(value);
	}
	return String(value._id || value.id || "");
};

const toMention = (value) =>
	typeof value === "string" || typeof value === "number"
		? { id: String(value), username: "" }
		: { id: toId(value), username: value?.username || "" };

const UpdateQuoteForm = ({ currentpage = "", object = {} }) => {
	const router = useRouter();
	const isMountedRef = useIsMounted();
	const submittingRef = useRef(false);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [isLeaving, startLeaving] = useTransition();
	const [error, setError] = useState("");

	const upgradeQuote = async (e) => {
		e.preventDefault();
		if (submittingRef.current) {
			return;
		}
		const form = e.currentTarget;
		const formData = new FormData(form);

		const text = formData.get("text") || "";
		const mentions = JSON.parse(formData.get("text_users") || "[]");
		const tags = JSON.parse(formData.get("text_hashtags") || "[]");

		const bodyUnchanged = text === (object?.data?.text || "");

		const rawFormData = {
			text: formData.get("text"),
			mentions:
				bodyUnchanged && !mentions.length
					? (object?.data?.mentions || []).map(toMention)
					: mentions,
			tags: bodyUnchanged && !tags.length ? object?.data?.tags || [] : tags,
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
			`/extras/quotes/${object?.data?._id}`,
			"PUT",
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
			setError(actionMessage(res, "Could not update the quote"));
			shakeElement(form);
			return;
		}
		toast.success("Quote updated");
		startLeaving(() => router.push(currentpage));
	};

	return (
		<form
			key={object?.data?._id}
			onSubmit={upgradeQuote}
			onReset={() => setError("")}
		>
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
				defaultValue={String(object?.data?.embedding ?? false)}
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
				defaultValue={object?.data?.status}
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
			<FormButtons pending={isSubmitting || isLeaving} />
		</form>
	);
};

export default UpdateQuoteForm;
