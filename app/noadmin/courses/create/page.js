"use client";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useContext, useState } from "react";
import { toast } from "react-toastify";
import AdminSidebar from "@/components/admin/adminsidebar";
import MyTextArea from "@/components/global/mytextarea";
import AuthContext from "@/helpers/globalContext";

const CreateCourse = () => {
	const { files } = useContext(AuthContext);

	const router = useRouter();

	const [courseData, setCourseData] = useState({
		title: `Untitled`,
		sub_title: ``,
		text: `No description`,
		price: 0,
		featured: true,
		embedding: true,
		category: "development",
		sub_category: "web-development",
		isFree: true,
		language: "english",
		difficulty: "beginner",
		commented: true,
		password: ``,
		status: `draft`,
	});
	const {
		title,
		sub_title,
		text,
		price,
		featured,
		embedding,
		category,
		sub_category,
		isFree,
		language,
		difficulty,
		commented,
		password,
		status,
	} = courseData;

	const addCourse = async (e) => {
		e.preventDefault();
		try {
			console.log(courseData);
			await axios.post(`/courses`, {
				...courseData,
				files: { avatar: files?.selected?._id },
			});
			router.push(`/noadmin/courses`);
		} catch (err) {
			console.log(err);
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
			return { msg: err?.response?.statusText, status: err?.response?.status };
		}
	};

	const resetForm = () => {
		setCourseData({
			title: `Untitled`,
			sub_title: ``,
			text: `No description`,
			price: 0,
			featured: true,
			embedding: true,
			category: "development",
			sub_category: "web-development",
			isFree: true,
			language: "english",
			difficulty: "beginner",
			commented: true,
			password: ``,
			status: `draft`,
		});
	};

	return (
		<form className="row" onSubmit={addCourse}>
			<div className="col">
				<label htmlFor="blog-title" className="form-label">
					Title
				</label>
				<input
					id="blog-title"
					name="title"
					value={title}
					onChange={(e) => {
						setCourseData({
							...courseData,
							title: e.target.value,
						});
					}}
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
					value={sub_title}
					onChange={(e) => {
						setCourseData({
							...courseData,
							sub_title: e.target.value,
						});
					}}
					type="text"
					className="form-control mb-3"
					placeholder=""
				/>
				<label htmlFor="text" className="form-label">
					Text
				</label>
				<MyTextArea
					id="text"
					name="text"
					value={text}
					objectData={courseData}
					setObjectData={setCourseData}
					onModel="Course"
					advancedTextEditor={false}
				/>
				<div className="row">
					<div className="col">
						<label htmlFor="category" className="form-label">
							Category
						</label>
						<select
							id="category"
							name="category"
							value={category}
							onChange={(e) => {
								setCourseData({
									...courseData,
									category: e.target.value,
								});
							}}
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
							value={sub_category}
							onChange={(e) => {
								setCourseData({
									...courseData,
									sub_category: e.target.value,
								});
							}}
							className="form-control"
						>
							{category === "development" && (
								<>
									<option value={"web-development"}>Web Development</option>
									<option value={"mobile-development"}>
										Mobile Development
									</option>
									<option value="programming-languages">
										Programming Languages
									</option>
									<option value="game-development">Game Development</option>
									<option value="database-design-and-development">
										Database Design and Development
									</option>
									<option value="software-testing">Software Testing</option>
								</>
							)}
							{category === "business" && (
								<>
									<option value="entrepreneurship">Entrepreneurship</option>
									<option value="communication">Communication</option>
									<option value="management">Management</option>
									<option value="sales">Sales</option>
									<option value="business-strategy">Business Strategy</option>
								</>
							)}
							{category === "finance-and-accounting" && (
								<>
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
								</>
							)}
							{category === "it-and-software" && (
								<>
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
								</>
							)}
							{category === "office-productivity" && (
								<>
									<option value="microsoft">Microsoft</option>
									<option value="apple">Apple</option>
									<option value="google">Google</option>
									<option value="sap">SAP</option>
									<option value="oracle">Oracle</option>
									<option value="other-office-productivity">
										Other Office Productivity
									</option>
								</>
							)}
							{category === "personal-development" && (
								<>
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
								</>
							)}
							{category === "design" && (
								<>
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
								</>
							)}
							{category === "marketing" && (
								<>
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
								</>
							)}
							{category === "health-and-fitness" && (
								<>
									<option value="fitness">Fitness</option>
									<option value="general-health">General Health</option>
									<option value="sports">Sports</option>
									<option value="nutrition-and-diet">Nutrition and Diet</option>
									<option value="yoga">Yoga</option>
									<option value="mental-health">Mental Health</option>
								</>
							)}
							{category === "music" && (
								<>
									<option value="instruments">Instruments</option>
									<option value="music-production">Music Production</option>
									<option value="music-fundamentals">Music Fundamentals</option>
									<option value="vocal">Vocal</option>
									<option value="music-techniques">Music Techniques</option>
									<option value="music-software">Music Software</option>
								</>
							)}
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
							value={isFree}
							onChange={(e) => {
								setCourseData({
									...courseData,
									isFree: e.target.value,
								});
							}}
							className="form-control"
						>
							<option value={true}>Yes</option>
							<option value={false}>No</option>
						</select>
						{isFree === "false" && (
							<>
								<label htmlFor="price" className="form-label">
									Price
								</label>
								<input
									id="price"
									name="price"
									value={price}
									onChange={(e) => {
										setCourseData({
											...courseData,
											price: e.target.value,
										});
									}}
									type="text"
									className="form-control mb-3"
									placeholder=""
								/>
							</>
						)}
					</div>
					<div className="col">
						<label htmlFor="language" className="form-label">
							Language
						</label>
						<select
							id="language"
							name="language"
							value={language}
							onChange={(e) => {
								setCourseData({
									...courseData,
									language: e.target.value,
								});
							}}
							className="form-control"
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
							value={difficulty}
							onChange={(e) => {
								setCourseData({
									...courseData,
									difficulty: e.target.value,
								});
							}}
							className="form-control"
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
					avatar={files?.selected?._id}
					status={status}
					fullWidth={false}
					password={password}
					featured={featured}
					commented={commented}
					embedding={embedding}
					github={false}
					category={category}
					objectData={courseData}
					setObjectData={setCourseData}
					multipleFiles={false}
					onModel={"Playlist"}
				/>
				<br />
				<button
					type="submit"
					className="btn btn-secondary btn-sm float-start"
					disabled={title.length > 0 && text.length > 0 ? !true : !false}
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
			</div>
		</form>
	);
};

export default CreateCourse;
