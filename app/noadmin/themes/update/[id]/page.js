import { fetchurl, getAuthTokenOnServer } from "@/helpers/setTokenOnServer";
import { redirect } from "next/navigation";
import AdminSidebar from "@/components/admin/myfinaladminsidebar";
import MyTextArea from "@/components/global/myfinaltextarea";
import FormButtons from "@/components/global/formbuttons";

async function getAuthenticatedUser() {
	const res = await fetchurl(`/auth/me`, "GET", "force-cache");
	return res;
}

async function getFiles(params) {
	const res = await fetchurl(`/files${params}`, "GET", "no-cache");
	return res;
}

async function getCategories(params) {
	const res = await fetchurl(`/categories${params}`, "GET", "no-cache");
	return res;
}

async function getTheme(params) {
	const res = await fetchurl(`/themes${params}`, "GET", "no-cache");
	return res;
}

const UpdateTheme = async ({ params, searchParams }) => {
	const theme = await getTheme(`/${params.id}`);

	const token = await getAuthTokenOnServer();
	const auth = await getAuthenticatedUser();
	const files = await getFiles(`?page=1&limit=100&sort=-createdAt`);
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
		await fetchurl(`/themes/${params.id}`, "PUT", "no-cache", rawFormData);
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
					avatar={theme?.data?.files?.avatar}
					status={theme?.data?.status}
					fullWidth={theme?.data?.fullWidth.toString()}
					password=""
					featured={theme?.data?.featured.toString()}
					commented={theme?.data?.commented.toString()}
					embedding={theme?.data?.embedding.toString()}
					github_readme={theme?.data?.github_readme}
					category={theme?.data?.category?._id || theme?.data?.category}
					categories={categories.data}
					multipleFiles={false}
					onModel={"Blog"}
					files={files}
					auth={auth}
					token={token}
				/>
				<br />
				<FormButtons />
			</div>
		</form>
	);
};

export default UpdateTheme;
