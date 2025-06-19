import { redirect } from "next/navigation";
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

const CreateQuiz = async ({ params, searchParams }) => {
	const token = await getAuthTokenOnServer();
	const auth = await getUserOnServer();

	const categories = await getCategories(`?categoryType=quiz`);

	const addQuiz = async (formData) => {
		"use server";
		const rawFormData = {
			title: formData.get("title"),
			text: formData.get("text"),
			duration: formData.get("duration"),
			minimumScore: formData.get("minimumScore"),
			maximumScore: formData.get("maximumScore"),
			embedding: formData.get("embedding"),
			category: formData.get("category"),
			commented: formData.get("commented"),
			status: formData.get("status"),
			attempts: formData.get("attempts"),
			singlePage: formData.get("singlePage"),
			files: { avatar: formData.get("file") },
		};
		await fetchurl(`/noadmin/quizzes`, "POST", "no-cache", {
			...rawFormData,
		});
		redirect(`/noadmin/quizzes`);
	};

	return (
		<form className="row" action={addQuiz}>
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
					token={token}
					id="text"
					name="text"
					onModel="Quiz"
					advancedTextEditor={true}
					customPlaceholder="No description"
					defaultValue="No description..."
				/>
				<div className="row">
					<div className="col">
						<div className="col">
							<label htmlFor="duration" className="form-label">
								Duration
							</label>
							<input
								id="duration"
								name="duration"
								defaultValue={1}
								type="number"
								className="form-control mb-3"
								placeholder=""
								min="1"
								max="100"
							/>
						</div>
					</div>
					<div className="col">
						<label htmlFor="minimumScore" className="form-label">
							Minimum Score
						</label>
						<input
							id="minimumScore"
							name="minimumScore"
							defaultValue={3}
							type="number"
							className="form-control mb-3"
							placeholder=""
							min="1"
							max="100"
						/>
					</div>
					<div className="col">
						<label htmlFor="maximumScore" className="form-label">
							Maximum Score
						</label>
						<input
							id="maximumScore"
							name="maximumScore"
							defaultValue={100}
							type="number"
							className="form-control mb-3"
							placeholder=""
							min="1"
							max="100"
						/>
					</div>
				</div>
				<div className="row">
					<div className="col">
						<label htmlFor="attempts" className="form-label">
							Attempts
						</label>
						<input
							id="attempts"
							name="attempts"
							defaultValue={1}
							type="number"
							className="form-control mb-3"
							placeholder=""
							min="1"
						/>
					</div>
					<div className="col">
						<label htmlFor="singlePage" className="form-label">
							Single Page
						</label>
						<select
							id="singlePage"
							name="singlePage"
							defaultValue={false}
							className="form-control"
						>
							<option value={true}>Yes</option>
							<option value={false}>No</option>
						</select>
					</div>
				</div>
			</div>
			<div className="col-lg-3">
				<AdminSidebar
					displayCategoryField={true}
					displayAvatar={true}
					avatar={undefined}
					avatarFormat={"image"}
					status="draft"
					fullWidth={false}
					password=""
					featured={false}
					commented={true}
					embedding={true}
					github_readme={""}
					category={undefined}
					categories={categories.data}
					multiple_categories={false}
				/>
				<br />
				<FormButtons />
			</div>
		</form>
	);
};

export default CreateQuiz;
