import { notFound, redirect } from "next/navigation";
import {
	fetchurl,
	getAuthTokenOnServer,
	getUserOnServer,
} from "@/helpers/setTokenOnServer";
import AdminSidebar from "@/components/noadmin/myfinaladminsidebar";
import MyTextArea from "@/components/global/myfinaltextarea";
import FormButtons from "@/components/global/formbuttons";

async function getCompany(params) {
	const res = await fetchurl(`/global/companies${params}`, "GET", "no-cache");
	if (!res.success) notFound();
	return res;
}

const UpdateCompany = async ({ params, searchParams }) => {
	const awtdParams = await params;
	const awtdSearchParams = await searchParams;
	const token = await getAuthTokenOnServer();
	const auth = await getUserOnServer();

	const company = await getCompany(`/${awtdParams.id}`);

	const upgradeCompany = async (formData) => {
		"use server";
		const rawFormData = {
			title: formData.get("title"),
			text: formData.get("text"),
			address: formData.get("address"),
			password: formData.get("password"),
			status: formData.get("status"),
			files: { avatar: formData.get("file") },
		};
		await fetchurl(
			`/noadmin/companies/${awtdParams.id}`,
			"PUT",
			"no-cache",
			rawFormData
		);
		redirect("/noadmin/companies");
	};

	return (
		<form className="row" action={upgradeCompany}>
			<div className="col">
				<label htmlFor="blog-title" className="form-label">
					Title
				</label>
				<input
					id="blog-title"
					name="title"
					defaultValue={company?.data?.title}
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
					onModel="Company"
					advancedTextEditor={true}
					customPlaceholder="No description"
					defaultValue={company?.data?.text}
				/>
				<label htmlFor="address" className="form-label">
					Address
				</label>
				<input
					id="address"
					name="address"
					defaultValue={company?.data?.address}
					type="text"
					className="form-control mb-3"
					placeholder=""
				/>
			</div>
			<div className="col-lg-3">
				<AdminSidebar
					displayCategoryField={false}
					displayAvatar={true}
					avatar={company?.data?.files}
					avatarFormat={company?.data?.files?.avatar?.format_type}
					status={company?.data?.status}
					fullWidth={false}
					password={company?.data?.password}
					featured={false}
					commented={false}
					embedding={false}
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

export default UpdateCompany;
