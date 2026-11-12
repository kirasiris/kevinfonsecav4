"use client";
import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { fetchurl } from "@/helpers/setTokenOnServer";
import AdminSidebar from "@/components/noadmin/myfinaladminsidebar";
import MyTextArea from "@/components/global/myfinaltextarea";
import FormButtons from "@/components/global/formbuttons";
import { MediaFilePicker } from "@/components/global/filemanagerui";

const UpdateSongForm = ({ token = {}, auth = {}, object = {} }) => {
	const router = useRouter();
	const submittingRef = useRef(false);

	const [btnText, setBtnText] = useState(`Submit`);

	const upgradeSong = async (e) => {
		e.preventDefault();
		if (submittingRef.current) return;
		submittingRef.current = true;
		setBtnText(`Processing...`);
		const form = e.target;
		const formData = new FormData(form);

		const text = formData.get("text") || "";
		const tags = JSON.parse(formData.get("text_hashtags") || "[]");

		const bodyUnchanged = text === (object?.data?.text || "");

		const status = formData.get("status");
		const scheduledAtLocal = formData.get("scheduledAt");

		const rawFormData = {
			title: formData.get("title"),
			sub_title: formData.get("sub_title"),
			text: formData.get("text"),
			tags: bodyUnchanged && !tags.length ? object?.data?.tags || [] : tags,
			commented: formData.get("commented"),
			embedding: formData.get("embedding"),
			category: formData.get("category"),
			password: formData.get("password"),
			status: status,
			scheduledAt:
				status === "scheduled" && scheduledAtLocal
					? new Date(scheduledAtLocal).toISOString()
					: null,
			duration: formData.get("duration"),
			averageRating: formData.get("averageRating"),
			orderingNumber: formData.get("orderingNumber"),
			files: {
				avatar: formData.get("file") || undefined,
				audio_url: formData.get("audio_url") || undefined,
			},
		};

		const res = await fetchurl(
			`/noadmin/songs/${object?.data?._id}`,
			"PUT",
			"no-cache",
			rawFormData,
			undefined,
			false,
			false,
		).catch((err) => ({
			status: "error",
			message: err && err.message,
		}));

		if (!res || res.status === "error" || res.status === "fail") {
			toast.error((res && res.message) || "Something went wrong");
			setBtnText(btnText);
			submittingRef.current = false;
			return;
		}
		toast.success(`Song updated`);
		router.push(`/noadmin/cdalbums/read/${object?.data?.resourceId?._id}`);
	};

	return (
		<form key={object?.data?._id} className="row" onSubmit={upgradeSong}>
			<div className="col">
				<label htmlFor="blog-title" className="form-label">
					Title
				</label>
				<input
					id="blog-title"
					name="title"
					defaultValue={object?.data?.title}
					type="text"
					className="form-control mb-3"
					required
					placeholder=""
				/>
				<label htmlFor="sub_title" className="form-label">
					Sub title
				</label>
				<input
					id="sub_title"
					name="sub_title"
					defaultValue={object?.data?.sub_title}
					type="text"
					className="form-control mb-3"
					placeholder=""
				/>
				<label htmlFor="text" className="form-label">
					Lyrics
				</label>
				<MyTextArea
					auth={auth}
					token={token}
					id="text"
					name="text"
					defaultValue={object?.data?.text}
					onModel="Song"
					advancedTextEditor={true}
					customPlaceholder="No description"
					charactersLimit={99999}
					isRequired={true}
				/>
				<div className="row">
					<div className="col">
						<MediaFilePicker
							name="audio_url"
							kind="audio"
							label="Audio"
							initialFile={object?.data?.files?.audio_url}
						/>
					</div>
				</div>
				<div className="row">
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
						<label htmlFor="averageRating" className="form-label">
							Average Rating
						</label>
						<select
							id="averageRating"
							name="averageRating"
							defaultValue={object?.data?.averageRating}
							className="form-select mb-3"
						>
							<option value={1}>1</option>
							<option value={2}>2</option>
							<option value={3}>3</option>
							<option value={4}>4</option>
							<option value={5}>5</option>
						</select>
					</div>
					<div className="col">
						<label htmlFor="orderingNumber" className="form-label">
							Order
						</label>
						<input
							id="orderingNumber"
							name="orderingNumber"
							defaultValue={object?.data?.orderingNumber}
							type="number"
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
					scheduledAt={object?.data?.scheduledAt}
					fullWidth={false}
					password=""
					featured={false}
					commented={object?.data?.commented.toString()}
					embedding={object?.data?.embedding.toString()}
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

export default UpdateSongForm;
