import {
	fetchurl,
	getAuthTokenOnServer,
	getUserOnServer,
} from "@/helpers/setTokenOnServer";
import { redirect } from "next/navigation";
// import AdminSidebar from "@/components/admin/myfinaladminsidebar";
import MyTextArea from "@/components/global/myfinaltextarea";
import FormButtons from "@/components/global/formbuttons";

const CreateForum = async ({ params, searchParams }) => {
	const token = await getAuthTokenOnServer();
	const auth = await getUserOnServer();

	// FILES
	// CATEGORIES

	const addForum = async (formData) => {
		"use server";
		const rawFormData = {
			title: formData.get("title"),
			text: formData.get("text"),
			featured: formData.get("featured"),
			embedding: formData.get("embedding"),
			category: formData.get("category"),
			sub_category: formData.get("sub_category"),
			commented: formData.get("commented"),
			password: formData.get("password"),
			status: formData.get("status"),
			// files: { avatar: formData.get("file") },
		};
		await fetchurl(`/forums`, "POST", "no-cache", {
			...rawFormData,
			website: process.env.NEXT_PUBLIC_NO_REPLY_EMAIL, // Needed for DB mass email functionality
		});
		redirect(`/noadmin/forums`);
	};

	return (
		<form className="row" action={addForum}>
			<div className="col">
				<label htmlFor="blog-title" className="form-label">
					Title
				</label>
				<input
					id="blog-title"
					name="title"
					defaultValue="Untitled"
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
					onModel="Forum"
					advancedTextEditor={true}
					customPlaceholder="No description"
					defaultValue="No description..."
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
							className="form-control"
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
							className="form-control"
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
			</div>
			<div className="col-lg-3">
				<label htmlFor="status" className="form-label">
					Status
				</label>
				<select
					id="status"
					name="status"
					defaultValue="draft"
					className="form-control"
				>
					<option value={`draft`}>Draft</option>
					<option value={`published`}>Published</option>
					<option value={`trash`}>Trash</option>
					<option value={`scheduled`}>Scheduled</option>
				</select>
				<label htmlFor="password" className="form-label">
					Password
				</label>
				<input
					id="password"
					name="password"
					defaultValue=""
					type="password"
					className="form-control mb-3"
					placeholder="******"
				/>
				<label htmlFor="featured" className="form-label">
					Featured
				</label>
				<select
					id="featured"
					name="featured"
					defaultValue={true}
					className="form-control"
				>
					<option value={true}>Yes</option>
					<option value={false}>No</option>
				</select>
				<label htmlFor="commented" className="form-label">
					Commented
				</label>
				<select
					id="commented"
					name="commented"
					defaultValue={false}
					className="form-control"
				>
					<option value={true}>Yes</option>
					<option value={false}>No</option>
				</select>
				<label htmlFor="embedding" className="form-label">
					Embedding
				</label>
				<select
					id="embedding"
					name="embedding"
					defaultValue={false}
					className="form-control"
				>
					<option value={true}>Yes</option>
					<option value={false}>No</option>
				</select>
				<br />
				<FormButtons />
			</div>
		</form>
	);
};

export default CreateForum;
