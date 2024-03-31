"use client";
import { useState } from "react";
import { toast } from "react-toastify";
import { fetchurl } from "@/helpers/setTokenOnServer";
import Header from "@/layout/header";

const ContactIndex = () => {
	const [contactData, setContactData] = useState({
		name: ``,
		email: ``,
		subject: `greetings`,
		text: ``,
	});

	const { name, email, subject, text } = contactData;

	const [error, setError] = useState(false);
	const [btnText, setBtnText] = useState(`Submit`);

	const createContact = async (e) => {
		e.preventDefault();
		try {
			setBtnText("...");
			await fetchurl(`/emails`, "POST", "no-cache", contactData);
			setBtnText(btnText);
			resetForm();
		} catch (err) {
			console.log(err);
			setError(true);
			// const error = err.response.data.message;
			const error = err?.response?.data?.error?.errors;
			const errors = err?.response?.data?.errors;

			if (error) {
				// dispatch(setAlert(error, 'danger'));
				error &&
					Object.entries(error).map(([, value]) => toast.error(value.message));
			}

			if (errors) {
				errors.forEach((error) => toast.error(error.msg));
			}

			toast.error(err?.response?.statusText);
			return {
				msg: err?.response?.statusText,
				status: err?.response?.status,
			};
		}
	};

	const resetForm = () => {
		setContactData({
			name: ``,
			email: ``,
			subject: `greetings`,
			text: ``,
		});
	};
	return (
		<>
			<Header
				title="Contact Page"
				description="Do not hesitate to contact me!"
			/>
			<div className="container">
				<div className="row">
					<form onSubmit={createContact}>
						<div className="col">
							<label htmlFor="name" className="form-label">
								Name
							</label>
							<input
								id="name"
								name="name"
								value={name}
								onChange={(e) => {
									setContactData({
										...contactData,
										name: e.target.value,
									});
								}}
								type="text"
								className="form-control mb-3"
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
									setContactData({
										...contactData,
										email: e.target.value,
									});
								}}
								type="email"
								className="form-control mb-3"
								placeholder="john@doe.com"
							/>
						</div>
						<label htmlFor="subject" className="form-label">
							Subject
						</label>
						<select
							id="subject"
							name="subject"
							value={subject}
							onChange={(e) => {
								setContactData({
									...contactData,
									subject: e.target.value,
								});
							}}
							className="form-control"
						>
							<option value={`suggestion`}>Suggestion</option>
							<option value={`bug`}>Bug</option>
							<option value={`review`}>Review</option>
							<option value={`greetings`}>Greetings</option>
						</select>
						<label htmlFor="text" className="form-label">
							Text
						</label>
						<textarea
							id="text"
							name="text"
							value={text}
							onChange={(e) => {
								setContactData({
									...contactData,
									text: e.target.value,
								});
							}}
							className="form-control"
							placeholder={`Here goes the message`}
							rows={`3`}
						/>
						<br />
						<button
							type="submit"
							className="btn btn-secondary btn-sm float-start"
							disabled={email.length > 0 && text.length > 0 ? !true : !false}
						>
							{btnText}
						</button>
						<button
							type="button"
							className="btn btn-secondary btn-sm float-end"
							onClick={resetForm}
						>
							Reset
						</button>
					</form>
				</div>
			</div>
		</>
	);
};

export default ContactIndex;
