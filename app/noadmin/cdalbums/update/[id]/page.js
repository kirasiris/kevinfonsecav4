import {
	fetchurl,
	getAuthTokenOnServer,
	getUserOnServer,
} from "@/helpers/setTokenOnServer";
import { notFound, redirect } from "next/navigation";
import AdminSidebar from "@/components/noadmin/myfinaladminsidebar";
import MyTextArea from "@/components/global/myfinaltextarea";
import FormButtons from "@/components/global/formbuttons";

async function getCategories(params) {
	const res = await fetchurl(`/global/categories${params}`, "GET", "no-cache");
	return res;
}

async function getCDAlbum(params) {
	const res = await fetchurl(`/global/playlists${params}`, "GET", "no-cache");
	if (!res.success) notFound();
	return res;
}

const UpdateCDAlbum = async ({ params, searchParams }) => {
	const awtdParams = await params;
	const awtdSearchParams = await searchParams;
	const token = await getAuthTokenOnServer();
	const auth = await getUserOnServer();

	const cdalbum = await getCDAlbum(`/${awtdParams.id}`);

	// FILES
	const categories = await getCategories(`?categoryType=album`);

	const upgradeCDAlbum = async (formData) => {
		"use server";
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
		await fetchurl(`/noadmin/playlists/${awtdParams.id}`, "PUT", "no-cache", {
			...rawFormData,
			onairstatus: "finished",
			onairtype: "cd-album",
			playlistType: "audio",
		});
		redirect(`/noadmin/cdalbums`);
	};

	return (
		<form className="row" action={upgradeCDAlbum}>
			<div className="col">
				<label htmlFor="blog-title" className="form-label">
					Title
				</label>
				<input
					id="blog-title"
					name="title"
					defaultValue={cdalbum?.data?.title}
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
					onModel="Playlist"
					advancedTextEditor={true}
					customPlaceholder="No description"
					defaultValue={cdalbum?.data?.text}
				/>
			</div>
			<div className="col-lg-3">
				<AdminSidebar
					displayCategoryField={true}
					displayAvatar={true}
					avatar={cdalbum?.data?.files}
					avatarFormat={cdalbum?.data?.files?.avatar?.format_type}
					status={cdalbum?.data?.status}
					fullWidth={false}
					password=""
					featured={cdalbum?.data?.featured.toString()}
					commented={cdalbum?.data?.commented.toString()}
					embedding={false}
					github_readme={""}
					category={cdalbum?.data?.category?._id || cdalbum?.data?.category}
					categories={categories?.data}
					multiple_categories={false}
				/>
				<br />
				<FormButtons />
			</div>
		</form>
	);
};

export default UpdateCDAlbum;
