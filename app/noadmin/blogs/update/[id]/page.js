import { redirect } from "next/navigation";
import {
	fetchurl,
	getAuthTokenOnServer,
	getUserOnServer,
} from "@/helpers/setTokenOnServer";
import AdminSidebar from "@/components/noadmin/myfinaladminsidebar";
import MyTextArea from "@/components/global/myfinaltextarea";
import FormButtons from "@/components/global/formbuttons";

async function getCategories(params) {
	const res = await fetchurl(`/global/categories${params}`, "GET", "no-cache");
	return res;
}

async function getBlog(params) {
	const res = await fetchurl(`/global/blogs${params}`, "GET", "no-cache");
	return res;
}

const UpdateBlog = async ({ params, searchParams }) => {
	const awtdParams = await params;
	const awtdSearchParams = await searchParams;
	const token = await getAuthTokenOnServer();
	const auth = await getUserOnServer();

	const blog = await getBlog(`/${awtdParams.id}`);

	const categories = await getCategories(`?categoryType=blog`);

	const upgradeBlog = async (formData) => {
		"use server";
		const rawFormData = {
			title: formData.get("title"),
			text: formData.get("text"),
			featured: formData.get("featured"),
			embedding: formData.get("embedding"),
			category: formData.get("category"),
			commented: formData.get("commented"),
			password: formData.get("password"),
			status: formData.get("status"),
			fullWidth: formData.get("fullWidth"),
			files: { avatar: formData.get("file") },
		};
		await fetchurl(
			`/noadmin/blogs/${awtdParams.id}`,
			"PUT",
			"no-cache",
			rawFormData
		);
		redirect(`/noadmin/blogs`);
	};

	return (
		<form className="row" action={upgradeBlog}>
			<div className="col">
				<label htmlFor="blog-title" className="form-label">
					Title
				</label>
				<input
					id="blog-title"
					name="title"
					defaultValue={blog?.data?.title}
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
					defaultValue={blog?.data?.text}
					onModel="Blog"
					advancedTextEditor={true}
					customPlaceholder="No description"
				/>
			</div>
			<div className="col-lg-3">
				<AdminSidebar
					displayCategoryField={true}
					displayAvatar={true}
					avatar={blog?.data?.files}
					avatarFormat={blog?.data?.files?.avatar?.format_type}
					status={blog?.data?.status}
					fullWidth={blog?.data?.fullWidth.toString()}
					password=""
					featured={blog?.data?.featured.toString()}
					commented={blog?.data?.commented.toString()}
					embedding={blog?.data?.embedding.toString()}
					github_readme={""}
					category={blog?.data?.category?._id || blog?.data?.category}
					categories={categories.data}
					multiple_categories={false}
				/>
				<br />
				<FormButtons />
			</div>
		</form>
	);
};

export default UpdateBlog;
