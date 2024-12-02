"use client";
import { useEffect, useState } from "react";
import { fetchurl } from "@/helpers/setTokenOnServer";

const NewsletterForm = ({
	sectionClassList = `py-5`,
	headingClassList = `my-5`,
}) => {
	const [newsletters, setNewsletters] = useState([]);

	const fetchNewsletters = async (params = "") => {
		const res = await fetchurl(
			`/newslettersubscribers${params}`,
			"GET",
			"no-cache"
		);
		setNewsletters(res?.data);
	};

	useEffect(() => {
		fetchNewsletters(``);
	}, []);

	const [newsletterData, setNewsletterData] = useState({
		name: ``,
		email: ``,
	});

	const { name, email } = newsletterData;

	const [emailBtnTxt, setEmailBtnTxt] = useState("Subscribe Now");

	const subscribeToNewsletter = async (e) => {
		e.preventDefault();
		try {
			setEmailBtnTxt("...");
			await fetchurl(`/newslettersubscribers`, "POST", "no-cache", {
				...newsletterData,
				website: "beFree",
			});
			await fetchNewsletters(``);
			setEmailBtnTxt(emailBtnTxt);
			resetForm();
		} catch (err) {
			console.log(err);
		}
	};

	const resetForm = () => {
		setNewsletterData({
			name: "",
			email: "",
		});
	};

	return (
		<section id="newsletter" className={sectionClassList}>
			<div className="container">
				<h2
					className={`${headingClassList} page-section-heading display-5 text-uppercase`}
				>
					Subscribe&nbsp;to&nbsp;our&nbsp;Newsletter
				</h2>
				<p>
					Join&nbsp;other&nbsp;{newsletters?.length || "0"}
					&nbsp;subscribers!
				</p>
				<form onSubmit={subscribeToNewsletter}>
					<div className="input-group">
						<input
							id="name"
							name="name"
							value={name}
							onChange={(e) => {
								setNewsletterData({
									...newsletterData,
									name: e.target.value,
								});
							}}
							type="text"
							className="form-control rounded-0"
							placeholder="Enter your name"
						/>
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
								disabled={name.length > 0 && email.length > 0 ? !true : !false}
							>
								{emailBtnTxt}
							</button>
						</span>
					</div>
				</form>
				<p className="mt-3">
					Get&nbsp;to&nbsp;know&nbsp;more&nbsp;about&nbsp;my&nbsp;every&nbsp;day&nbsp;routines,&nbsp;what&nbsp;I&apos;m&nbsp;planning
					to&nbsp;build&nbsp;and&nbsp;more!
				</p>
			</div>
		</section>
	);
};

export default NewsletterForm;
