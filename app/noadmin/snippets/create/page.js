import { fetchurl } from "@/helpers/setTokenOnServer";
import { redirect } from "next/navigation";
import AdminSidebar from "@/components/admin/myfinaladminsidebar";
import MyTextArea from "@/components/global/myfinaltextarea";
import LiveCode from "@/components/admin/snippets/livecode";
import FormButtons from "@/components/global/formbuttons";

const CreateSnippet = async ({ params, searchParams }) => {
	const addSnippet = async (formData) => {
		"use server";
		const rawFormData = {
			title: formData.get("title"),
			text: formData.get("text"),
			html: formData.get("html"),
			css: formData.get("css"),
			js: formData.get("js"),
			featured: formData.get("featured"),
			commented: formData.get("commented"),
			status: formData.get("status"),
		};
		await fetchurl(`/snippets`, "POST", "no-cache", rawFormData);
		redirect(`/noadmin/snippets`);
	};

	return (
		<form action={addSnippet}>
			<div className="row">
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
						auth={undefined}
						token={undefined}
						id="text"
						name="text"
						onModel="Snippet"
						advancedTextEditor={false}
						customPlaceholder="No description"
						defaultValue="No description..."
					/>
				</div>
				<div className="col-lg-2">
					<AdminSidebar
						displayCategoryField={false}
						displayAvatar={false}
						// avatar={files?.selected?._id}
						avatarFormat={"image"}
						status="draft"
						fullWidth={false}
						password=""
						featured={true}
						commented={true}
						embedding={false}
						github_readme={""}
						category={undefined}
						categories={[]}
						multiple_categories={false}
						multipleFiles={false}
						onModel={"Snippet"}
						// files={files}
						files={[]}
						auth={undefined}
						token={undefined}
					/>
					<br />
					<FormButtons />
				</div>
				<div className="mt-3 mb-3" />
				<div className="col-lg-12">
					<LiveCode
						title="Untitled"
						MyHtml="<h1>Titulo</h1>"
						MyCss="cuerpo {}"
						MyJs="console.log('This example contains external urls from Bootstrap!');"
						hasId={false}
					/>
				</div>
			</div>
		</form>
	);
};

export default CreateSnippet;
