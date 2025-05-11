import { fetchurl } from "@/helpers/setTokenOnServer";
import { redirect } from "next/navigation";
import AdminSidebar from "@/components/admin/myfinaladminsidebar";
import MyTextArea from "@/components/global/myfinaltextarea";
import FormButtons from "@/components/global/formbuttons";

const CreateMenu = async ({ params, searchParams }) => {
	const addMenu = async (formData) => {
		"use server";
		const rawFormData = {
			title: formData.get("title"),
			text: formData.get("text"),
			position: formData.getAll("position"),
			status: formData.get("status"),
		};
		await fetchurl(`/noadmin/menus`, "POST", "no-cache", rawFormData);
		redirect(`/noadmin/menus`);
	};

	return (
		<form className="row" action={addMenu}>
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
					onModel="Menu"
					advancedTextEditor={false}
					customPlaceholder="No description"
					defaultValue="No description..."
				/>
				<label htmlFor="position" className="form-label">
					Position
				</label>
				<select
					id="position"
					name="position"
					defaultValue="top"
					className="form-control"
					multiple
				>
					<option value={`top`}>Top</option>
					<option value={`bottom`}>Bottom</option>
				</select>
			</div>
			<div className="col-lg-3">
				<AdminSidebar
					displayCategoryField={false}
					displayAvatar={false}
					avatar={""}
					avatarFormat={""}
					status="draft"
					fullWidth={false}
					password={""}
					featured={false}
					commented={false}
					embedding={false}
					github_readme={""}
					category={undefined}
					categories={[]}
					multiple_categories={false}
					multipleFiles={false}
					onModel={"Menu"}
					files={[]}
					auth={undefined}
					token={undefined}
				/>
				<br />
				<FormButtons />
			</div>
		</form>
	);
};

export default CreateMenu;
