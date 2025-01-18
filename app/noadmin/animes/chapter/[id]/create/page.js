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

const CreateChapter = async ({ params, searchParams }) => {
	const awtdParams = await params;
	const awtdSearchParams = await searchParams;
	const token = await getAuthTokenOnServer();
	const auth = await getUserOnServer();

	const getFilesData = getFiles(`?page=1&limit=100&sort=-createdAt`);

	const [files] = await Promise.all([getFilesData]);

	const addChapter = async (formData) => {
		"use server";
		const rawFormData = {
			title: formData.get("title"),
			text: formData.get("text"),
			featured: formData.get("featured"),
			commented: formData.get("commented"),
			embedding: formData.get("embedding"),
			category: formData.get("category"),
			password: formData.get("password"),
			status: formData.get("status"),
			free_preview: formData.get("free_preview"),
			duration: formData.get("duration"),
			averageRating: formData.get("averageRating"),
			orderingNumber: formData.get("orderingNumber"),
			files: { video_url: formData.get("file") },
		};
		await fetchurl(`/videos`, "POST", "no-cache", {
			...rawFormData,
			resourceId: awtdParams.id,
			onModel: "Playlist",
		});
		redirect(`/noadmin/animes/read/${awtdParams.id}`);
	};

	return (
		<form className="row" action={addChapter}>
			<div className="col">
				<div className="text-center h-100 justify-content-center align-content-center">
					<h1>WORK IN PROGRESS</h1>
					<p>Need a good design</p>
				</div>
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
					token={token}
					id="text"
					name="text"
					onModel="Lesson"
					advancedTextEditor={true}
					customPlaceholder="No description"
					defaultValue="No description..."
				/>
				<div className="row">
					<div className="col">
						<label htmlFor="free_preview" className="form-label">
							Free Preview
						</label>
						<select
							id="free_preview"
							name="free_preview"
							defaultValue={true}
							className="form-control"
						>
							<option value={true}>Yes</option>
							<option value={false}>No</option>
						</select>
					</div>
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
							<option value={6}>6</option>
							<option value={7}>7</option>
							<option value={8}>8</option>
							<option value={9}>9</option>
							<option value={10}>10</option>
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
					avatarFormat={"image"}
					status="draft"
					fullWidth={false}
					password=""
					featured={true}
					commented={true}
					embedding={true}
					github_readme={""}
					category={undefined}
					categories={[]}
					multipleFiles={false}
					onModel={"Lesson"}
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

export default CreateChapter;
