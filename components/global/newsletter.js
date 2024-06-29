"use client";
import { fetchurl } from "@/helpers/setTokenOnServer";
import { useEffect, useState } from "react";

const NewsletterForm = ({ classList = `py-5` }) => {
	const [newsletters, setNewsletters] = useState([]);

	useEffect(() => {
		const fetchNewsletters = async (params = "") => {
			const res = await fetchurl(
				`/newslettersubscribers${params}`,
				"GET",
				"no-cache"
			);
			setNewsletters(res?.data);
		};
		fetchNewsletters(``);
	}, []);

	const [newsletterData, setNewsletterData] = useState({
		email: ``,
	});

	const { email } = newsletterData;

	const [emailBtnTxt, setEmailBtnTxt] = useState("Subscribe Now");

	const subscribeToNewsletter = async (e) => {
		e.preventDefault();
		try {
			setEmailBtnTxt("...");
			await fetchurl(`/newslettersubscribers`, "POST", "no-cache", {
				...newsletterData,
				email: email,
				website: "beFree",
			});
			newsletters.length += 1;
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
		<section id="newsletter" className={classList}>
			<div className="container">
				<h2 className="page-section-heading display-5 text-uppercase my-5">
					Subscribe&nbsp;to&nbsp;our&nbsp;Newsletter
				</h2>
				<p>
					Join&nbsp;other&nbsp;{newsletters?.length || "0"}
					&nbsp;subscribers!
				</p>
				<form onSubmit={subscribeToNewsletter}>
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
				<p className="mt-3">
					Get&nbsp;to&nbsp;know&nbsp;more&nbsp;about&nbsp;my&nbsp;every&nbsp;day&nbsp;routines,&nbsp;what&nbsp;I&apos;m&nbsp;planning
					to&nbsp;build&nbsp;and&nbsp;more!
				</p>
			</div>
		</section>
	);
};

export default NewsletterForm;
