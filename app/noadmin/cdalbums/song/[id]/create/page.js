import {
	fetchurl,
	getAuthTokenOnServer,
	getUserOnServer,
} from "@/helpers/setTokenOnServer";
import { redirect } from "next/navigation";
import AdminSidebar from "@/components/admin/myfinaladminsidebar";
import MyTextArea from "@/components/global/myfinaltextarea";
import FormButtons from "@/components/global/formbuttons";

async function getFiles(params) {
	const res = await fetchurl(`/files${params}`, "GET", "no-cache");
	return res;
}

const CreateSong = async ({ params, searchParams }) => {
	const awtdParams = await params;
	const awtdSearchParams = await searchParams;
	const token = await getAuthTokenOnServer();
	const auth = await getUserOnServer();

	const files = await getFiles(`?page=1&limit=100&sort=-createdAt`);

	const addSong = async (formData) => {
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
		await fetchurl(`/songs`, "POST", "no-cache", {
			...rawFormData,
			resourceId: awtdParams.id,
			onModel: "Playlist",
		});
		redirect(`/noadmin/cdalbums/read/${awtdParams.id}`);
	};

	return (
		<form className="row" action={addSong}>
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
					onModel="Song"
					advancedTextEditor={true}
					customPlaceholder="No description"
					defaultValue="No description..."
				/>
				<div className="row">
					<div className="col">
						<label htmlFor="duration" className="form-label">
							Duration
						</label>
						<input
							id="duration"
							name="duration"
							defaultValue={0}
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
					// avatar={files?.selected?._id}
					avatarFormat={"audio"}
					status="draft"
					fullWidth={false}
					password=""
					featured={true}
					commented={true}
					embedding={true}
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

export default CreateSong;
