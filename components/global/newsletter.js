"use client";
import { useEffect, useState } from "react";
import { fetchurl } from "@/helpers/setTokenOnServer";
import { toast } from "react-toastify";

const NewsletterForm = ({
	sectionClassList = `py-5`,
	headingClassList = `my-5`,
}) => {
	const [newsletters, setNewsletters] = useState([]);

	const fetchNewsletters = async (params = "") => {
		const res = await fetchurl(
			`/global/newslettersubscribers${params}`,
			"GET",
			"no-cache"
		);
		setNewsletters(res?.data);
	};

	useEffect(() => {
		fetchNewsletters(``);
	}, []);

	const [emailBtnTxt, setEmailBtnTxt] = useState("Subscribe Now");

	const subscribeToNewsletter = async (e) => {
		e.preventDefault();
		setEmailBtnTxt("...");

		const form = e.target;
		const formData = new FormData(form);

		const rawFormData = {
			name: formData.get("name"),
			email: formData.get("email"),
			captcha: formData.get("captcha"),
		};

		if (rawFormData.captcha !== "5") {
			toast.error("There was an error, try again");
			setBtnText("Submit");
			return;
		}

		const res = await fetchurl(
			`/global/newslettersubscribers`,
			"POST",
			"no-cache",
			{
				...rawFormData,
				website: process.env.NEXT_PUBLIC_NO_REPLY_EMAIL, // Needed for DB mass email functionality
			}
		);

		if (res.status === "error") {
			toast.error(res.message, "bottom");
			setEmailBtnTxt("Submit");
			return;
		}

		if (res.status === "fail") {
			toast.error(res.message, "bottom");
			setEmailBtnTxt("Submit");
			return;
		}

		await fetchNewsletters(``);
		setEmailBtnTxt(emailBtnTxt);
		resetForm();
	};

	const resetForm = () => {
		e.target.closest("form").reset();
	};

	return (
		<section id="newsletter" className={sectionClassList}>
			<div className="container">
				<h2
					className={`${headingClassList} page-section-heading display-5 text-uppercase`}
				>
					Newsletter
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
							defaultValue=""
							type="text"
							className="form-control rounded-0"
							required
							placeholder="Enter your name"
						/>
						<input
							id="email"
							name="email"
							defaultValue=""
							type="email"
							className="form-control rounded-0"
							required
							placeholder="Enter your email"
						/>
						<input
							id="captcha"
							name="captcha"
							defaultValue=""
							type="number"
							className="form-control rounded-0"
							required
							placeholder="3+2 = ?"
						/>
						<span className="input-group-btn">
							<button className="btn btn-secondary rounded-0" type="submit">
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
