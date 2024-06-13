import { fetchurl, getAuthTokenOnServer } from "@/helpers/setTokenOnServer";
import { redirect } from "next/navigation";
import AdminSidebar from "@/components/admin/myfinaladminsidebar";
import MyTextArea from "@/components/global/myfinaltextarea";
import FormButtons from "@/components/global/formbuttons";

async function getAuthenticatedUser() {
	const res = await fetchurl(`/auth/me`, "GET", "force-cache");
	return res;
}

async function getCDAlbum(params) {
	const res = await fetchurl(`/playlists${params}`, "GET", "no-cache");
	return res;
}

const UpdateCDAlbum = async ({ params, searchParams }) => {
	const cdalbum = await getCDAlbum(`/${params.id}`);

	const token = await getAuthTokenOnServer();
	const auth = await getAuthenticatedUser();

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
			// files: { avatar: formData.get("file") },
		};
		await fetchurl(`/playlists/${params.id}`, "PUT", "no-cache", {
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
					displayCategoryField={false}
					displayAvatar={false}
					avatar={undefined}
					status={cdalbum?.data?.status}
					fullWidth={false}
					password=""
					featured={cdalbum?.data?.featured.toString()}
					commented={cdalbum?.data?.commented.toString()}
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

export default UpdateCDAlbum;
