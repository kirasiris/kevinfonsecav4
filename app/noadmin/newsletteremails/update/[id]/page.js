import {
	fetchurl,
	getAuthTokenOnServer,
	getUserOnServer,
} from "@/helpers/setTokenOnServer";
import { notFound, redirect } from "next/navigation";
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

async function getNewsletterEmail(params) {
	const res = await fetchurl(`/newsletteremails${params}`, "GET", "no-cache");
	if (!res.success) notFound();
	return res;
}

const UpdateEmail = async ({ params, searchParams }) => {
	const token = await getAuthTokenOnServer();
	const auth = await getUserOnServer();

	const newsletteremail = await getNewsletterEmail(`/${params.id}`);

	const users = await getUsersSubscribed(
		`?page=${searchParams.page || 1}&limit=${searchParams.limit || 10}&sort=${
			searchParams.sort || "-createdAt"
		}`
	);

	const upgradeEmail = async (formData) => {
		"use server";
		const rawFormData = {
			users: formData.getAll("users"),
			text: formData.get("text"),
			subject: formData.get("subject"),
			status: formData.get("status"),
		};
		await fetchurl(
			`/newsletteremails/${params.id}`,
			"PUT",
			"no-cache",
			rawFormData
		);
		redirect(`/noadmin/newsletteremails`);
	};

	return (
		<form className="row" action={upgradeEmail}>
			<div className="col">
				<label htmlFor="users" className="form-label">
					To
				</label>
				<select
					id="users"
					name="users"
					defaultValue={newsletteremail?.data?.users}
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
					defaultValue={newsletteremail?.data?.subject}
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
					defaultValue={newsletteremail?.data?.text}
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
					defaultValue={newsletteremail?.data?.status}
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

export default UpdateEmail;