import {
	fetchurl,
	getAuthTokenOnServer,
	getUserOnServer,
} from "@/helpers/setTokenOnServer";
import { notFound, redirect } from "next/navigation";
import AdminSidebar from "@/components/admin/myfinaladminsidebar";
import MyTextArea from "@/components/global/myfinaltextarea";
import FormButtons from "@/components/global/formbuttons";

async function getFiles(params) {
	const res = await fetchurl(`/files${params}`, "GET", "no-cache");
	return res;
}

async function getLesson(params) {
	const res = await fetchurl(`/videos${params}`, "GET", "no-cache");
	if (!res.success) notFound();
	return res;
}

const UpdateLesson = async ({ params, searchParams }) => {
	const token = await getAuthTokenOnServer();
	const auth = await getUserOnServer();

	const lesson = await getLesson(`/${params.id}`);

	const getFilesData = getFiles(`?page=1&limit=100&sort=-createdAt`);

	const [files] = await Promise.all([getFilesData]);

	const upgradeLesson = async (formData) => {
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
			orderingNumber: formData.get("orderingNumber"),
			files: { video_url: formData.get("file") },
			address: "4442 Jackson Blvd, Columbia, SC 29209",
		};
		await fetchurl(`/videos/${params.id}`, "PUT", "no-cache", rawFormData);
		redirect(`/noadmin/courses/read/${lesson?.data?.resourceId}`);
	};

	return (
		<form className="row" action={upgradeLesson}>
			<div className="col">
				<label htmlFor="blog-title" className="form-label">
					Title
				</label>
				<input
					id="blog-title"
					name="title"
					defaultValue={lesson?.data?.title}
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
					defaultValue={lesson?.data?.text}
				/>
				<div className="row">
					<div className="col">
						<label htmlFor="free_preview" className="form-label">
							Free Preview
						</label>
						<select
							id="free_preview"
							name="free_preview"
							defaultValue={lesson?.data?.free_preview.toString()}
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
							defaultValue={lesson?.data?.duration}
							type="text"
							className="form-control mb-3"
							placeholder=""
						/>
					</div>
					<div className="col">
						<label htmlFor="orderingNumber" className="form-label">
							Order
						</label>
						<input
							id="orderingNumber"
							name="orderingNumber"
							defaultValue={lesson?.data?.orderingNumber}
							type="text"
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
					avatar={lesson?.data?.files?.video_url}
					avatarFormat={"video"}
					status={lesson?.data?.status}
					fullWidth={false}
					password={lesson?.data?.password}
					featured={lesson?.data?.featured.toString()}
					commented={lesson?.data?.commented.toString()}
					embedding={lesson?.data?.embedding.toString()}
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

export default UpdateLesson;