import {
	fetchurl,
	getAuthTokenOnServer,
	getUserOnServer,
} from "@/helpers/setTokenOnServer";
import { redirect } from "next/navigation";
import AdminSidebar from "@/components/admin/myfinaladminsidebar";
import MyTextArea from "@/components/global/myfinaltextarea";
import FormButtons from "@/components/global/formbuttons";

const CreateEvent = async ({ params, searchParams }) => {
	const token = await getAuthTokenOnServer();
	const auth = await getUserOnServer();

	const addEvent = async (formData) => {
		"use server";
		const rawFormData = {
			title: formData.get("title"),
			text: formData.get("text"),
			fullCalendarDateFormat: formData.get("fullCalendarDateFormat"),
			day: formData.get("day"),
			time: formData.get("time"),
			priority: formData.get("priority"),
			recurrenceRule: formData.get("recurrenceRule"),
			status: formData.get("status"),
		};

		await fetchurl(`/noadmin/events`, "POST", "no-cache", {
			...rawFormData,
			attendees: [
				{
					name: process.env.NEXT_PUBLIC_WEBSITE_NAME,
					email: process.env.NEXT_PUBLIC_WEBSITE_EMAIL,
					phoneNumber: "682-375-9607",
				},
			],
		});
		redirect(`/noadmin/events`);
	};

	return (
		<form className="row" action={addEvent}>
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
				<label htmlFor="text" className="form-label">
					Text
				</label>
				<MyTextArea
					auth={auth}
					token={token}
					id="text"
					name="text"
					defaultValue="No description..."
					onModel="Event"
					advancedTextEditor={true}
					customPlaceholder="No description"
				/>
				<div className="row">
					{/* fullCalendarDateFormat, recurrenceRule */}
					<div className="col">
						<label htmlFor="day" className="form-label">
							Day
						</label>
						<input
							id="day"
							name="day"
							defaultValue="2025-03-07 Monday"
							type="text"
							className="form-control mb-3"
							placeholder="2025-03-07 Monday"
						/>
					</div>
					<div className="col">
						<label htmlFor="time" className="form-label">
							Time
						</label>
						<input
							id="time"
							name="time"
							defaultValue="10:00"
							type="text"
							className="form-control mb-3"
							placeholder="10:00"
						/>
					</div>
					<div className="col">
						<label htmlFor="priority" className="form-label">
							Priority
						</label>
						<select
							id="priority"
							name="priority"
							defaultValue="low"
							className="form-control mb-3"
						>
							<option value="low">Low</option>
							<option value="medium">Medium</option>
							<option value="urgent">Urgent</option>
						</select>
					</div>
					<div className="col">
						<label htmlFor="method" className="form-label">
							Method
						</label>
						<select
							id="method"
							name="method"
							defaultValue="phone"
							className="form-control mb-3"
						>
							<option value="phone">Phone</option>
							<option value="video-interview">Video Interview</option>
							<option value="face-to-face">Face to Face</option>
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
					status="draft"
					fullWidth={false}
					password=""
					featured={false}
					commented={false}
					embedding={false}
					github_readme={""}
					category={undefined}
					categories={[]}
					multiple_categories={false}
					multipleFiles={false}
					onModel={"Event"}
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

export default CreateEvent;
