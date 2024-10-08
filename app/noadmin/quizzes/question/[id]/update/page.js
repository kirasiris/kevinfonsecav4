import {
	fetchurl,
	getAuthTokenOnServer,
	getUserOnServer,
} from "@/helpers/setTokenOnServer";
import { notFound, redirect } from "next/navigation";
import AdminSidebar from "@/components/admin/myfinaladminsidebar";
import MyTextArea from "@/components/global/myfinaltextarea";
import FormButtons from "@/components/global/formbuttons";

// async function getFiles(params) {
// 	const res = await fetchurl(`/files${params}`, "GET", "no-cache");
// 	return res;
// }

async function getQuestion(params) {
	const res = await fetchurl(`/questions${params}`, "GET", "no-cache");
	if (!res.success) notFound();
	return res;
}

const UpdateQuestion = async ({ params, searchParams }) => {
	const token = await getAuthTokenOnServer();
	const auth = await getUserOnServer();

	const question = await getQuestion(`/${params.id}`);

	// const files = await getFiles(`?page=1&limit=100&sort=-createdAt`);

	const upgradeQuestion = async (formData) => {
		"use server";
		const rawFormData = {
			title: formData.get("title"),
			text: formData.get("text"),
			password: formData.get("password"),
			status: formData.get("status"),
			correctAnswer: formData.get("correctAnswer"),
			answers: {
				A: formData.get("answersA"),
				B: formData.get("answersB"),
				C: formData.get("answersC"),
				D: formData.get("answersD"),
			},
			// files: { avatar: formData.get("file") },
		};

		await fetchurl(`/questions/${params.id}`, "PUT", "no-cache", rawFormData);
		redirect(`/noadmin/quizzes/read/${question?.data?.resourceId}`);
	};

	return (
		<form className="row" action={upgradeQuestion}>
			<div className="col">
				<label htmlFor="blog-title" className="form-label">
					Title
				</label>
				<input
					id="blog-title"
					name="title"
					defaultValue={question?.data?.title}
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
					onModel="Question"
					advancedTextEditor={true}
					customPlaceholder="No description"
					defaultValue={question?.data?.text}
				/>
				<label htmlFor="correctAnswer" className="form-label">
					Correct Answer
				</label>
				<input
					id="correctAnswer"
					name="correctAnswer"
					defaultValue={question?.data?.correctAnswer}
					type="text"
					className="form-control mb-3"
					placeholder=""
				/>
				<div className="row">
					<div className="col">
						<label htmlFor="answersA" className="form-label">
							Answer A
						</label>
						<input
							id="answersA"
							name="answersA"
							defaultValue={question?.data?.answers?.A}
							type="text"
							className="form-control mb-3"
							placeholder=""
						/>
						<label htmlFor="answersB" className="form-label">
							Answer B
						</label>
						<input
							id="answersB"
							name="answersB"
							defaultValue={question?.data?.answers?.B}
							type="text"
							className="form-control mb-3"
							placeholder=""
						/>
					</div>
					<div className="col">
						<label htmlFor="answersC" className="form-label">
							Answer C
						</label>
						<input
							id="answersC"
							name="answersC"
							defaultValue={question?.data?.answers?.C}
							type="text"
							className="form-control mb-3"
							placeholder=""
						/>
						<label htmlFor="answersD" className="form-label">
							Answer D
						</label>
						<input
							id="answersD"
							name="answersD"
							defaultValue={question?.data?.answers?.D}
							type="text"
							className="form-control mb-3"
							placeholder=""
						/>
					</div>
				</div>
			</div>
			<div className="col-lg-3">
				<AdminSidebar
					displayCategoryField={false}
					displayAvatar={false}
					avatar={undefined}
					avatarFormat={"any"}
					status={question?.data?.status}
					fullWidth={false}
					password=""
					featured={false}
					commented={false}
					embedding={false}
					github_readme={""}
					category={undefined}
					categories={[]}
					multipleFiles={false}
					onModel={"Question"}
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

export default UpdateQuestion;
