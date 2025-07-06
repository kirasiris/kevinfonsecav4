import { notFound, redirect } from "next/navigation";
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

async function getTheme(params) {
	const res = await fetchurl(`/global/themes${params}`, "GET", "no-cache");
	if (!res.success) notFound();
	return res;
}

const UpdateTheme = async ({ params, searchParams }) => {
	const awtdParams = await params;
	const awtdSearchParams = await searchParams;
	const token = await getAuthTokenOnServer();
	const auth = await getUserOnServer();

	const theme = await getTheme(`/${awtdParams.id}`);

	const categories = await getCategories(`?categoryType=theme`);

	const upgradeTheme = async (formData) => {
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
			github_readme: formData.get("github_readme"),
			files: { avatar: formData.get("file") },
		};
		await fetchurl(
			`/noadmin/themes/${awtdParams.id}`,
			"PUT",
			"no-cache",
			rawFormData
		);
		redirect(`/noadmin/themes`);
	};

	return (
		<form className="row" action={upgradeTheme}>
			<div className="col">
				<label htmlFor="blog-title" className="form-label">
					Title
				</label>
				<input
					id="blog-title"
					name="title"
					defaultValue={theme?.data?.title}
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
					onModel="Blog"
					advancedTextEditor={true}
					customPlaceholder="No description"
					defaultValue={theme?.data?.text}
				/>
			</div>
			<div className="col-lg-3">
				<AdminSidebar
					displayCategoryField={true}
					displayAvatar={true}
					avatar={theme?.data?.files}
					avatarFormat={theme?.data?.files?.avatar?.format_type}
					status={theme?.data?.status}
					fullWidth={theme?.data?.fullWidth.toString()}
					password=""
					featured={theme?.data?.featured.toString()}
					commented={theme?.data?.commented.toString()}
					embedding={theme?.data?.embedding.toString()}
					github_readme={theme?.data?.github_readme}
					category={theme?.data?.category?._id || theme?.data?.category}
					categories={categories.data}
					multiple_categories={false}
				/>
				<br />
				<FormButtons />
			</div>
		</form>
	);
};

export default UpdateTheme;
