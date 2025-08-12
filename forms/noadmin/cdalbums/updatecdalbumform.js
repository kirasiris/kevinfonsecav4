"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { fetchurl } from "@/helpers/setTokenOnServer";
import AdminSidebar from "@/components/noadmin/myfinaladminsidebar";
import MyTextArea from "@/components/global/myfinaltextarea";
import FormButtons from "@/components/global/formbuttons";

const UpdateCDAlbumForm = ({
	token = {},
	auth = {},
	object = {},
	objects = [],
}) => {
	const router = useRouter();

	const [btnText, setBtnText] = useState(`Submit`);

	const upgradeCDAlbum = async (e) => {
		e.preventDefault();
		setBtnText("...");
		const form = e.target;
		const formData = new FormData(form);
		const rawFormData = {
			title: formData.get("title"),
			text: formData.get("text"),
			featured: formData.get("featured"),
			// category: formData.get("category"),
			commented: formData.get("commented"),
			password: formData.get("password"),
			onairtype: formData.get("onairtype"),
			status: formData.get("status"),
			files: { avatar: formData.get("file") },
		};

		const res = await fetchurl(
			`/noadmin/playlists/${object?.data?._id}`,
			"PUT",
			"no-cache",
			{
				...rawFormData,
				onairstatus: "finished",
				onairtype: "cd-album",
				playlistType: "audio",
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
		setBtnText(btnText);
		//resetForm();
		router.push(`/noadmin/cdalbums`);
	};

	const resetForm = (e) => {
		e.target.closest("form").reset();
	};

	return (
		<form className="row" onSubmit={upgradeCDAlbum}>
			<div className="col">
				<label htmlFor="category-title" className="form-label">
					Title
				</label>
				<input
					id="category-title"
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
					onModel="Playlist"
					advancedTextEditor={true}
					customPlaceholder="Type something..."
					charactersLimit={99999}
					isRequired={true}
				/>
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
					categories={categories?.data}
					multiple_categories={false}
				/>
				<br />
				<FormButtons />
			</div>
		</form>
	);
};

export default UpdateCDAlbumForm;
