import { fetchurl, getAuthTokenOnServer } from "@/helpers/setTokenOnServer";
import { redirect } from "next/navigation";
import AdminSidebar from "@/components/admin/myfinaladminsidebar";
import MyTextArea from "@/components/global/myfinaltextarea";
import FormButtons from "@/components/global/formbuttons";

async function getAuthenticatedUser() {
	const res = await fetchurl(`/auth/me`, "GET", "force-cache");
	return res;
}

async function getFiles(params) {
	const res = await fetchurl(`/files${params}`, "GET", "no-cache");
	return res;
}

const CreateQuestion = async ({ params, searchParams }) => {
	const token = await getAuthTokenOnServer();
	const auth = await getAuthenticatedUser();
	const files = await getFiles(`?page=1&limit=100&sort=-createdAt`);

	const addQuestion = async (formData) => {
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
			files: { avatar: formData.get("file") },
		};

		await fetchurl(`/questions`, "POST", "no-cache", {
			...rawFormData,
			resourceId: params.id,
			onModel: "Quiz",
		});
		redirect(`/noadmin/quizzes/read/${params.id}`);
	};

	return (
		<form className="row" action={addQuestion}>
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
					id="text"
					name="text"
					onModel="Question"
					advancedTextEditor={true}
					customPlaceholder="No description"
					defaultValue="No description..."
				/>
				<label htmlFor="correctAnswer" className="form-label">
					Correct Answer
				</label>
				<input
					id="correctAnswer"
					name="correctAnswer"
					defaultValue=""
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
							defaultValue=""
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
							defaultValue=""
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
							defaultValue=""
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
							defaultValue=""
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
					displayAvatar={true}
					// avatar={files?.selected?._id}
					status="draft"
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

export default CreateQuestion;
