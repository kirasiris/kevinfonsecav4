"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { fetchurl } from "@/helpers/setTokenOnServer";
import AdminSidebar from "@/components/noadmin/myfinaladminsidebar";
import MyTextArea from "@/components/global/myfinaltextarea";
import FormButtons from "@/components/global/formbuttons";

const UpdateLessonForm = ({ token = {}, auth = {}, object = {} }) => {
	const router = useRouter();

	const [btnText, setBtnText] = useState(`Submit`);

	const upgradeLesson = async (e) => {
		e.preventDefault();
		setBtnText("...");
		const form = e.target;
		const formData = new FormData(form);

		const rawFormData = {
			title: formData.get("title"),
			text: formData.get("text"),
			featured: formData.get("featured"),
			commented: formData.get("commented"),
			embedding: formData.get("embedding"),
			category: formData.get("category"),
			password: formData.get("password"),
			status: formData.get("status"),
			free_preview: formData.get("free_preview"),
			duration: formData.get("duration"),
			orderingNumber: formData.get("orderingNumber"),
			files: {
				avatar: formData.get("file") || undefined,
				video_url: formData.get("video_url") || undefined,
			},
			// address: "4442 Jackson Blvd, Columbia, SC 29209",
		};

		const res = await fetchurl(
			`/noadmin/videos/${object?.data?._id}`,
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
		toast.success(`Lesson updated`, "bottom");
		router.push(`/noadmin/courses/read/${object?.data?.resourceId?._id}`);
	};

	const resetForm = (e) => {
		e.target.closest("form").reset();
	};

	return (
		<form className="row" onSubmit={upgradeLesson}>
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
					onModel="Lesson"
					advancedTextEditor={true}
					customPlaceholder="No description"
				/>
				<div className="row">
					<div className="col">
						<label htmlFor="video_url" className="form-label">
							Video ID
						</label>
						<input
							id="video_url"
							name="video_url"
							defaultValue={object?.data?.files?.video_url?._id}
							type="text"
							className="form-control mb-3"
							placeholder="Here goes the videoId from files page"
						/>
					</div>
				</div>
				<div className="row">
					<div className="col">
						<label htmlFor="free_preview" className="form-label">
							Free Preview
						</label>
						<select
							id="free_preview"
							name="free_preview"
							defaultValue={object?.data?.free_preview.toString()}
							className="form-control mb-3"
						>
							<option value={true}>Yes</option>
							<option value={false}>No</option>
						</select>
					</div>
					<div className="col">
						<label htmlFor="duration" className="form-label">
							Duration
						</label>
						<input
							id="duration"
							name="duration"
							defaultValue={object?.data?.duration}
							type="text"
							className="form-control mb-3"
							placeholder=""
						/>
					</div>
					<div className="col">
						<label htmlFor="orderingNumber" className="form-label">
							Order
						</label>
						<input
							id="orderingNumber"
							name="orderingNumber"
							defaultValue={object?.data?.orderingNumber}
							type="text"
							className="form-control mb-3"
							placeholder="Here goes the #number of object within list"
						/>
					</div>
				</div>
			</div>
			<div className="col-lg-3">
				<AdminSidebar
					displayCategoryField={false}
					displayAvatar={true}
					avatar={object?.data?.files}
					avatarFormat={object?.data?.files?.avatar?.format_type}
					status={object?.data?.status}
					fullWidth={false}
					password={object?.data?.password}
					featured={object?.data?.featured.toString()}
					commented={object?.data?.commented.toString()}
					embedding={object?.data?.embedding.toString()}
					github_readme={""}
					category={undefined}
					categories={[]}
					multiple_categories={false}
				/>
				<br />
				<FormButtons />
			</div>
		</form>
	);
};

export default UpdateLessonForm;
