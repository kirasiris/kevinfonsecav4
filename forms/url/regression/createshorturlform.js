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
	const [draft, setDraft] = useState({ html: null, users: [], hashtags: [] });

	const addShortUrl = async (e) => {
		e.preventDefault();
		setBtnText("...");
		const form = e.target;
		const formData = new FormData(form);

		const rawFormData = {
			title: formData.get("title"),
			longUrl: formData.get("longUrl"),
			text: formData.get("text"),
			// mentions: JSON.parse(formData.get("text_users") || "[]"),
			// hashtags: JSON.parse(formData.get("text_hashtags") || "[]"),
			name: formData.get("name"),
			email: formData.get("email"),
			user: auth ? auth?.userId : undefined,
			website: process.env.NEXT_PUBLIC_WEBSITE_NAME,
		};

		const res = await fetchurl(
			`/global/extras/tools/urls/regression`,
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
		toast.success("Short URL created");
		setBtnText(btnText);
		router.push(currentpage);
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
					value={draft.html ?? undefined}
					onChange={setDraft}
					onModel="ShortUrl"
					advancedTextEditor={false}
					customPlaceholder="Type something..."
					charactersLimit={99999}
					isRequired={true}
				/>
				{/* <p className="form-text mt-1 mb-3">
					{draft.html.replace(/<[^>]*>/g, "").length} characters
					{draft.users.length > 0 &&
						" · mentions: " +
							draft.users.map((u) => "@" + u.username).join(", ")}
					{draft.hashtags.length > 0 &&
						" · tags: " + draft.hashtags.map((t) => "#" + t).join(", ")}
				</p> */}
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
