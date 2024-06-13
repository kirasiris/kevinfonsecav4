import { fetchurl, getAuthTokenOnServer } from "@/helpers/setTokenOnServer";
import { redirect } from "next/navigation";
import AdminSidebar from "@/components/admin/myfinaladminsidebar";
import MyTextArea from "@/components/global/myfinaltextarea";
import FormButtons from "@/components/global/formbuttons";

async function getAuthenticatedUser() {
	const res = await fetchurl(`/auth/me`, "GET", "force-cache");
	return res;
}

// async function getFiles(params) {
// 	const res = await fetchurl(`/files${params}`, "GET", "no-cache");
// 	return res;
// }

// async function getCategories(params) {
// 	const res = await fetchurl(`/categories${params}`, "GET", "no-cache");
// 	return res;
// }

const CreateCDAlbum = async ({ params, searchParams }) => {
	const token = await getAuthTokenOnServer();
	const auth = await getAuthenticatedUser();

	// const files = await getFiles(`?page=1&limit=100&sort=-createdAt`);
	// const categories = await getCategories(`?categoryType=playlist`);

	const addCDAlbum = async (formData) => {
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
			// files: { avatar: formData.get("file") },
		};
		await fetchurl(`/playlists`, "POST", "no-cache", {
			...rawFormData,
			onairstatus: "finished",
			onairtype: "cd-album",
			playlistType: "audio",
		});
		redirect(`/noadmin/cdalbums`);
	};

	return (
		<form className="row" action={addCDAlbum}>
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
					placeholder=""
				/>
				<label htmlFor="text" className="form-label">
					Text
				</label>
				<MyTextArea
					auth={auth}
					id="text"
					name="text"
					onModel="Playlist"
					advancedTextEditor={true}
					customPlaceholder="No description"
					defaultValue="No description..."
				/>
			</div>
			<div className="col-lg-3">
				<AdminSidebar
					displayCategoryField={false}
					displayAvatar={false}
					// avatar={files?.selected?._id}
					status="draft"
					fullWidth={false}
					password=""
					featured={true}
					commented={true}
					embedding={false}
					github_readme={""}
					category={undefined}
					categories={[]}
					multipleFiles={false}
					onModel={"Playlist"}
					files={[]}
					auth={auth}
					token={token}
				/>
				<br />
				<FormButtons />
			</div>
		</form>
	);
};

export default CreateCDAlbum;
