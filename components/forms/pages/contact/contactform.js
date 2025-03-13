"use client";

import { fetchurl } from "@/helpers/setTokenOnServer";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "react-toastify";

const ContactForm = () => {
	const router = useRouter();

	const [rawFormData, setRawFormData] = useState({
		name: ``,
		email: ``,
		subject: `none`,
		text: ``,
	});

	const [btnText, setBtnText] = useState("Submit");
	const { name, email, subject, text } = rawFormData;

	const createContact = async (e) => {
		e.preventDefault();
		setBtnText(`Processing`);
		const res = await fetchurl(`/emails`, "POST", "no-cache", {
			...rawFormData,
			registeredFrom: process.env.NEXT_PUBLIC_WEBSITE_NAME,
			registeredAt: process.env.NEXT_PUBLIC_WEBSITE_URL,
		});
		if (res.status === "error") {
			toast.error(res.message, "bottom");
			setBtnText("Submit");
			return;
		}
		setBtnText("Submit");
		toast.success("Email sent", "bottom");
		resetForm();
		router.push(`/contact`);
	};

	const resetForm = () => {
		setRawFormData({
			name: ``,
			email: ``,
			subject: `none`,
			text: ``,
		});
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
						value={name}
						onChange={(e) => {
							setRawFormData({
								...rawFormData,
								name: e.target.value,
							});
						}}
						type="text"
						className="form-control mb-3"
						required
						placeholder="John Doe"
					/>
				</div>
				<div className="col">
					<label htmlFor="email" className="form-label">
						Email
					</label>
					<input
						id="email"
						name="email"
						value={email}
						onChange={(e) => {
							setRawFormData({
								...rawFormData,
								email: e.target.value,
							});
						}}
						type="email"
						className="form-control mb-3"
						required
						placeholder="john@doe.com"
					/>
				</div>
			</div>
			<label htmlFor="subject" className="form-label">
				Subject
			</label>
			<select
				id="subject"
				name="subject"
				value={subject}
				onChange={(e) => {
					setRawFormData({
						...rawFormData,
						subject: e.target.value,
					});
				}}
				className="form-control mb-3"
				required
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
				value={text}
				onChange={(e) => {
					setRawFormData({
						...rawFormData,
						text: e.target.value,
					});
				}}
				className="form-control mb-3"
				required
				placeholder={`Here goes the message`}
				rows={`3`}
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
