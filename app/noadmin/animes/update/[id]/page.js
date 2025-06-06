import { notFound, redirect } from "next/navigation";
import {
	fetchurl,
	getAuthTokenOnServer,
	getUserOnServer,
} from "@/helpers/setTokenOnServer";
import AdminSidebar from "@/components/admin/myfinaladminsidebar";
import MyTextArea from "@/components/global/myfinaltextarea";
import FormButtons from "@/components/global/formbuttons";

async function getCategories(params) {
	const res = await fetchurl(`/global/categories${params}`, "GET", "no-cache");
	return res;
}

async function getAnime(params) {
	const res = await fetchurl(`/global/playlists${params}`, "GET", "no-cache");
	if (!res.success) notFound();
	return res;
}

const UpdateAnime = async ({ params, searchParams }) => {
	const awtdParams = await params;
	const awtdSearchParams = await searchParams;
	const token = await getAuthTokenOnServer();
	const auth = await getUserOnServer();

	const anime = await getAnime(`/${awtdParams.id}`);
	const categories = await getCategories(`?categoryType=anime`);

	const upgradeAnime = async (formData) => {
		"use server";
		const rawFormData = {
			title: formData.get("title"),
			text: formData.get("text"),
			featured: formData.get("featured"),
			category: formData.getAll("category"),
			commented: formData.get("commented"),
			password: formData.get("password"),
			onairstatus: formData.get("onairstatus"),
			status: formData.get("status"),
			files: { avatar: formData.get("file") },
		};
		await fetchurl(`/noadmin/playlists/${awtdParams.id}`, "PUT", "no-cache", {
			...rawFormData,
			onairtype: "anime",
			playlistType: "video",
		});
		redirect(`/noadmin/animes`);
	};

	return (
		<form className="row" action={upgradeAnime}>
			<div className="col">
				<label htmlFor="blog-title" className="form-label">
					Title
				</label>
				<input
					id="blog-title"
					name="title"
					defaultValue={anime?.data?.title}
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
					defaultValue={anime?.data?.text}
				/>
				<div className="row">
					<div className="col">
						<label htmlFor="onairstatus" className="form-label">
							On Air Status
						</label>
						<select
							id="onairstatus"
							name="onairstatus"
							defaultValue={anime?.data?.onairstatus}
							className="form-control"
						>
							<option value={`onair`}>On Air</option>
							<option value={`finished`}>Finished</option>
							<option value={`soon`}>Soon</option>
						</select>
					</div>
				</div>
			</div>
			<div className="col-lg-3">
				{console.log(anime?.data)}
				<AdminSidebar
					displayCategoryField={true}
					displayAvatar={true}
					avatar={anime?.data?.files?.avatar?.location?.secure_location}
					avatarFormat={anime?.data?.avatar?.format_type}
					status={anime?.data?.status}
					fullWidth={false}
					password=""
					featured={anime?.data?.featured.toString()}
					commented={anime?.data?.commented.toString()}
					embedding={false}
					github_readme={""}
					category={anime?.data?.category[0]._id || undefined}
					categories={categories?.data}
					multiple_categories={false}
				/>
				<br />
				<FormButtons />
			</div>
		</form>
	);
};

export default UpdateAnime;
