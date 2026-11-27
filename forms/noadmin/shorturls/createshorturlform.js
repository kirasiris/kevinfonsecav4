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

const CreateShortUrlForm = ({ auth = {} }) => {
	const router = useRouter();
	const isMountedRef = useIsMounted();
	const submittingRef = useRef(false);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [error, setError] = useState("");

	const addShortUrl = async (e) => {
		e.preventDefault();
		if (submittingRef.current) {
			return;
		}
		const form = e.currentTarget;
		const formData = new FormData(form);

		const rawFormData = {
			title: formData.get("title"),
			longUrl: formData.get("longUrl"),
			text: formData.get("text"),
			mentions: JSON.parse(formData.get("text_users") || "[]"),
			tags: JSON.parse(formData.get("text_hashtags") || "[]"),
			user: auth?.userId,
			website: process.env.NEXT_PUBLIC_WEBSITE_NAME,
		};

		submittingRef.current = true;
		setIsSubmitting(true);
		setError("");
		const res = await safeFetch(
			`/global/extras/tools/urls/regression`,
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
			setError(actionMessage(res, "Could not create the short URL"));
			shakeElement(form);
			return;
		}
		toast.success(`Short URL "${rawFormData.title}" created`);
		form.reset();
		form.elements.namedItem("title")?.focus();
		router.refresh();
	};

	return (
		<div className="d-grid gap-2 mb-4">
			<form onSubmit={addShortUrl} onReset={() => setError("")}>
				<label htmlFor="title" className="form-label">
					Title
				</label>
				<input
					id="title"
					name="title"
					defaultValue="Untitled"
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
					defaultValue=""
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
					defaultValue=""
					onModel="ShortUrl"
					advancedTextEditor={false}
					customPlaceholder="Type something..."
					charactersLimit={99999}
					isRequired={true}
				/>
				{error && (
					<div className="alert alert-danger py-2 px-3 mb-0 small" role="alert">
						{error}
					</div>
				)}
				<br />
				<FormButtons pending={isSubmitting} />
			</form>
		</div>
	);
};

export default CreateShortUrlForm;
