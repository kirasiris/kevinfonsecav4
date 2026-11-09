"use client";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { fetchurl } from "@/helpers/setTokenOnServer";
import MyTextArea from "@/components/global/myfinaltextarea";
import FormButtons from "@/components/global/formbuttons";

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

const toLocalInputValue = (date) => {
	const d = new Date(date);
	if (Number.isNaN(d.getTime())) return "";
	return new Date(d.getTime() - d.getTimezoneOffset() * 60000)
		.toISOString()
		.slice(0, 16);
};

const isFailedResponse = (res) =>
	!res ||
	res instanceof Error ||
	res.status === "error" ||
	res.status === "fail" ||
	res.success === false;

const UpdateReviewForm = ({ token = {}, auth = {}, object = {} }) => {
	const router = useRouter();

	const [isSubmitting, setIsSubmitting] = useState(false);

	const recordId = object?.data?._id;
	const initialStatus = object?.data?.status || "draft";
	const initialScheduledAt = object?.data?.scheduledAt || null;
	const [currentStatus, setCurrentStatus] = useState(initialStatus);
	const selectRef = useRef(null);
	const dateRef = useRef(null);

	useEffect(() => {
		const input = dateRef.current;
		if (!input) return;
		const value = initialScheduledAt
			? toLocalInputValue(initialScheduledAt)
			: "";
		input.defaultValue = value;
		input.value = value;
	}, [recordId, initialScheduledAt]);

	useEffect(() => {
		setCurrentStatus(initialStatus);
		const form = selectRef.current?.form;
		if (!form) return;
		const onReset = () => setCurrentStatus(initialStatus);
		form.addEventListener("reset", onReset);
		return () => form.removeEventListener("reset", onReset);
	}, [recordId, initialStatus]);

	const isScheduled = currentStatus === "scheduled";

	const savedFiles = Array.isArray(object?.data?.files?.extras)
		? object.data.files.extras
		: [];

	const upgradeReview = async (e) => {
		e.preventDefault();
		if (isSubmitting) return;
		setIsSubmitting(true);
		const form = e.target;
		const formData = new FormData(form);

		const text = formData.get("text") || "";
		const mentions = JSON.parse(formData.get("text_users") || "[]");
		const tags = JSON.parse(formData.get("text_hashtags") || "[]");
		const extras = JSON.parse(formData.get("text_files") || "[]");

		const bodyUnchanged = text === (object.data.text || "");

		const status = formData.get("status");
		const scheduledAtLocal = formData.get("scheduledAt");

		const rawFormData = {
			user: formData.get("user") || undefined,
			name: formData.get("name"),
			email: formData.get("email"),
			website: formData.get("website"),
			title: formData.get("title"),
			text: formData.get("text"),
			mentions:
				bodyUnchanged && !mentions.length
					? (object?.data?.mentions || []).map(toMention)
					: mentions,
			tags: bodyUnchanged && !tags.length ? object?.data?.tags || [] : tags,
			files: {
				extras:
					bodyUnchanged && !extras.length
						? savedFiles.map(toId).filter(Boolean)
						: extras,
			},
			scheduledAt:
				status === "scheduled" && scheduledAtLocal
					? new Date(scheduledAtLocal).toISOString()
					: null,
			resourceId: object?.data?.resourceId?._id,
			onModel: object?.data?.onModel,
		};

		const res = await fetchurl(
			`/noadmin/reviews/${object?.data?._id}`,
			"PUT",
			"no-cache",
			rawFormData,
			undefined,
			false,
			false,
		);

		if (isFailedResponse(res)) {
			toast.error(res?.message || "Something went wrong");
			setIsSubmitting(false);
			return;
		}

		toast.success(`Review upgraded`);
		router.push(`/nfabusiness/reviews`);
	};

	return (
		<form key={recordId} className="row" onSubmit={upgradeReview}>
			<div className="col">
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
					placeholder="Untitled"
				/>
				<label htmlFor="text" className="form-label">
					Text
				</label>
				<MyTextArea
					auth={auth}
					token={token}
					id="text"
					name="text"
					defaultValue={object?.data?.text}
					defaultFiles={savedFiles}
					onModel="Comment"
					advancedTextEditor={true}
					customPlaceholder="Type something..."
					charactersLimit={99999}
					isRequired={true}
				/>
				<label htmlFor="user" className="form-label">
					User ID
				</label>
				<input
					id="user"
					name="user"
					defaultValue={comment?.data.user?._id || undefined}
					type="text"
					className="form-control mb-3"
					placeholder="0123456789"
				/>
				<div className="row">
					<div className="col">
						<label htmlFor="name" className="form-label">
							Name
						</label>
						<input
							id="name"
							name="name"
							defaultValue={object?.data?.name}
							type="text"
							className="form-control mb-3"
							placeholder="John Doe"
						/>
					</div>
					<div className="col">
						<label htmlFor="email" className="form-label">
							Email
						</label>
						<input
							id="email"
							name="email"
							defaultValue={object?.data?.email}
							type="email"
							className="form-control mb-3"
							placeholder="john@doe.com"
						/>
					</div>
					<div className="col">
						<label htmlFor="website" className="form-label">
							Website
						</label>
						<input
							id="website"
							name="website"
							defaultValue={object?.data?.website}
							type="website"
							className="form-control mb-3"
							placeholder="https://demo.com/"
						/>
					</div>
				</div>
				<label htmlFor="status" className="form-label">
					Status
				</label>
				<select
					ref={selectRef}
					id="status"
					name="status"
					defaultValue={initialStatus}
					onChange={(e) => setCurrentStatus(e.target.value)}
					className="form-select mb-3"
				>
					<option value={`draft`}>Draft</option>
					<option value={`published`}>Published</option>
					<option value={`trash`}>Trash</option>
					<option value={`scheduled`}>Scheduled</option>
				</select>
				<div hidden={!isScheduled}>
					<label htmlFor="scheduledAt" className="form-label">
						Publish on
					</label>
					<input
						ref={dateRef}
						id="scheduledAt"
						name="scheduledAt"
						type="datetime-local"
						required={isScheduled}
						className="form-control mb-3"
					/>
				</div>
				<br />
				<FormButtons pending={isSubmitting} />
			</div>
		</form>
	);
};

export default UpdateReviewForm;
