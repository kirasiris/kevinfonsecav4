"use client";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { fetchurl } from "@/helpers/setTokenOnServer";
import MyTextArea from "@/components/global/myfinaltextarea";
import FormButtons from "@/components/global/formbuttons";

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

const INITIAL_STATUS = "draft";
const INITIAL_SCHEDULED_AT = null;

const CreateReviewForm = ({
	token = {},
	auth = {},
	params = {},
	searchParams = {},
}) => {
	const router = useRouter();

	const [isSubmitting, setIsSubmitting] = useState(false);

	const [currentStatus, setCurrentStatus] = useState(INITIAL_STATUS);
	const selectRef = useRef(null);
	const dateRef = useRef(null);

	useEffect(() => {
		const input = dateRef.current;
		if (!input) return;
		const value = INITIAL_SCHEDULED_AT
			? toLocalInputValue(INITIAL_SCHEDULED_AT)
			: "";
		input.defaultValue = value;
		input.value = value;
	}, []);

	useEffect(() => {
		const form = selectRef.current?.form;
		if (!form) return;
		const onReset = () => setCurrentStatus(INITIAL_STATUS);
		form.addEventListener("reset", onReset);
		return () => form.removeEventListener("reset", onReset);
	}, []);

	const isScheduled = currentStatus === "scheduled";

	const addReview = async (e) => {
		e.preventDefault();
		if (isSubmitting) return;
		setIsSubmitting(true);
		const form = e.target;
		const formData = new FormData(form);

		const status = formData.get("status");
		const scheduledAtLocal = formData.get("scheduledAt");

		const rawFormData = {
			user: formData.get("user") || undefined,
			name: formData.get("name"),
			email: formData.get("email"),
			website: formData.get("website"),
			title: formData.get("title"),
			text: formData.get("text"),
			mentions: JSON.parse(formData.get("text_users") || "[]"),
			tags: JSON.parse(formData.get("text_hashtags") || "[]"),
			status: status,
			scheduledAt:
				status === "scheduled" && scheduledAtLocal
					? new Date(scheduledAtLocal).toISOString()
					: null,
			resourceId: searchParams.resourceId,
			parentId: searchParams.parentId || undefined,
			onModel: searchParams.onModel,
		};

		const res = await fetchurl(
			`/noadmin/reviews`,
			"POST",
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

		toast.success(`Review created`);
		router.push(`/nfabusiness/reviews`);
	};

	return (
		<form className="row" onSubmit={addReview}>
			<div className="col">
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
					defaultValue=""
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
					defaultValue={auth?.userId || undefined}
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
							defaultValue=""
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
							defaultValue=""
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
							defaultValue=""
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
					defaultValue={INITIAL_STATUS}
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

export default CreateReviewForm;
