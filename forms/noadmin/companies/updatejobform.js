"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { fetchurl } from "@/helpers/setTokenOnServer";
import AdminSidebar from "@/components/noadmin/myfinaladminsidebar";
import MyTextArea from "@/components/global/myfinaltextarea";
import FormButtons from "@/components/global/formbuttons";

const UpdateJobForm = ({ token = {}, auth = {}, object = {} }) => {
	const router = useRouter();

	const [btnText, setBtnText] = useState(`Submit`);

	const upgradeJob = async (e) => {
		e.preventDefault();
		setBtnText("...");
		const form = e.target;
		const formData = new FormData(form);

		const rawFormData = {
			title: formData.get("title"),
			text: formData.get("text"),
			featured: formData.get("featured"),
			positionFilled: formData.get("positionFilled"),
			experience_level: formData.getAll("experience_level"),
			job_type: formData.getAll("job_type"),
			remote: formData.getAll("remote"),
			shift_and_schedule: formData.getAll("shift_and_schedule"),
			encouraged_to_apply: formData.get("encouraged_to_apply"),
			starting_at: formData.get("starting_at"),
			provides_training: formData.get("provides_training"),
			security_clearance: formData.get("security_clearance"),
			address: formData.get("address"),
			commented: formData.get("commented"),
			password: formData.get("password"),
			status: formData.get("status"),
		};

		const res = await fetchurl(
			`/noadmin/jobs/${object?.data?._id}`,
			"PUT",
			"no-cache",
			rawFormData
		);

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
		toast.success(`Job updated`, "bottom");
		router.push(`/noadmin/companies/read/${object?.data?.resourceId?._id}`);
	};

	const resetForm = (e) => {
		e.target.closest("form").reset();
	};

	return (
		<form className="row" onSubmit={upgradeJob}>
			<div className="col">
				<label htmlFor="blog-title" className="form-label">
					Title
				</label>
				<input
					id="blog-title"
					name="title"
					defaultValue={object?.data?.title}
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
					defaultValue={object?.data?.text}
					onModel="Job"
					advancedTextEditor={true}
					customPlaceholder="No description"
				/>
				<div className="row">
					<div className="col">
						<label htmlFor="positionFilled" className="form-label">
							Position Filled?
						</label>
						<select
							id="positionFilled"
							name="positionFilled"
							defaultValue={object?.data?.positionFilled.toString()}
							className="form-control mb-3"
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
							defaultValue={object?.data?.starting_at}
							type="number"
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
							defaultValue={object?.data?.experience_level}
							className="form-control mb-3"
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
							defaultValue={object?.data?.job_type}
							className="form-control mb-3"
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
							defaultValue={object?.data?.provides_training.toString()}
							className="form-control mb-3"
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
							defaultValue={object?.data?.security_clearance.toString()}
							className="form-control mb-3"
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
							defaultValue={object?.data?.address}
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
							defaultValue={object?.data?.remote}
							className="form-control mb-3"
							multiple
						>
							<option value={`hybrid`}>Hybrid</option>
							<option value={`remote`}>Remote</option>
							<option value={`in-office`}>In Office</option>
						</select>
					</div>
					<div className="col">
						<label htmlFor="shift_and_schedule" className="form-label">
							Shift and Schedule
						</label>
						<select
							id="shift_and_schedule"
							name="shift_and_schedule"
							defaultValue={object?.data?.shift_and_schedule}
							className="form-control mb-3"
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
							defaultValue={object?.data?.encouraged_to_apply}
							className="form-control mb-3"
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
					avatar={undefined}
					avatarFormat={"image"}
					status={object?.data?.status}
					fullWidth={false}
					password=""
					featured={object?.data?.featured.toString()}
					commented={object?.data?.commented.toString()}
					embedding={false}
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

export default UpdateJobForm;
