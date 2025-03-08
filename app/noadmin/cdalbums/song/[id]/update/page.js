import {
	fetchurl,
	getAuthTokenOnServer,
	getUserOnServer,
} from "@/helpers/setTokenOnServer";
import { notFound, redirect } from "next/navigation";
import AdminSidebar from "@/components/admin/myfinaladminsidebar";
import MyTextArea from "@/components/global/myfinaltextarea";
import FormButtons from "@/components/global/formbuttons";

async function getSong(params) {
	const res = await fetchurl(`/songs${params}`, "GET", "no-cache");
	if (!res.success) notFound();
	return res;
}

async function getFiles(params) {
	const res = await fetchurl(`/files${params}`, "GET", "no-cache");
	return res;
}

const UpdateSong = async ({ params, searchParams }) => {
	const awtdParams = await params;
	const awtdSearchParams = await searchParams;
	const token = await getAuthTokenOnServer();
	const auth = await getUserOnServer();

	const song = await getSong(`/${awtdParams.id}`);

	const files = await getFiles(`?page=1&limit=100&sort=-createdAt`);

	const upgradeSong = async (formData) => {
		"use server";
		const rawFormData = {
			title: formData.get("title"),
			sub_title: formData.get("sub_title"),
			text: formData.get("text"),
			featured: formData.get("featured"),
			commented: formData.get("commented"),
			embedding: formData.get("embedding"),
			category: formData.get("category"),
			password: formData.get("password"),
			status: formData.get("status"),
			duration: formData.get("duration"),
			averageRating: formData.get("averageRating"),
			orderingNumber: formData.get("orderingNumber"),
			files: { avatar: formData.get("file") },
		};
		await fetchurl(`/songs/${awtdParams.id}`, "PUT", "no-cache", rawFormData);
		redirect(`/noadmin/cdalbums/read/${song?.data?.resourceId}`);
	};

	return (
		<form className="row" action={upgradeSong}>
			<div className="col">
				<label htmlFor="blog-title" className="form-label">
					Title
				</label>
				<input
					id="blog-title"
					name="title"
					defaultValue={song?.data?.title}
					type="text"
					className="form-control mb-3"
					placeholder=""
				/>
				<label htmlFor="sub_title" className="form-label">
					Sub title
				</label>
				<input
					id="sub_title"
					name="sub_title"
					defaultValue={song?.data?.sub_title}
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
					onModel="Song"
					advancedTextEditor={true}
					customPlaceholder="No description"
					defaultValue={song?.data?.text}
				/>
				<div className="row">
					<div className="col">
						<label htmlFor="duration" className="form-label">
							Duration
						</label>
						<input
							id="duration"
							name="duration"
							defaultValue={song?.data?.duration}
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
							defaultValue={song?.data?.averageRating}
							className="form-control"
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
							defaultValue={song?.data?.orderingNumber}
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
					avatar={song?.data?.files?.avatar}
					avatarFormat={"audio"}
					status={song?.data?.status}
					fullWidth={false}
					password={song?.data?.password}
					featured={song?.data?.featured.toString()}
					commented={song?.data?.commented.toString()}
					embedding={song?.data?.commented.toString()}
					github_readme={""}
					category={undefined}
					categories={[]}
					multiple_categories={false}
					multipleFiles={false}
					onModel={"Song"}
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

export default UpdateSong;
