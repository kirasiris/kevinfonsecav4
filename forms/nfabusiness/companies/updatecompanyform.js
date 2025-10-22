"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { fetchurl } from "@/helpers/setTokenOnServer";
import AdminSidebar from "@/components/noadmin/myfinaladminsidebar";
import MyTextArea from "@/components/global/myfinaltextarea";
import FormButtons from "@/components/global/formbuttons";

const UpdateCompanyForm = ({ token = {}, auth = {}, object = {} }) => {
	const router = useRouter();

	const [btnText, setBtnText] = useState(`Submit`);

	const upgradeCompany = async (e) => {
		e.preventDefault();
		setBtnText("...");
		const form = e.target;
		const formData = new FormData(form);

		const rawFormData = {
			title: formData.get("title"),
			text: formData.get("text"),
			website: formData.get("website"),
			email: formData.get("email"),
			phoneNumber: formData.get("phoneNumber"),
			address: formData.get("address"),
			password: formData.get("password"),
			status: formData.get("status"),
			files: { avatar: formData.get("file") || undefined },
		};

		const res = await fetchurl(
			`/noadmin/companies/${object?.data?._id}`,
			"PUT",
			"no-cache",
			rawFormData
		);

		if (res.status === "error") {
			toast.error(res.message, "bottom");
			setBtnText("Submit");
			return;
		}
		if (res.status === "fail") {
			toast.error(res.message, "bottom");
			setBtnText("Submit");
			return;
		}
		toast.success(`Company updated`, "bottom");
		router.push(`/nfabusiness/companies`);
	};

	const resetForm = (e) => {
		e.target.closest("form").reset();
	};

	return (
		<form className="row" onSubmit={upgradeCompany}>
			<div className="col">
				<label htmlFor="title" className="form-label">
					Title
				</label>
				<input
					id="title"
					name="title"
					defaultValue={object?.data?.title}
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
					defaultValue={object?.data?.text}
					onModel="Company"
					advancedTextEditor={true}
					customPlaceholder="No description"
				/>
				<div className="row">
					<div className="col">
						<label htmlFor="website" className="form-label">
							Website
						</label>
						<input
							id="website"
							name="website"
							defaultValue={object?.data?.website}
							type="text"
							className="form-control mb-3"
							placeholder="https://demo.com"
						/>
					</div>
					<div className="col">
						<label htmlFor="email" className="form-label">
							Email
						</label>
						<input
							id="email"
							name="email"
							defaultValue={object?.data?.email}
							type="email"
							className="form-control mb-3"
							placeholder="john@doe.com"
						/>
					</div>
					<div className="col">
						<label htmlFor="phoneNumber" className="form-label">
							Phone Number
						</label>
						<input
							id="phoneNumber"
							name="phoneNumber"
							defaultValue={object?.data?.phoneNumber}
							type="tel"
							className="form-control mb-3"
							placeholder="012-345-6789"
						/>
					</div>
				</div>
				<label htmlFor="address" className="form-label">
					Address
				</label>
				<input
					id="address"
					name="address"
					defaultValue={object?.data?.address}
					type="text"
					className="form-control mb-3"
					placeholder=""
				/>
			</div>
			<div className="col-lg-3">
				<AdminSidebar
					displayCategoryField={false}
					displayAvatar={true}
					avatar={object?.data?.files}
					avatarFormat={object?.data?.files?.avatar?.format_type}
					status={object?.data?.status}
					fullWidth={false}
					password={object?.data?.password}
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

export default UpdateCompanyForm;
