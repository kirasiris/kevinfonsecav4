import {
	fetchurl,
	getAuthTokenOnServer,
	getUserOnServer,
} from "@/helpers/setTokenOnServer";
import { notFound, redirect } from "next/navigation";
import AdminSidebar from "@/components/admin/myfinaladminsidebar";
import MyTextArea from "@/components/global/myfinaltextarea";
import FormButtons from "@/components/global/formbuttons";

async function getQuestion(params) {
	const res = await fetchurl(`/questions${params}`, "GET", "no-cache");
	if (!res.success) notFound();
	return res;
}

const UpdateQuestion = async ({ params, searchParams }) => {
	const awtdParams = await params;
	const awtdSearchParams = await searchParams;
	const token = await getAuthTokenOnServer();
	const auth = await getUserOnServer();

	const question = await getQuestion(`/${awtdParams.id}`);

	const upgradeQuestion = async (formData) => {
		"use server";
		// Handle answers
		const answers = formData.getAll("answers");
		let options = {};

		answers.forEach((text, index) => {
			if (text.trim()) {
				const key = String.fromCharCode(65 + index); // Generate keys 'A', 'B', 'C', etc.
				options[key] = {
					text,
					votes: 0, // Initialize with 0 votes
					voters: [], // Initialize with no voters
				};
			}
		});

		const rawFormData = {
			title: formData.get("title"),
			text: formData.get("text"),
			password: formData.get("password"),
			status: formData.get("status"),
			answers: options,
		};

		await fetchurl(
			`/questions/${awtdParams.id}`,
			"PUT",
			"no-cache",
			rawFormData
		);
		redirect(`/noadmin/polls/read/${question?.data?.resourceId}`);
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
					advancedTextEditor={false}
					customPlaceholder="No description"
					defaultValue={question?.data?.text}
				/>
				<div className="row">
					<div className="col">
						<label htmlFor="answersA" className="form-label">
							Answer A
						</label>
						<input
							id="answersA"
							name="answers"
							defaultValue={question?.data?.answers?.A?.text}
							type="text"
							className="form-control mb-3"
							placeholder=""
						/>
						<label htmlFor="answersB" className="form-label">
							Answer B
						</label>
						<input
							id="answersB"
							name="answers"
							defaultValue={question?.data?.answers?.B?.text}
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
							name="answers"
							defaultValue={question?.data?.answers?.C?.text}
							type="text"
							className="form-control mb-3"
							placeholder=""
						/>
						<label htmlFor="answersD" className="form-label">
							Answer D
						</label>
						<input
							id="answersD"
							name="answers"
							defaultValue={question?.data?.answers?.D?.text}
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