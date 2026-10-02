"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { fetchurl } from "@/helpers/setTokenOnServer";
import AdminSidebar from "@/components/noadmin/myfinaladminsidebar";
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

const UpdateQuizForm = ({
	token = {},
	auth = {},
	object = {},
	objects = [],
}) => {
	const router = useRouter();

	const [btnText, setBtnText] = useState(`Submit`);

	const savedFiles = Array.isArray(object?.data?.files?.extras)
		? object?.data?.files.extras
		: [];

	const upgradeQuiz = async (e) => {
		e.preventDefault();
		setBtnText(`Processing...`);
		const form = e.target;
		const formData = new FormData(form);

		const text = formData.get("text") || "";
		const mentions = JSON.parse(formData.get("text_users") || "[]");
		const tags = JSON.parse(formData.get("text_hashtags") || "[]");
		const extras = JSON.parse(formData.get("text_files") || "[]");

		const bodyUnchanged = text === (object?.data?.text || "");

		const rawFormData = {
			title: formData.get("title"),
			text: formData.get("text"),
			mentions:
				bodyUnchanged && !mentions.length
					? (object?.data?.mentions || []).map(toMention)
					: mentions,
			tags: bodyUnchanged && !tags.length ? object?.data?.tags || [] : tags,
			duration: formData.get("duration"),
			minimumScore: formData.get("minimumScore"),
			maximumScore: formData.get("maximumScore"),
			embedding: formData.get("embedding"),
			category: formData.get("category"),
			commented: formData.get("commented"),
			status: formData.get("status"),
			attempts: formData.get("attempts"),
			singlePage: formData.get("singlePage"),
			files: {
				avatar: formData.get("file") || undefined,
				extras:
					bodyUnchanged && !extras.length
						? savedFiles.map(toId).filter(Boolean)
						: extras,
			},
		};

		const res = await fetchurl(
			`/noadmin/quizzes/${object?.data?._id}`,
			"PUT",
			"no-cache",
			rawFormData,
			undefined,
			false,
			false,
		);

		if (res.status === "error") {
			toast.error(res.message);
			setBtnText(btnText);
			return;
		}
		if (res.status === "fail") {
			toast.error(res.message);
			setBtnText(btnText);
			return;
		}
		toast.success(`Quizz updated`);
		router.push(`/noadmin/quizzes`);
	};

	return (
		<form key={object?.data?._id} className="row" onSubmit={upgradeQuiz}>
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
					placeholder=""
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
					onModel="Quiz"
					advancedTextEditor={true}
					customPlaceholder="No description"
					charactersLimit={99999}
					isRequired={true}
				/>
				<div className="row">
					<div className="col">
						<div className="col">
							<label htmlFor="duration" className="form-label">
								Duration
							</label>
							<input
								id="duration"
								name="duration"
								defaultValue={object?.data?.duration}
								type="number"
								className="form-control mb-3"
								placeholder=""
								min="1"
								max="100"
							/>
						</div>
					</div>
					<div className="col">
						<label htmlFor="minimumScore" className="form-label">
							Minimum Score
						</label>
						<input
							id="minimumScore"
							name="minimumScore"
							defaultValue={object?.data?.minimumScore}
							type="number"
							className="form-control mb-3"
							placeholder=""
							min="1"
							max="100"
						/>
					</div>
					<div className="col">
						<label htmlFor="maximumScore" className="form-label">
							Maximum Score
						</label>
						<input
							id="maximumScore"
							name="maximumScore"
							defaultValue={object?.data?.maximumScore}
							type="number"
							className="form-control mb-3"
							placeholder=""
							min="1"
							max="100"
						/>
					</div>
				</div>
				<div className="row">
					<div className="col">
						<label htmlFor="attempts" className="form-label">
							Attempts
						</label>
						<input
							id="attempts"
							name="attempts"
							defaultValue={object?.data?.attempts}
							type="number"
							className="form-control mb-3"
							placeholder=""
							min="1"
						/>
					</div>
					<div className="col">
						<label htmlFor="singlePage" className="form-label">
							Single Page
						</label>
						<select
							id="singlePage"
							name="singlePage"
							defaultValue={object?.data?.singlePage.toString()}
							className="form-select"
						>
							<option value={true}>Yes</option>
							<option value={false}>No</option>
						</select>
					</div>
				</div>
			</div>
			<div className="col-lg-3">
				<AdminSidebar
					displayCategoryField={true}
					displayAvatar={true}
					avatar={object?.data?.files}
					avatarFormat={object?.data?.files?.avatar?.format_type}
					status={object?.data?.status}
					fullWidth={false}
					password=""
					featured={false}
					commented={object?.data?.commented.toString()}
					embedding={object?.data?.embedding.toString()}
					category={object?.data?.category?._id || object?.data?.category}
					categories={objects?.data}
					multiple_categories={false}
				/>
				<br />
				<FormButtons />
			</div>
		</form>
	);
};

export default UpdateQuizForm;
