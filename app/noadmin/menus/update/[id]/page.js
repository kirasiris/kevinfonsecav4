import { fetchurl } from "@/helpers/setTokenOnServer";
import { redirect } from "next/navigation";
import AdminSidebar from "@/components/admin/myfinaladminsidebar";
import MyTextArea from "@/components/global/myfinaltextarea";
import FormButtons from "@/components/global/formbuttons";

async function getMenu(params) {
	const res = await fetchurl(`/menus${params}`, "GET", "no-cache");
	return res;
}

const UpdateMenu = async ({ params, searchParams }) => {
	const menu = await getMenu(`/${params.id}`);

	const upgradeMenu = async (formData) => {
		"use server";
		const rawFormData = {
			title: formData.get("title"),
			text: formData.get("text"),
			position: formData.get("position"),
			status: formData.get("status"),
		};
		await fetchurl(`/menus/${params.id}`, "PUT", "no-cache", rawFormData);
		redirect(`/noadmin/menus`);
	};

	return (
		<form className="row" action={upgradeMenu}>
			<div className="col">
				<label htmlFor="menu-title" className="form-label">
					Title
				</label>
				<input
					id="menu-title"
					name="title"
					defaultValue={menu?.data?.title}
					type="text"
					className="form-control mb-3"
					placeholder=""
				/>
				<label htmlFor="text" className="form-label">
					Text
				</label>
				<MyTextArea
					auth={undefined}
					id="text"
					name="text"
					onModel="Menu"
					advancedTextEditor={false}
					customPlaceholder="No description"
					defaultValue={menu?.data?.text}
				/>
				<label htmlFor="position" className="form-label">
					Position
				</label>
				<select
					id="position"
					name="position"
					defaultValue={menu?.data?.position}
					className="form-control"
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
					status={menu?.data?.status}
					fullWidth={false}
					password={""}
					featured={false}
					commented={false}
					embedding={false}
					github_readme={""}
					category={undefined}
					categories={[]}
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

export default UpdateMenu;
