import {
	fetchurl,
	getAuthTokenOnServer,
	getUserOnServer,
} from "@/helpers/setTokenOnServer";
import { redirect } from "next/navigation";
// import AdminSidebar from "@/components/admin/myfinaladminsidebar";
import MyTextArea from "@/components/global/myfinaltextarea";
import FormButtons from "@/components/global/formbuttons";

async function getUsersSubscribed(params) {
	const res = await fetchurl(
		`/newslettersubscribers${params}`,
		"GET",
		"no-cache"
	);
	return res;
}

const CreateEmail = async ({ params, searchParams }) => {
	const awtdParams = await params;
	const awtdSearchParams = await searchParams;
	const token = await getAuthTokenOnServer();
	const auth = await getUserOnServer();

	const users = await getUsersSubscribed(
		`?page=${awtdSearchParams.page || 1}&limit=${
			awtdSearchParams.limit || 10
		}&sort=${awtdSearchParams.sort || "-createdAt"}`
	);

	const addEmail = async (formData) => {
		"use server";
		const rawFormData = {
			users: formData.getAll("users"),
			text: formData.get("text"),
			subject: formData.get("subject"),
			status: formData.get("status"),
		};
		await fetchurl(`/newsletteremails`, "POST", "no-cache", rawFormData);
		redirect(`/noadmin/newsletteremails`);
	};

	return (
		<form className="row" action={addEmail}>
			<div className="col">
				<label htmlFor="users" className="form-label">
					To
				</label>
				<select
					id="users"
					name="users"
					defaultValue={[]}
					className="form-control"
					multiple
				>
					{users?.data
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
					defaultValue="Subject"
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
					advancedTextEditor={true}
					customPlaceholder="No description"
					defaultValue="No description..."
					insertClasses={false}
				/>
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
				<br />
				<FormButtons />
			</div>
		</form>
	);
};

export default CreateEmail;
