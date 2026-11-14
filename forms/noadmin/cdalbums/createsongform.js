"use client";
import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { fetchurl } from "@/helpers/setTokenOnServer";
import AdminSidebar from "@/components/noadmin/myfinaladminsidebar";
import MyTextArea from "@/components/global/myfinaltextarea";
import FormButtons from "@/components/global/formbuttons";
import {
	MediaFilePicker,
	useIsMounted,
} from "@/components/global/filemanagerui";

const CreateSongForm = ({ token = {}, auth = {}, params = {} }) => {
	const router = useRouter();
	const isMountedRef = useIsMounted();
	const submittingRef = useRef(false);

	const [isSubmitting, setIsSubmitting] = useState(false);

	const addSong = async (e) => {
		e.preventDefault();
		if (submittingRef.current) return;
		submittingRef.current = true;
		setIsSubmitting(true);
		const form = e.target;
		const formData = new FormData(form);

		const status = formData.get("status");
		const scheduledAtLocal = formData.get("scheduledAt");

		const rawFormData = {
			title: formData.get("title"),
			sub_title: formData.get("sub_title"),
			text: formData.get("text"),
			tags: JSON.parse(formData.get("text_hashtags") || "[]"),
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
			resourceId: params.id,
			onModel: "Playlist",
		};

		const res = await fetchurl(
			`/noadmin/songs`,
			"POST",
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
			submittingRef.current = false;
			if (isMountedRef.current) setIsSubmitting(false);
			return;
		}
		toast.success(`Song created`);
		router.push(`/noadmin/cdalbums/read/${params.id}`);
	};

	return (
		<form className="row" onSubmit={addSong}>
			<div className="col">
				<label htmlFor="blog-title" className="form-label">
					Title
				</label>
				<input
					id="blog-title"
					name="title"
					defaultValue="Untitled"
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
					defaultValue=""
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
					defaultValue="No description..."
					onModel="Song"
					advancedTextEditor={true}
					customPlaceholder="No description"
					charactersLimit={99999}
					isRequired={true}
				/>
				<div className="row">
					<div className="col">
						<MediaFilePicker name="audio_url" kind="audio" label="Audio" />
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
							defaultValue="0"
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
							defaultValue={5}
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
							defaultValue={1}
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
					avatar={undefined}
					avatarFormat={"audio"}
					status="draft"
					fullWidth={false}
					password=""
					featured={false}
					commented={true}
					embedding={true}
					category={undefined}
					categories={[]}
					multiple_categories={false}
				/>
				<br />
				<FormButtons pending={isSubmitting} />
			</div>
		</form>
	);
};

export default CreateSongForm;
