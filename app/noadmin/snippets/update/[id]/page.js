import { fetchurl } from "@/helpers/setTokenOnServer";
import { notFound, redirect } from "next/navigation";
import AdminSidebar from "@/components/admin/myfinaladminsidebar";
import MyTextArea from "@/components/global/myfinaltextarea";
import LiveCode from "@/components/admin/snippets/livecode";
import FormButtons from "@/components/global/formbuttons";

async function getSnippet(params) {
	const res = await fetchurl(`/global/snippets${params}`, "GET", "no-cache");
	if (!res.success) notFound();
	return res;
}

const UpdateSnippet = async ({ params, searchParams }) => {
	const awtdParams = await params;
	const awtdSearchParams = await searchParams;
	const snippet = await getSnippet(`/${awtdParams.id}`);

	const upgradeSnippet = async (formData) => {
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
		await fetchurl(
			`/noadmin/snippets/${awtdParams.id}`,
			"PUT",
			"no-cache",
			rawFormData
		);
		redirect(`/noadmin/snippets`);
	};

	return (
		<form action={upgradeSnippet}>
			<div className="row">
				<div className="col">
					<label htmlFor="blog-title" className="form-label">
						Title
					</label>
					<input
						id="blog-title"
						name="title"
						defaultValue={snippet?.data?.title}
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
						defaultValue={snippet?.data?.text}
					/>
				</div>
				<div className="col-lg-2">
					<AdminSidebar
						displayCategoryField={false}
						displayAvatar={false}
						// avatar={files?.selected?._id}
						avatarFormat={"image"}
						status={snippet?.data?.status}
						fullWidth={false}
						password=""
						featured={snippet?.data?.featured.toString()}
						commented={snippet?.data?.commented.toString()}
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
						title={snippet?.data?.title}
						MyHtml={snippet?.data?.code?.html}
						MyCss={snippet?.data?.code?.css}
						MyJs={snippet?.data?.code?.javascript}
						hasId={true}
					/>
				</div>
			</div>
		</form>
	);
};

export default UpdateSnippet;
