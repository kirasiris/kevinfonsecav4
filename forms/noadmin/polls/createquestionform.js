"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { fetchurl } from "@/helpers/setTokenOnServer";
import AdminSidebar from "@/components/noadmin/myfinaladminsidebar";
import MyTextArea from "@/components/global/myfinaltextarea";
import FormButtons from "@/components/global/formbuttons";

const CreateQuestionForm = ({
	token = {},
	auth = {},
	params = {},
	searchParams = {},
}) => {
	const router = useRouter();

	const [, setBtnText] = useState(`Submit`);

	const addQuestion = async (e) => {
		e.preventDefault();
		setBtnText("...");
		const form = e.target;
		const formData = new FormData(form);

		const answers = formData.getAll("answers");
		let options = {};

		answers.forEach((text, index) => {
			if (text.trim()) {
				const key = String.fromCharCode(65 + index); // Generate keys: 'A', 'B', 'C', etc.
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

		const res = await fetchurl(`/noadmin/questions`, "POST", "no-cache", {
			...rawFormData,
			resourceId: params.id,
			onModel: "Poll",
		});

		if (res.status === "error") {
			toast.error(res.message, "bottom");
			setBtnText("Submit");
			return;
		}
		if (res.status === "fail") {
			toast.error(res.message, "bottom");
			setBtnText("Submit");
			return;
		}
		toast.success(`Poll question created`, "bottom");
		router.push(`/noadmin/polls/read/${params.id}`);
	};

	const resetForm = (e) => {
		e.target.closest("form").reset();
	};

	return (
		<form className="row" onSubmit={addQuestion}>
			<div className="col">
				<label htmlFor="title" className="form-label">
					Title
				</label>
				<input
					id="title"
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
					defaultValue="No description..."
					onModel="Question"
					advancedTextEditor={false}
					customPlaceholder="No description"
					charactersLimit={99999}
					isRequired={true}
				/>
				<div className="row">
					<div className="col">
						<label htmlFor="answersA" className="form-label">
							Answer A
						</label>
						<input
							id="answersA"
							name="answers"
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
							name="answers"
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
							name="answers"
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
							name="answers"
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
					displayAvatar={false}
					avatar={undefined}
					avatarFormat={"any"}
					status="draft"
					fullWidth={false}
					password=""
					featured={false}
					commented={false}
					embedding={false}
					github_readme={""}
					category={undefined}
					categories={[]}
					multiple_categories={false}
				/>
				<br />
				<FormButtons />
			</div>
		</form>
	);
};

export default CreateQuestionForm;
