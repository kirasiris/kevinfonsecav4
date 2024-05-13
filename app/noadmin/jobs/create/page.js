"use client";
import { fetchurl } from "@/helpers/setTokenOnServer";
import { useRouter } from "next/navigation";
import { useState, useEffect, useContext } from "react";
import { toast } from "react-toastify";
import AuthContext from "@/helpers/globalContext";
import AdminSidebar from "@/components/admin/adminsidebar";
import MyTextArea from "@/components/global/mytextarea";

const CreateJob = () => {
	const { auth } = useContext(AuthContext);
	const router = useRouter();

	// Redirect if not authenticated
	!auth.isAuthenticated && router.push("/auth/login");

	// Redirec if not founder
	auth.isAuthenticated &&
		!auth.user.role.includes("founder") &&
		router.push("/dashboard");

	// Redirect if not company
	!auth?.user?.hasCompany && router.push(`/noadmin/companies`);

	const [companies, setCompanies] = useState([]);

	const fetchCompanies = async (params = "") => {
		try {
			const res = await fetchurl(`/companies${params}`, "GET", "no-cache");
			setCompanies(res?.data);
		} catch (err) {
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

	useEffect(() => {
		fetchCompanies(`?page=1&sort=-createdAt`);
	}, []);

	const [jobData, setJobData] = useState({
		resourceId: 0,
		title: `Untitled`,
		text: `No description`,
		featured: true,
		positionFilled: false,
		experience_level: ["graduate"],
		job_type: ["full-time"],
		remote: "remote",
		shift_and_schedule: ["monday-to-friday"],
		encouraged_to_apply: "fair-chance",
		starting_at: 7.5,
		provides_training: true,
		security_clearance: false,
		address: "",
		commented: false,
		password: ``,
		status: `draft`,
	});
	const {
		resourceId,
		title,
		text,
		featured,
		positionFilled,
		experience_level,
		job_type,
		remote,
		shift_and_schedule,
		encouraged_to_apply,
		starting_at,
		provides_training,
		security_clearance,
		address,
		commented,
		password,
		status,
	} = jobData;

	const addJob = async (e) => {
		e.preventDefault();
		try {
			await fetchurl(`/jobs`, "POST", "no-cache", {
				...jobData,
				website: "beFree",
			});
			toast.success(`Item created`);
			resetForm();
			router.push(`/noadmin/jobs`);
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
		setJobData({
			resourceId: 0,
			title: `Untitled`,
			text: `No description`,
			featured: true,
			positionFilled: false,
			experience_level: ["graduate"],
			job_type: ["full-time"],
			remote: "remote",
			shift_and_schedule: ["monday-to-friday"],
			encouraged_to_apply: "fair-chance",
			starting_at: 7.5,
			provides_training: true,
			security_clearance: false,
			address: "",
			commented: false,
			password: ``,
			status: `draft`,
		});
	};

	return (
		<form className="row" onSubmit={addJob}>
			<div className="col">
				<label htmlFor="blog-title" className="form-label">
					Title
				</label>
				<input
					id="blog-title"
					name="title"
					value={title}
					onChange={(e) => {
						setJobData({
							...jobData,
							title: e.target.value,
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
					objectData={jobData}
					setObjectData={setJobData}
					onModel="Job"
					advancedTextEditor={false}
				/>
				<label htmlFor="resourceId" className="form-label">
					Company
				</label>
				<select
					id="resourceId"
					name="resourceId"
					value={resourceId}
					onChange={(e) => {
						setJobData({
							...jobData,
							resourceId: e.target.value,
						});
					}}
					className="form-control"
				>
					{companies.map((course) => (
						<option key={course._id} value={course._id}>
							{course.title}
						</option>
					))}
				</select>
				<div className="row">
					<div className="col">
						<label htmlFor="positionFilled" className="form-label">
							Position Filled?
						</label>
						<select
							id="positionFilled"
							name="positionFilled"
							value={positionFilled}
							onChange={(e) => {
								setJobData({
									...jobData,
									positionFilled: e.target.value,
								});
							}}
							className="form-control"
						>
							<option value={true}>Yes</option>
							<option value={false}>No</option>
						</select>
						<label htmlFor="starting_at" className="form-label">
							Starting At
						</label>
						<input
							id="starting_at"
							name="starting_at"
							value={starting_at}
							onChange={(e) => {
								setJobData({
									...jobData,
									starting_at: e.target.value,
								});
							}}
							type="text"
							className="form-control mb-3"
							placeholder="7.5"
						/>
					</div>
					<div className="col">
						<label htmlFor="experience_level" className="form-label">
							Experience Level
						</label>
						<select
							id="experience_level"
							name="experience_level"
							value={experience_level}
							onChange={(e) => {
								const selectedOptions = Array.from(
									e.target.selectedOptions
								).map((option) => option.value);
								setJobData({
									...jobData,
									experience_level: selectedOptions,
								});
							}}
							className="form-control"
							multiple
						>
							<option value={"graduate"}>Graduate</option>
							<option value={"entry"}>Entry</option>
							<option value={"mid"}>Mid</option>
							<option value={"senior"}>Senior</option>
						</select>
						<label htmlFor="job_type" className="form-label">
							Job Type
						</label>
						<select
							id="job_type"
							name="job_type"
							value={job_type}
							onChange={(e) => {
								const selectedOptions = Array.from(
									e.target.selectedOptions
								).map((option) => option.value);
								setJobData({
									...jobData,
									job_type: selectedOptions,
								});
							}}
							className="form-control"
							multiple
						>
							<option value={"full-time"}>Full Time</option>
							<option value={"part-time"}>Part Time</option>
							<option value={"commission"}>Commission</option>
							<option value={"contract"}>Contract</option>
							<option value={"internship"}>Internship</option>
						</select>
					</div>
					<div className="col">
						<label htmlFor="provides_training" className="form-label">
							Provides Training
						</label>
						<select
							id="provides_training"
							name="provides_training"
							value={provides_training}
							onChange={(e) => {
								setJobData({
									...jobData,
									provides_training: e.target.value,
								});
							}}
							className="form-control"
						>
							<option value={true}>Yes</option>
							<option value={false}>No</option>
						</select>
						<label htmlFor="security_clearance" className="form-label">
							Security Clearance
						</label>
						<select
							id="security_clearance"
							name="security_clearance"
							value={security_clearance}
							onChange={(e) => {
								setJobData({
									...jobData,
									security_clearance: e.target.value,
								});
							}}
							className="form-control"
						>
							<option value={true}>Yes</option>
							<option value={false}>No</option>
						</select>
					</div>
					<div className="col-lg-12">
						<label htmlFor="address" className="form-label">
							Address
						</label>
						<input
							id="address"
							name="address"
							value={address}
							onChange={(e) => {
								setJobData({
									...jobData,
									address: e.target.value,
								});
							}}
							type="text"
							className="form-control mb-3"
							placeholder=""
						/>
					</div>
					<div className="col">
						<label htmlFor="remote" className="form-label">
							Remote
						</label>
						<select
							id="remote"
							name="remote"
							value={remote}
							onChange={(e) => {
								setJobData({
									...jobData,
									remote: e.target.value,
								});
							}}
							className="form-control"
						>
							<option value={`hybrid`}>Hybrid</option>
							<option value={`remote`}>Remote</option>
						</select>
					</div>
					<div className="col">
						<label htmlFor="shift_and_schedule" className="form-label">
							Shift and Schedule
						</label>
						<select
							id="shift_and_schedule"
							name="shift_and_schedule"
							value={shift_and_schedule}
							onChange={(e) => {
								const selectedOptions = Array.from(
									e.target.selectedOptions
								).map((option) => option.value);
								setJobData({
									...jobData,
									shift_and_schedule: selectedOptions,
								});
							}}
							className="form-control"
							multiple
						>
							<option value={`hybrid`}>Hybrid</option>
							<option value={`weekend-as-needed`}>Weekends as Needed</option>
							<option value={`day-shift`}>Day Shift</option>
							<option value={`monday-to-friday`}>Monday to Friday</option>
							<option value={`8hr-shift`}>8hrs. Shift</option>
							<option value={`holidays`}>Holidays</option>
							<option value={`night-shift`}>Night Shifts</option>
							<option value={`10hr-shift`}>10hrs. Shift</option>
							<option value={`overtime`}>Overtime</option>
							<option value={`no-weekends`}>No Weekends</option>
							<option value={`12hr-shift`}>12hrs. Shift</option>
							<option value={`on-call`}>On Call</option>
							<option value={`overnight-shift`}>Overnight Shift</option>
						</select>
					</div>
					<div className="col">
						<label htmlFor="encouraged_to_apply" className="form-label">
							Encouraged to Apply
						</label>
						<select
							id="encouraged_to_apply"
							name="encouraged_to_apply"
							value={encouraged_to_apply}
							onChange={(e) => {
								setJobData({
									...jobData,
									encouraged_to_apply: e.target.value,
								});
							}}
							className="form-control"
						>
							<option value={`fair-chance`}>Fair Chance</option>
							<option value={`no-highschool-diploma`}>
								No Highschool Diploma
							</option>
							<option value={`no-degree`}>No Degree</option>
							<option value={`military-encouraged`}>Military Encouraged</option>
							<option value={`back-to-work`}>Back to Work</option>
						</select>
					</div>
				</div>
			</div>
			<div className="col-lg-3">
				<AdminSidebar
					displayCategoryField={false}
					displayAvatar={false}
					avatar={""}
					status={status}
					fullWidth={false}
					password={password}
					featured={featured}
					commented={commented}
					embedding={false}
					github_readme={""}
					category={undefined}
					categories={[]}
					objectData={jobData}
					setObjectData={setJobData}
					multipleFiles={false}
					onModel={"Job"}
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

export default CreateJob;
