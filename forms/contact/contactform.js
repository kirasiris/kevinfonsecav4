"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { fetchurl } from "@/helpers/setTokenOnServer";

const ContactForm = () => {
	const router = useRouter();

	const [btnText, setBtnText] = useState("Submit");

	const createContact = async (e) => {
		e.preventDefault();
		setBtnText(`Processing`);

		const form = e.target;
		const formData = new FormData(form);

		const rawFormData = {
			name: formData.get("name"),
			email: formData.get("email"),
			subject: formData.get("subject"),
			text: formData.get("text"),
			captcha: formData.get("captcha"),
		};

		if (rawFormData.captcha !== "5") {
			toast.error("There was an error, try again");
			setBtnText("Submit");
			return;
		}

		const res = await fetchurl(
			`/global/contactemails`,
			"POST",
			"no-cache",
			rawFormData
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
		setBtnText("Submit");
		toast.success("Email sent", "bottom");
		resetForm();
		router.push(`/contact`);
	};

	const resetForm = (e) => {
		e.target.closest("form").reset();
	};

	return (
		<form onSubmit={createContact}>
			<div className="row">
				<div className="col">
					<label htmlFor="name" className="form-label">
						Name
					</label>
					<input
						id="name"
						name="name"
						type="text"
						className="form-control mb-3"
						required
						placeholder="John Doe"
						defaultValue=""
					/>
				</div>
				<div className="col">
					<label htmlFor="email" className="form-label">
						Email
					</label>
					<input
						id="email"
						name="email"
						type="email"
						className="form-control mb-3"
						required
						placeholder="john@doe.com"
						defaultValue=""
					/>
				</div>
			</div>
			<label htmlFor="subject" className="form-label">
				Subject
			</label>
			<select
				id="subject"
				name="subject"
				className="form-control mb-3"
				required
				defaultValue=""
			>
				<option value="none">Choose an option</option>
				<option value="suggestion">Suggestion</option>
				<option value="bug">Bug</option>
				<option value="review">Review</option>
				<option value="greetings">Greetings</option>
			</select>
			<label htmlFor="text" className="form-label">
				Text
			</label>
			<textarea
				id="text"
				name="text"
				className="form-control mb-3"
				required
				placeholder={`Here goes the message`}
				rows={`3`}
				defaultValue=""
			/>
			<label htmlFor="captcha" className="form-label">
				Captcha: 3+2?
			</label>
			<input
				id="captcha"
				name="captcha"
				type="number"
				className="form-control mb-3"
				required
				placeholder="0"
				defaultValue=""
			/>
			<button type="submit" className="btn btn-secondary btn-sm float-start">
				{btnText}
			</button>
			<button
				type="reset"
				onClick={resetForm}
				className="btn btn-secondary btn-sm float-end"
			>
				Reset
			</button>
		</form>
	);
};

export default ContactForm;
