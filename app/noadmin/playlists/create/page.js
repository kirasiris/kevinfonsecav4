import { fetchurl, getAuthTokenOnServer } from "@/helpers/setTokenOnServer";
import { redirect } from "next/navigation";
import AdminSidebar from "@/components/admin/myfinaladminsidebar";
import MyTextArea from "@/components/global/myfinaltextarea";
import FormButtons from "@/components/global/formbuttons";

async function getAuthenticatedUser() {
	const res = await fetchurl(`/auth/me`, "GET", "force-cache");
	return res;
}

async function getFiles(params) {
	const res = await fetchurl(`/files${params}`, "GET", "no-cache");
	return res;
}

async function getCategories(params) {
	const res = await fetchurl(`/categories${params}`, "GET", "no-cache");
	return res;
}

const CreatePlaylist = async ({ params, searchParams }) => {
	const token = await getAuthTokenOnServer();
	const auth = await getAuthenticatedUser();

	const files = await getFiles(`?page=1&limit=100&sort=-createdAt`);
	const categories = await getCategories(`?categoryType=playlist`);

	const addPlaylist = async (formData) => {
		"use server";
		const rawFormData = {
			title: formData.get("title"),
			text: formData.get("text"),
			featured: formData.get("featured"),
			category: formData.get("category"),
			commented: formData.get("commented"),
			password: formData.get("password"),
			onairstatus: formData.get("onairstatus"),
			onairtype: formData.get("onairtype"),
			status: formData.get("status"),
			files: { avatar: formData.get("file") },
		};
		await fetchurl(`/playlists`, "POST", "no-cache", {
			...rawFormData,
			playlistType: "video",
		});
		redirect(`/noadmin/playlists`);
	};

	return (
		<form className="row" action={addPlaylist}>
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
				<div className="row">
					<div className="col">
						<label htmlFor="onairstatus" className="form-label">
							On Air Status
						</label>
						<select
							id="onairstatus"
							name="onairstatus"
							defaultValue="onair"
							className="form-control"
						>
							<option value={`onair`}>On Air</option>
							<option value={`finished`}>Finished</option>
							<option value={`soon`}>Soon</option>
						</select>
					</div>
					<div className="col">
						<label htmlFor="onairtype" className="form-label">
							On Air Type
						</label>
						<select
							id="onairtype"
							name="onairtype"
							defaultValue="tv"
							className="form-control"
						>
							<option value={`anime`}>Anime</option>
							<option value={`photo-album`}>Photo Album</option>
							<option value={`cd-album`}>CD Album</option>
							<option value={`podcast`}>Podcast</option>
							<option value={`tv`}>TV</option>
							<option value={`movie`}>Movie</option>
							<option value={`special`}>Special</option>
							<option value={`ova`}>Ova</option>
							<option value={`internet`}>Internet</option>
						</select>
					</div>
				</div>
			</div>
			<div className="col-lg-3">
				<AdminSidebar
					displayCategoryField={true}
					displayAvatar={true}
					// avatar={files?.selected?._id}
					status="draft"
					fullWidth={false}
					password=""
					featured={true}
					commented={true}
					embedding={false}
					github_readme={""}
					category={undefined}
					categories={categories.data}
					multipleFiles={false}
					onModel={"Playlist"}
					files={files}
					auth={auth}
					token={token}
				/>
				<br />
				<FormButtons />
			</div>
		</form>
	);
};

export default CreatePlaylist;
