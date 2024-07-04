import {
	fetchurl,
	getAuthTokenOnServer,
	getUserOnServer,
} from "@/helpers/setTokenOnServer";
import { redirect } from "next/navigation";
import AdminSidebar from "@/components/admin/myfinaladminsidebar";
import MyTextArea from "@/components/global/myfinaltextarea";
import FormButtons from "@/components/global/formbuttons";

async function getFiles(params) {
	const res = await fetchurl(`/files${params}`, "GET", "no-cache");
	return res;
}

async function getCategories(params) {
	const res = await fetchurl(`/categories${params}`, "GET", "no-cache");
	return res;
}

const CreateTheme = async ({ params, searchParams }) => {
	const token = await getAuthTokenOnServer();
	const auth = await getUserOnServer();

	const files = await getFiles(`?page=1&limit=100&sort=-createdAt`);
	const categories = await getCategories(`?categoryType=theme`);

	const addTheme = async (formData) => {
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
		await fetchurl(`/themes`, "POST", "no-cache", {
			...rawFormData,
			postType: "theme",
		});
		redirect(`/noadmin/themes`);
	};

	return (
		<form className="row" action={addTheme}>
			<div className="col">
				<label htmlFor="blog-title" className="form-label">
					Title
				</label>
				<input
					id="blog-title"
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
					onModel="Blog"
					advancedTextEditor={true}
					customPlaceholder="No description"
					defaultValue="No description..."
				/>
			</div>
			<div className="col-lg-3">
				<AdminSidebar
					displayCategoryField={true}
					displayAvatar={true}
					// avatar={files?.selected?._id}
					avatarFormat={"image"}
					status="draft"
					fullWidth={true}
					password=""
					featured={true}
					commented={true}
					embedding={true}
					github_readme={"#"}
					category={undefined}
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

export default CreateTheme;
