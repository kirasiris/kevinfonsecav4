import { notFound, redirect } from "next/navigation";
import {
	fetchurl,
	getAuthTokenOnServer,
	getUserOnServer,
} from "@/helpers/setTokenOnServer";
import AdminSidebar from "@/components/noadmin/myfinaladminsidebar";
import MyTextArea from "@/components/global/myfinaltextarea";
import FormButtons from "@/components/global/formbuttons";

async function getCategories(params) {
	const res = await fetchurl(`/global/categories${params}`, "GET", "no-cache");
	return res;
}

async function getQuiz(params) {
	const res = await fetchurl(`/global/quizzes${params}`, "GET", "no-cache");
	if (!res.success) notFound();
	return res;
}

const UpdateQuiz = async ({ params, searchParams }) => {
	const awtdParams = await params;
	const awtdSearchParams = await searchParams;
	const token = await getAuthTokenOnServer();
	const auth = await getUserOnServer();

	const quiz = await getQuiz(`/${awtdParams.id}`);

	const categories = await getCategories(`?categoryType=quiz`);

	const upgradeQuiz = async (formData) => {
		"use server";
		const rawFormData = {
			title: formData.get("title"),
			avatar: formData.get("text"),
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
		await fetchurl(
			`/noadmin/quizzes/${awtdParams.id}`,
			"PUT",
			"no-cache",
			rawFormData
		);
		redirect(`/noadmin/quizzes`);
	};

	return (
		<form className="row" action={upgradeQuiz}>
			<div className="col">
				<label htmlFor="blog-title" className="form-label">
					Title
				</label>
				<input
					id="blog-title"
					name="title"
					defaultValue={quiz?.data?.title}
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
					defaultValue={quiz?.data?.text}
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
								defaultValue={quiz?.data?.duration}
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
							defaultValue={quiz?.data?.minimumScore}
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
							defaultValue={quiz?.data?.maximumScore}
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
							defaultValue={quiz?.data?.attempts}
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
							defaultValue={quiz?.data?.singlePage}
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
					avatar={quiz?.data?.files}
					avatarFormat={quiz?.data?.files?.avatar?.format_type}
					status={quiz?.data?.status}
					fullWidth={false}
					password=""
					featured={false}
					commented={quiz?.data?.commented.toString()}
					embedding={quiz?.data?.embedding.toString()}
					github_readme={""}
					category={quiz?.data?.category?._id || quiz?.data?.category}
					categories={categories.data}
					multiple_categories={false}
				/>
				<br />
				<FormButtons />
			</div>
		</form>
	);
};

export default UpdateQuiz;
