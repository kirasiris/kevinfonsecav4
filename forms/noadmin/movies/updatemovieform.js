"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { fetchurl } from "@/helpers/setTokenOnServer";
import AdminSidebar from "@/components/noadmin/myfinaladminsidebar";
import MyTextArea from "@/components/global/myfinaltextarea";
import FormButtons from "@/components/global/formbuttons";

const UpdateMovieForm = ({
	token = {},
	auth = {},
	object = {},
	objects = [],
}) => {
	const router = useRouter();

	const [btnText, setBtnText] = useState(`Submit`);

	const upgradeMovie = async (e) => {
		e.preventDefault();
		setBtnText("...");
		const form = e.target;
		const formData = new FormData(form);

		const rawFormData = {
			title: formData.get("title"),
			text: formData.get("text"),
			featured: formData.get("featured"),
			category: formData.get("category"),
			commented: formData.get("commented"),
			password: formData.get("password"),
			onairstatus: formData.get("onairstatus"),
			status: formData.get("status"),
			files: { avatar: formData.get("file") || undefined },
		};

		const res = await fetchurl(
			`/noadmin/playlists/${object?.data?._id}`,
			"PUT",
			"no-cache",
			{
				...rawFormData,
				onairtype: "movie",
				playlistType: "video",
			}
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
		toast.success(`Movie updated`, "bottom");
		router.push(`/noadmin/movies`);
	};

	const resetForm = (e) => {
		e.target.closest("form").reset();
	};

	return (
		<form className="row" onSubmit={upgradeMovie}>
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
					onModel="Playlist"
					advancedTextEditor={true}
					customPlaceholder="No description"
				/>
				<div className="row">
					<div className="col">
						<label htmlFor="onairstatus" className="form-label">
							On Air Status
						</label>
						<select
							id="onairstatus"
							name="onairstatus"
							defaultValue={object?.data?.onairstatus}
							className="form-control"
							required
						>
							<option value={`onair`}>On Air</option>
							<option value={`finished`}>Finished</option>
							<option value={`soon`}>Soon</option>
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
					featured={object?.data?.featured.toString()}
					commented={object?.data?.commented.toString()}
					embedding={false}
					github_readme={""}
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

export default UpdateMovieForm;
