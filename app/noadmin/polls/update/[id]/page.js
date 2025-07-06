import { notFound, redirect } from "next/navigation";
import {
	fetchurl,
	getAuthTokenOnServer,
	getUserOnServer,
} from "@/helpers/setTokenOnServer";
import AdminSidebar from "@/components/noadmin/myfinaladminsidebar";
import MyTextArea from "@/components/global/myfinaltextarea";
import FormButtons from "@/components/global/formbuttons";

async function getPoll(params) {
	const res = await fetchurl(`/global/polls${params}`, "GET", "no-cache");
	if (!res.success) notFound();
	return res;
}

const UpdatePoll = async ({ params, searchParams }) => {
	const awtdParams = await params;
	const awtdSearchParams = await searchParams;
	const token = await getAuthTokenOnServer();
	const auth = await getUserOnServer();

	const poll = await getPoll(`/${awtdParams.id}`);

	const upgradePoll = async (formData) => {
		"use server";
		const rawFormData = {
			title: formData.get("title"),
			text: formData.get("text"),
			featured: formData.get("featured"),
			status: formData.get("status"),
		};
		await fetchurl(
			`/noadmin/polls/${awtdParams.id}`,
			"PUT",
			"no-cache",
			rawFormData
		);
		redirect(`/noadmin/polls`);
	};

	return (
		<form className="row" action={upgradePoll}>
			<div className="col">
				<label htmlFor="blog-title" className="form-label">
					Title
				</label>
				<input
					id="blog-title"
					name="title"
					defaultValue={poll?.data?.title}
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
					onModel="Poll"
					advancedTextEditor={false}
					customPlaceholder="No description"
					defaultValue={poll?.data?.text}
				/>
			</div>
			<div className="col-lg-3">
				<AdminSidebar
					displayCategoryField={false}
					displayAvatar={false}
					avatar={undefined}
					avatarFormat={"image"}
					status={poll?.data?.status}
					fullWidth={false}
					password=""
					featured={poll?.data?.featured.toString()}
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

export default UpdatePoll;
