"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { fetchurl } from "@/helpers/setTokenOnServer";
import MyTextArea from "@/components/global/myfinaltextarea";
import FormButtons from "@/components/global/formbuttons";

const UpdateNewsletterEmailForm = ({
	token = {},
	auth = {},
	object = {},
	objects = [],
}) => {
	const router = useRouter();

	const [btnText, setBtnText] = useState(`Submit`);

	const upgradeEmail = async (e) => {
		e.preventDefault();
		setBtnText("...");
		const form = e.target;
		const formData = new FormData(form);

		const rawFormData = {
			recipients: formData.getAll("recipients"),
			text: formData.get("text"),
			subject: formData.get("subject"),
			status: formData.get("status"),
		};

		const res = await fetchurl(
			`/noadmin/newsletteremails/${object?.data?._id}`,
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
		toast.success(`Newsletter email updated`, "bottom");
		router.push(`/noadmin/newsletteremails`);
	};

	const resetForm = (e) => {
		e.target.closest("form").reset();
	};

	return (
		<form className="row" onSubmit={upgradeEmail}>
			<div className="col">
				<label htmlFor="recipients" className="form-label">
					To
				</label>
				<select
					id="recipients"
					name="recipients"
					defaultValue={object?.data?.users}
					className="form-control"
					multiple
				>
					{objects?.data
						.filter((user) => user.email !== auth?.email)
						.map((user) => (
							<option key={user._id} value={user.name + "|" + user.email}>
								{user?.email}
							</option>
						))}
				</select>
				<label htmlFor="subject" className="form-label">
					Subject
				</label>
				<input
					id="subject"
					name="subject"
					defaultValue={object?.data?.subject}
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
					onModel="NewsletterEmail"
					advancedTextEditor={false}
					customPlaceholder="No description"
					defaultValue={object?.data?.text}
				/>
			</div>
			<div className="col-lg-3">
				<label htmlFor="status" className="form-label">
					Status
				</label>
				<select
					id="status"
					name="status"
					defaultValue={object?.data?.status}
					className="form-control"
				>
					<option value={`draft`}>Draft</option>
					<option value={`published`}>Published</option>
					<option value={`trash`}>Trash</option>
					<option value={`scheduled`}>Scheduled</option>
				</select>
				<br />
				<FormButtons />
			</div>
		</form>
	);
};

export default UpdateNewsletterEmailForm;
