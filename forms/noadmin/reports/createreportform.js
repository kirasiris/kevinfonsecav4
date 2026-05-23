"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { fetchurl } from "@/helpers/setTokenOnServer";
import MyTextArea from "@/components/global/myfinaltextarea";
import FormButtons from "@/components/global/formbuttons";

const CreateReportForm = ({ token = {}, auth = {}, searchParams = {} }) => {
	const router = useRouter();

	const [btnText, setBtnText] = useState(`Submit`);

	const addReport = async (e) => {
		e.preventDefault();
		setBtnText("...");
		const form = e.target;
		const formData = new FormData(form);
		const rawFormData = {
			title: formData.get("title"),
			text: formData.get("text"),
			website: formData.get("website"),
			resourceId: searchParams.resourceId,
			onModel: searchParams.onModel,
		};

		const res = await fetchurl(
			`/noadmin/reports`,
			"POST",
			"no-cache",
			rawFormData,
			undefined,
			false,
			false,
		);

		if (res.status === "error") {
			toast.error(res.message);
			setBtnText("Submit");
			return;
		}
		if (res.status === "fail") {
			toast.error(res.message);
			setBtnText("Submit");
			return;
		}
		setBtnText(btnText);
		router.push(`/noadmin/reports`);
	};

	return (
		<form className="row" onSubmit={addReport}>
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
					required
					placeholder="Untitled"
				/>
				<label htmlFor="text" className="form-label">
					Text
				</label>
				<MyTextArea
					auth={auth}
					token={token}
					id="text"
					name="text"
					defaultValue=""
					onModel="Report"
					advancedTextEditor={false}
					customPlaceholder="Type something..."
					charactersLimit={99999}
					isRequired={true}
				/>
				<label htmlFor="website" className="form-label">
					Website
				</label>
				<input
					id="website"
					name="website"
					defaultValue=""
					type="website"
					className="form-control mb-3"
					placeholder="https://demo.com/"
				/>
				<br />
				<FormButtons />
			</div>
		</form>
	);
};

export default CreateReportForm;
