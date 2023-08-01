"use client";

import { useState } from "react";

const NewsletterForm = ({ newsletters = {} }) => {
	const [newsletterData, setNewsletterData] = useState({
		email: ``,
	});

	const { email } = newsletterData;

	const [emailBtnTxt, setEmailBtnTxt] = useState("Subscribe Now");

	const subscribeToNewsletter = async (e) => {
		e.preventDefault();
		try {
			setEmailBtnTxt("...");
			const res = await fetch(`http://localhost:5000/api/v1/newsletters`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					...newsletterData,
					email: email,
					website: "Personal Website",
				}),
			});
			await res.json();
			setEmailBtnTxt(emailBtnTxt);
			resetForm();
		} catch (err) {
			console.log(err);
		}
	};

	const resetForm = () => {
		setNewsletterData({
			email: "",
		});
	};

	return (
		<form onSubmit={subscribeToNewsletter}>
			<p>Join {newsletters.data?.length} other subscribers!</p>
			<div className="input-group">
				<input
					id="email"
					name="email"
					value={email}
					onChange={(e) => {
						setNewsletterData({
							...newsletterData,
							email: e.target.value,
						});
					}}
					type="email"
					className="form-control rounded-0"
					placeholder="Enter your email"
				/>
				<span className="input-group-btn">
					<button
						className="btn btn-secondary rounded-0"
						type="submit"
						disabled={email.length > 0 ? !true : !false}
					>
						{emailBtnTxt}
					</button>
				</span>
			</div>
		</form>
	);
};

export default NewsletterForm;
