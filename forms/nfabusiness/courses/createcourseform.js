"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { fetchurl } from "@/helpers/setTokenOnServer";
import AdminSidebar from "@/components/noadmin/myfinaladminsidebar";
import MyTextArea from "@/components/global/myfinaltextarea";
import FormButtons from "@/components/global/formbuttons";

const CreateCourseForm = ({ token = {}, auth = {} }) => {
	const router = useRouter();

	const [btnText, setBtnText] = useState(`Submit`);

	const addCourse = async (e) => {
		e.preventDefault();
		setBtnText("...");
		const form = e.target;
		const formData = new FormData(form);

		const rawFormData = {
			title: formData.get("title"),
			sub_title: formData.get("sub_title"),
			text: formData.get("text"),
			price: formData.get("price"),
			featured: formData.get("featured"),
			embedding: formData.get("embedding"),
			category: formData.get("category"),
			sub_category: formData.get("sub_category"),
			isFree: formData.get("isFree"),
			language: formData.get("language"),
			difficulty: formData.get("difficulty"),
			commented: formData.get("commented"),
			password: formData.get("password"),
			status: formData.get("status"),
			files: { avatar: formData.get("file") || undefined },
		};

		const res = await fetchurl(`/noadmin/stripe/courses/`, "POST", "no-cache", {
			...rawFormData,
			resourceId: auth?.companyId,
			onModel: "Company",
		});

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
		toast.success(`Course created`, "bottom");
		router.push(`/nfabusiness/courses`);
	};

	const resetForm = (e) => {
		e.target.closest("form").reset();
	};

	return (
		<form className="row" onSubmit={addCourse}>
			<div className="col">
				<label htmlFor="title" className="form-label">
					Title
				</label>
				<input
					id="title"
					name="title"
					defaultValue="Untitled"
					type="text"
					className="form-control mb-3"
					placeholder=""
				/>
				<label htmlFor="sub_title" className="form-label">
					Sub title
				</label>
				<input
					id="sub_title"
					name="sub_title"
					defaultValue=""
					type="text"
					className="form-control mb-3"
					placeholder=""
				/>
				<label htmlFor="text" className="form-label">
					Text
				</label>
				<MyTextArea
					auth={auth}
					token={token}
					id="text"
					name="text"
					defaultValue="No description..."
					onModel="Course"
					advancedTextEditor={true}
					customPlaceholder="No description"
				/>
				<div className="row">
					<div className="col">
						<label htmlFor="category" className="form-label">
							Category
						</label>
						<select
							id="category"
							name="category"
							defaultValue="development"
							className="form-control mb-3"
						>
							<option value={"development"}>Development</option>
							<option value={"business"}>Business</option>
							<option value={"finance-and-accounting"}>
								Finance and Accounting
							</option>
							<option value={"it-and-software"}>IT and Software</option>
							<option value={"office-productivity"}>Office Productivity</option>
							<option value={"personal-development"}>
								Personal Development
							</option>
							<option value={"design"}>Design</option>
							<option value={"marketing"}>Marketing</option>
							<option value={"health-and-fitness"}>Health and Fitness</option>
							<option value={"music"}>Music</option>
						</select>
					</div>
					<div className="col">
						<label htmlFor="sub_category" className="form-label">
							Sub category
						</label>
						<select
							id="sub_category"
							name="sub_category"
							defaultValue="development"
							className="form-control mb-3"
						>
							<optgroup label="Development">
								<option value={"web-development"}>Web Development</option>
								<option value={"mobile-development"}>Mobile Development</option>
								<option value="programming-languages">
									Programming Languages
								</option>
								<option value="game-development">Game Development</option>
								<option value="database-design-and-development">
									Database Design and Development
								</option>
								<option value="software-testing">Software Testing</option>
							</optgroup>
							<optgroup label="Business">
								<option value="entrepreneurship">Entrepreneurship</option>
								<option value="communication">Communication</option>
								<option value="management">Management</option>
								<option value="sales">Sales</option>
								<option value="business-strategy">Business Strategy</option>
							</optgroup>
							<optgroup label="Finance and Accounting">
								<option value="accounting-and-bookkeeping">
									Accounting and Bookkeeping
								</option>
								<option value="cryptocurrency-and-blockchain">
									Cryptocurrency and Blockchain
								</option>
								<option value="finance">Finance</option>
								<option value="financial-modeling-and-analysis">
									Financial Modeling and Analysis
								</option>
								<option value="investing-and-trading">
									Investing and Trading
								</option>
							</optgroup>
							<optgroup label="IT and Software">
								<option value="it-certifications">IT Certifications</option>
								<option value="network-and-security">
									Network and Security
								</option>
								<option value="hardware">Hardware</option>
								<option value="operating-systems-and-servers">
									Operating Systems and Servers
								</option>
								<option value="other-it-and-software">
									Other IT and Software
								</option>
							</optgroup>
							<optgroup label="Office Productivity">
								<option value="microsoft">Microsoft</option>
								<option value="apple">Apple</option>
								<option value="google">Google</option>
								<option value="sap">SAP</option>
								<option value="oracle">Oracle</option>
								<option value="other-office-productivity">
									Other Office Productivity
								</option>
							</optgroup>
							<optgroup label="Personal Development">
								<option value="personal-transformation">
									Personal Transformation
								</option>
								<option value="personal-productivity">
									Personal Productivity
								</option>
								<option value="leadership">Leadership</option>
								<option value="career-development">Career Development</option>
								<option value="parenting-and-relationships">
									Parenting and Relationships
								</option>
							</optgroup>
							<optgroup label="Design">
								<option value="web-design">Web Design</option>
								<option value="graphic-design-and-illustration">
									Graphic Design and Illustration
								</option>
								<option value="design-tools">Design Tools</option>
								<option value="user-experience-design">
									User Experience Design
								</option>
								<option value="game-design">Game Design</option>
								<option value="3d-and-animation">3D and Animation</option>
							</optgroup>
							<optgroup label="Marketing">
								<option value="digital-marketing">Digital Marketing</option>
								<option value="search-engine-optimization">
									Search Engine Optimization
								</option>
								<option value="social-media-marketing">
									Social Media Marketing
								</option>
								<option value="branding">Branding</option>
								<option value="marketing-fundamentals">
									Marketing Fundamentals
								</option>
								<option value="marketing-analytics-and-automation">
									Marketing Analytics and Automation
								</option>
							</optgroup>
							<optgroup label="Health and Fitness">
								<option value="fitness">Fitness</option>
								<option value="general-health">General Health</option>
								<option value="sports">Sports</option>
								<option value="nutrition-and-diet">Nutrition and Diet</option>
								<option value="yoga">Yoga</option>
								<option value="mental-health">Mental Health</option>
							</optgroup>
							<optgroup label="Music">
								<option value="instruments">Instruments</option>
								<option value="music-production">Music Production</option>
								<option value="music-fundamentals">Music Fundamentals</option>
								<option value="vocal">Vocal</option>
								<option value="music-techniques">Music Techniques</option>
								<option value="music-software">Music Software</option>
							</optgroup>
						</select>
					</div>
				</div>
				<div className="row">
					<div className="col">
						<label htmlFor="isFree" className="form-label">
							Is it free?
						</label>
						<select
							id="isFree"
							name="isFree"
							defaultValue={true}
							className="form-control mb-3"
						>
							<option value={true}>Yes</option>
							<option value={false}>No</option>
						</select>
						<label htmlFor="price" className="form-label">
							Price
						</label>
						<input
							id="price"
							name="price"
							defaultValue="0"
							type="text"
							className="form-control mb-3"
							placeholder=""
						/>
					</div>
					<div className="col">
						<label htmlFor="language" className="form-label">
							Language
						</label>
						<select
							id="language"
							name="language"
							defaultValue="english"
							className="form-control mb-3"
						>
							<option value={"english"}>English</option>
							<option value={"mandarin"}>Mandarin</option>
							<option value={"hindi"}>Hindi</option>
							<option value={"spanish"}>Spanish</option>
							<option value={"french"}>French</option>
							<option value={"arabic"}>Arabic</option>
							<option value={"bengali"}>Bengali</option>
							<option value={"russian"}>Russian</option>
							<option value={"portuguese"}>Portuguese</option>
							<option value={"indonesian"}>Indonesian</option>
						</select>
					</div>
					<div className="col">
						<label htmlFor="difficulty" className="form-label">
							Difficulty
						</label>
						<select
							id="difficulty"
							name="difficulty"
							defaultValue="beginner"
							className="form-control mb-3"
						>
							<option value={"all-level"}>All level</option>
							<option value={"beginner"}>Beginner</option>
							<option value={"intermediate"}>Intermediate</option>
							<option value={"advanced"}>Advanced</option>
						</select>
					</div>
				</div>
			</div>
			<div className="col-lg-3">
				<AdminSidebar
					displayCategoryField={false}
					displayAvatar={true}
					avatar={undefined}
					avatarFormat={"image"}
					status="draft"
					fullWidth={false}
					password={""}
					featured={true}
					commented={true}
					embedding={true}
					github_readme={""}
					category={undefined}
					categories={[]}
					multiple_categories={false}
				/>
				<br />
				<FormButtons />
			</div>
		</form>
	);
};

export default CreateCourseForm;
