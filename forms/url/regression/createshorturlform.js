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
			name: formData.get("name"),
			email: formData.get("email"),
			user: auth ? auth?.userId : undefined,
		};

		const res = await fetchurl(
			`/global/extras/tools/urls/regression`,
			"POST",
			"no-cache",
			rawFormData,
		);

		console.log("response", res);

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
					placeholder="Remove the https:// or http:// , please!"
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
				<h2>User Information</h2>
				<div className="row g-2">
					<div className="col-md">
						<div className="form-floating">
							<input
								id="name"
								name="name"
								defaultValue=""
								type="text"
								className="form-control mb-3"
								required
								placeholder="John Doe"
							/>
							<label htmlFor="name">Name</label>
						</div>
					</div>
					<div className="col-md">
						<div className="form-floating">
							<input
								id="email"
								name="email"
								defaultValue=""
								type="text"
								className="form-control mb-3"
								required
								placeholder="john.doe@demo.com"
							/>
							<label htmlFor="email">Type&nbsp;your&nbsp;email</label>
						</div>
					</div>
				</div>
				<br />
				<FormButtons />
			</form>
		</div>
	);
};

export default CreateShortUrlForm;
