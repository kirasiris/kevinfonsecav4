"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { fetchurl } from "@/helpers/setTokenOnServer";
import MyTextArea from "@/components/global/myfinaltextarea";
import FormButtons from "@/components/global/formbuttons";

const CreateShortUrlForm = ({ auth = {}, currentpage = "" }) => {
	const router = useRouter();

	const [btnText, setBtnText] = useState("Submit");

	const addShortUrl = async (e) => {
		e.preventDefault();
		setBtnText("...");
		const form = e.target;
		const formData = new FormData(form);

		const rawFormData = {
			title: formData.get("title"),
			longUrl: formData.get("longUrl"),
			text: formData.get("text"),
		};

		const res = await fetchurl(
			`/extras/tools/urls/regression${auth ? `?user=${auth?.userId}` : ``}`,
			"POST",
			"no-cache",
			rawFormData,
		);

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
		setBtnText(btnText);
		//resetForm();
		router.push(currentpage);
	};

	const resetForm = (e) => {
		e.target.closest("form").reset();
	};

	return (
		<div className="d-grid gap-2 mb-4">
			<form onSubmit={addShortUrl}>
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
					placeholder=""
				/>
				<label htmlFor="longUrl" className="form-label">
					Long Url
				</label>
				<input
					id="longUrl"
					name="longUrl"
					defaultValue=""
					type="text"
					className="form-control mb-3"
					required
					placeholder=""
				/>
				<label htmlFor="text" className="form-label">
					Text
				</label>
				<MyTextArea
					auth={undefined}
					token={undefined}
					id="text"
					name="text"
					defaultValue=""
					onModel="ShortUrl"
					advancedTextEditor={false}
					customPlaceholder="Type something..."
					charactersLimit={99999}
					isRequired={true}
				/>
				<br />
				<FormButtons />
			</form>
		</div>
	);
};

export default CreateShortUrlForm;
