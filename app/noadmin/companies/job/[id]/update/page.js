import { notFound, redirect } from "next/navigation";
import {
	fetchurl,
	getAuthTokenOnServer,
	getUserOnServer,
} from "@/helpers/setTokenOnServer";
import AdminSidebar from "@/components/admin/myfinaladminsidebar";
import MyTextArea from "@/components/global/myfinaltextarea";
import FormButtons from "@/components/global/formbuttons";

async function getJob(params) {
	const res = await fetchurl(`/global/jobs${params}`, "GET", "no-cache");
	if (!res.success) notFound();
	return res;
}

const UpdateJob = async ({ params, searchParams }) => {
	const awtdParams = await params;
	const awtdSearchParams = await searchParams;
	const token = await getAuthTokenOnServer();
	const auth = await getUserOnServer();

	const job = await getJob(`/${awtdParams.id}`);

	// Redirect if not company
	// !auth?.data?.hasCompany && redirect(`/noadmin/companies`);

	const upgradeJob = async (formData) => {
		"use server";
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

		await fetchurl(`/noadmin/jobs/${awtdParams.id}`, "PUT", "no-cache", {
			...rawFormData,
		});
		redirect(`/noadmin/companies/read/${job?.data?.resourceId}`);
	};

	return (
		<form className="row" action={upgradeJob}>
			<div className="col">
				<label htmlFor="blog-title" className="form-label">
					Title
				</label>
				<input
					id="blog-title"
					name="title"
					defaultValue={job?.data?.title}
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
					onModel="Job"
					advancedTextEditor={true}
					customPlaceholder="No description"
					defaultValue={job?.data?.text}
				/>
				<div className="row">
					<div className="col">
						<label htmlFor="positionFilled" className="form-label">
							Position Filled?
						</label>
						<select
							id="positionFilled"
							name="positionFilled"
							defaultValue={job?.data?.positionFilled}
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
							defaultValue={job?.data?.starting_at}
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
							defaultValue={job?.data?.experience_level}
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
							defaultValue={job?.data?.job_type}
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
							defaultValue={job?.data?.provides_training}
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
							defaultValue={job?.data?.security_clearance}
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
							defaultValue={job?.data?.address}
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
							defaultValue={job?.data?.remote}
							className="form-control"
							multiple
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
							defaultValue={job?.data?.shift_and_schedule}
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
							defaultValue={job?.data?.encouraged_to_apply}
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
					// avatar={files?.selected?._id}
					avatarFormat={"image"}
					status={job?.data?.status}
					fullWidth={false}
					password={job?.data?.password}
					featured={job?.data?.featured}
					commented={job?.data?.commented}
					embedding={false}
					github_readme={""}
					category={undefined}
					categories={[]}
					multiple_categories={false}
					multipleFiles={false}
					onModel={"Job"}
					files={[]}
					auth={auth}
					token={token}
				/>
				<br />
				<FormButtons />
			</div>
		</form>
	);
};

export default UpdateJob;
