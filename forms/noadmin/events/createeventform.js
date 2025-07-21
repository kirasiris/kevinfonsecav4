"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { fetchurl } from "@/helpers/setTokenOnServer";
import AdminSidebar from "@/components/noadmin/myfinaladminsidebar";
import MyTextArea from "@/components/global/myfinaltextarea";
import FormButtons from "@/components/global/formbuttons";

const CreateEventForm = ({ token = {}, auth = {} }) => {
	const router = useRouter();

	const [btnText, setBtnText] = useState(`Submit`);

	const addEvent = async (e) => {
		e.preventDefault();
		setBtnText("...");
		const form = e.target;
		const formData = new FormData(form);

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

		const res = await fetchurl(`/noadmin/events`, "POST", "no-cache", {
			...rawFormData,
			attendees: [
				{
					name: process.env.NEXT_PUBLIC_WEBSITE_NAME,
					email: process.env.NEXT_PUBLIC_WEBSITE_EMAIL,
					phoneNumber: "682-375-9607",
				},
			],
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
		toast.success(`Event created`, "bottom");
		router.push(`/noadmin/events`);
	};

	const resetForm = (e) => {
		e.target.closest("form").reset();
	};

	return (
		<form className="row" onSubmit={addEvent}>
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
					avatar={undefined}
					avatarFormat={""}
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
				/>
				<br />
				<FormButtons />
			</div>
		</form>
	);
};

export default CreateEventForm;
