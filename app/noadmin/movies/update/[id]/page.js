import {
	fetchurl,
	getAuthTokenOnServer,
	getUserEmailOnServer,
	getUserIdOnServer,
	getUserUsernameOnServer,
} from "@/helpers/setTokenOnServer";
import { redirect } from "next/navigation";
import AdminSidebar from "@/components/admin/myfinaladminsidebar";
import MyTextArea from "@/components/global/myfinaltextarea";
import FormButtons from "@/components/global/formbuttons";

async function getFiles(params) {
	const res = await fetchurl(`/files${params}`, "GET", "no-cache");
	return res;
}

async function getCategories(params) {
	const res = await fetchurl(`/categories${params}`, "GET", "no-cache");
	return res;
}

async function getMovie(params) {
	const res = await fetchurl(`/playlists${params}`, "GET", "no-cache");
	return res;
}

const UpdateMovie = async ({ params, searchParams }) => {
	const movie = await getMovie(`/${params.id}`);

	const token = await getAuthTokenOnServer();
	const userId = await getUserIdOnServer();
	const username = await getUserUsernameOnServer();
	const email = await getUserEmailOnServer();

	const auth = {
		id: userId?.value,
		username: username?.value,
		email: email?.value,
	};

	const files = await getFiles(`?page=1&limit=100&sort=-createdAt`);
	const categories = await getCategories(`?categoryType=movie`);

	const upgradeMovie = async (formData) => {
		"use server";
		const rawFormData = {
			title: formData.get("title"),
			text: formData.get("text"),
			featured: formData.get("featured"),
			category: formData.get("category"),
			commented: formData.get("commented"),
			password: formData.get("password"),
			onairstatus: formData.get("onairstatus"),
			status: formData.get("status"),
			files: { avatar: formData.get("file") },
		};
		await fetchurl(`/playlists/${params.id}`, "PUT", "no-cache", {
			...rawFormData,
			onairtype: "movie",
			playlistType: "video",
		});
		redirect(`/noadmin/movies`);
	};

	return (
		<form className="row" action={upgradeMovie}>
			<div className="col">
				<label htmlFor="blog-title" className="form-label">
					Title
				</label>
				<input
					id="blog-title"
					name="title"
					defaultValue={movie?.data?.title}
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
					defaultValue={movie?.data?.text}
				/>
				<div className="row">
					<div className="col">
						<label htmlFor="onairstatus" className="form-label">
							On Air Status
						</label>
						<select
							id="onairstatus"
							name="onairstatus"
							defaultValue={movie?.data?.onairstatus}
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
				<AdminSidebar
					displayCategoryField={true}
					displayAvatar={true}
					avatar={movie?.data?.files?.avatar}
					status={movie?.data?.status}
					fullWidth={false}
					password=""
					featured={movie?.data?.featured.toString()}
					commented={movie?.data?.commented.toString()}
					embedding={false}
					github_readme={""}
					category={movie?.data?.category?._id || movie?.data?.category}
					categories={categories?.data}
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

export default UpdateMovie;
