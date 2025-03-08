import {
	fetchurl,
	getAuthTokenOnServer,
	getUserOnServer,
} from "@/helpers/setTokenOnServer";
import { notFound, redirect } from "next/navigation";
import AdminSidebar from "@/components/admin/myfinaladminsidebar";
import MyTextArea from "@/components/global/myfinaltextarea";
import FormButtons from "@/components/global/formbuttons";

async function getComment(params) {
	const res = await fetchurl(`/comments${params}`, "GET", "no-cache");
	if (!res.success) notFound();
	return res;
}

const UpdateComment = async ({ params, searchParams }) => {
	const awtdParams = await params;
	const awtdSearchParams = await searchParams;
	const token = await getAuthTokenOnServer();
	const auth = await getUserOnServer();

	const comment = await getComment(`/${awtdParams.id}`);

	const upgradeComment = async (formData) => {
		"use server";
		const rawFormData = {
			title: formData.get("title"),
			text: formData.get("text"),
			status: formData.get("status"),
		};
		await fetchurl(
			`/comments/${awtdParams.id}`,
			"PUT",
			"no-cache",
			rawFormData
		);
		redirect(`/noadmin/comments`);
	};

	return (
		<form className="row" action={upgradeComment}>
			<div className="col">
				<label htmlFor="blog-title" className="form-label">
					Title
				</label>
				<input
					id="blog-title"
					name="title"
					defaultValue={comment?.data?.title}
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
					onModel="Comment"
					advancedTextEditor={true}
					customPlaceholder="No description"
					defaultValue={comment?.data?.text}
				/>
			</div>
			<div className="col-lg-3">
				<AdminSidebar
					displayCategoryField={false}
					displayAvatar={false}
					avatar={""}
					avatarFormat={"image"}
					status={comment?.data?.status}
					fullWidth={false}
					password=""
					featured={undefined}
					commented={undefined}
					embedding={undefined}
					github_readme={""}
					category={undefined}
					categories={[]}
					multiple_categories={false}
					multipleFiles={false}
					onModel={"Comment"}
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

export default UpdateComment;
