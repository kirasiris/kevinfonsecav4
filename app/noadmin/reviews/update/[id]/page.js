import {
	fetchurl,
	getAuthTokenOnServer,
	getUserOnServer,
} from "@/helpers/setTokenOnServer";
import { notFound, redirect } from "next/navigation";
import AdminSidebar from "@/components/noadmin/myfinaladminsidebar";
import MyTextArea from "@/components/global/myfinaltextarea";
import FormButtons from "@/components/global/formbuttons";

async function getReview(params) {
	const res = await fetchurl(`/global/comments${params}`, "GET", "no-cache");
	if (!res.success) notFound();
	return res;
}

const UpdateReview = async ({ params, searchParams }) => {
	const awtdParams = await params;
	const awtdSearchParams = await searchParams;
	const token = await getAuthTokenOnServer();
	// const auth = await getUserOnServer();

	const comment = await getReview(`/${awtdParams.id}`);

	const upgradeReview = async (formData) => {
		"use server";
		const rawFormData = {
			title: formData.get("title"),
			text: formData.get("text"),
			status: formData.get("status"),
		};
		await fetchurl(
			`/noadmin/reviews/${awtdParams.id}`,
			"PUT",
			"no-cache",
			rawFormData
		);
		redirect(`/noadmin/reviews`);
	};

	return (
		<form className="row" action={upgradeReview}>
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
					auth={{}}
					token={{}}
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
				/>
				<br />
				<FormButtons />
			</div>
		</form>
	);
};

export default UpdateReview;
