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

const UpdateShortUrlForm = ({ object = {}, currentpage = "" }) => {
	const router = useRouter();
	const isMountedRef = useIsMounted();
	const submittingRef = useRef(false);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [isLeaving, startLeaving] = useTransition();
	const [error, setError] = useState("");

	const savedText = object?.data?.text;
	const textIsHidden = savedText != null && typeof savedText !== "string";

	const upgradeShortUrl = async (e) => {
		e.preventDefault();
		if (submittingRef.current) {
			return;
		}
		const form = e.currentTarget;
		const formData = new FormData(form);

		const text = formData.get("text") || "";
		const mentions = JSON.parse(formData.get("text_users") || "[]");
		const tags = JSON.parse(formData.get("text_hashtags") || "[]");

		const bodyUnchanged = !textIsHidden && text === (savedText || "");
		const textFields =
			textIsHidden && !text.trim()
				? {}
				: {
						text,
						mentions:
							bodyUnchanged && !mentions.length
								? (object?.data?.mentions || []).map(toMention)
								: mentions,
						tags:
							bodyUnchanged && !tags.length ? object?.data?.tags || [] : tags,
					};

		const rawFormData = {
			title: formData.get("title"),
			longUrl: formData.get("longUrl"),
			...textFields,
		};

		submittingRef.current = true;
		setIsSubmitting(true);
		setError("");
		const res = await safeFetch(
			`/noadmin/extras/tools/urls/regression/${object?.data?._id}`,
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
			setError(actionMessage(res, "Could not update the short URL"));
			shakeElement(form);
			return;
		}
		toast.success(`Short URL "${rawFormData.title}" updated`);
		startLeaving(() => router.push(currentpage));
	};

	return (
		<div className="d-grid gap-2 mb-4">
			<form
				key={object?.data?._id}
				onSubmit={upgradeShortUrl}
				onReset={() => setError("")}
			>
				<label htmlFor="title" className="form-label">
					Title
				</label>
				<input
					id="title"
					name="title"
					defaultValue={object?.data?.title}
					type="text"
					className="form-control mb-3"
					required
					placeholder=""
				/>
				<label htmlFor="longUrl" className="form-label">
					Long Url
				</label>
				<input
					id="longUrl"
					name="longUrl"
					defaultValue={object?.data?.longUrl}
					type="text"
					className="form-control mb-3"
					required
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
					defaultValue={textIsHidden ? "" : savedText}
					onModel="ShortUrl"
					advancedTextEditor={false}
					customPlaceholder="Type something..."
					charactersLimit={99999}
					isRequired={!textIsHidden}
				/>
				{textIsHidden && (
					<div className="form-text mb-3">
						The saved text can&apos;t be shown here because the API sends it
						encrypted. Leave this empty to keep it, or type a new text to
						replace it.
					</div>
				)}
				{error && (
					<div className="alert alert-danger py-2 px-3 mb-0 small" role="alert">
						{error}
					</div>
				)}
				<br />
				<FormButtons pending={isSubmitting || isLeaving} />
			</form>
		</div>
	);
};

export default UpdateShortUrlForm;
