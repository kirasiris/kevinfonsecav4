"use client";
import { fetchurl } from "@/helpers/setTokenOnServer";
import { useState } from "react";
// import Header from "@/layout/header";

const ContactIndex = () => {
	const [alert, setAlert] = useState(false);
	const [emailSent, setEmailSent] = useState({});
	const [contactData, setContactData] = useState({
		name: ``,
		email: ``,
		subject: `greetings`,
		text: ``,
	});

	const { name, email, subject, text } = contactData;

	const createContact = async (e) => {
		e.preventDefault();
		const res = await fetchurl(`/emails`, "POST", "no-cache", contactData);
		const data = await res.json();
		setAlert(true);
		setEmailSent(data.data);
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
			{/* <Header
				title="Kevin Uriel"
				description="Programmer, Geek, Gamer and now Soldier"
			/> */}
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
							Submit
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
				{alert && (
					<>
						<br />
						<div className="alert alert-success">Email sent</div>
						<pre>{JSON.stringify({ emailSent }, null, 4)}</pre>
					</>
				)}
			</div>
		</>
	);
};

export default ContactIndex;
