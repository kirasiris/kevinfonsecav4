"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { fetchurl } from "@/helpers/setTokenOnServer";
import MyTextArea from "@/components/global/myfinaltextarea";
import FormButtons from "@/components/global/formbuttons";

const UpdateCertificateForm = ({
	token = {},
	auth = {},
	object = {},
	params = {},
}) => {
	const router = useRouter();

	console.log("Object", params);

	const [btnText, setBtnText] = useState(`Submit`);

	const upgradeCertificate = async (e) => {
		e.preventDefault();
		setBtnText("...");
		const form = e.target;
		const formData = new FormData(form);

		const rawFormData = {
			name: formData.get("name"),
			organization: formData.get("organization"),
			from: formData.get("from"),
			to: formData.get("to"),
			current: formData.get("current"),
			credentialId: formData.get("credentialId"),
			credentialURL: formData.get("credentialURL"),
			text: formData.get("text"),
		};

		const res = await fetchurl(
			`/noadmin/companies/${params.id}/certificates/${object?.data?._id}`,
			"PUT",
			"no-cache",
			rawFormData,
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
		toast.success(`Certificate updated`, "bottom");
		router.push(`/nfabusiness/companies/read/${params.id}`);
	};

	const resetForm = (e) => {
		e.target.closest("form").reset();
	};

	return (
		<form onSubmit={upgradeCertificate}>
			<div className="row">
				<div className="col">
					<label htmlFor="name" className="form-label">
						Name
					</label>
					<input
						id="name"
						name="name"
						defaultValue={object?.data?.name}
						type="text"
						className="form-control mb-3"
						placeholder=""
					/>
				</div>
				<div className="col">
					<label htmlFor="organization" className="form-label">
						Organization
					</label>
					<input
						id="organization"
						name="organization"
						defaultValue={object?.data?.organization}
						type="text"
						className="form-control mb-3"
						placeholder=""
					/>
				</div>
			</div>
			<div className="row">
				<div className="col">
					<label htmlFor="from" className="form-label">
						From
					</label>
					<input
						id="from"
						name="from"
						defaultValue={
							object?.data?.from
								? new Date(object.data.from).toLocaleDateString("en-CA", {
										timeZone: "UTC",
									})
								: ""
						}
						type="date"
						className="form-control mb-3"
						placeholder=""
					/>
				</div>
				<div className="col">
					<label htmlFor="to" className="form-label">
						To
					</label>
					<input
						id="to"
						name="to"
						defaultValue={
							object?.data?.to
								? new Date(object.data.to).toLocaleDateString("en-CA", {
										timeZone: "UTC",
									})
								: ""
						}
						type="date"
						className="form-control mb-3"
						placeholder=""
					/>
				</div>
				<div className="col-lg-12">
					<label htmlFor="current" className="form-label">
						Is it current?
					</label>
					<select
						id="current"
						name="current"
						defaultValue={object?.data?.current.toString()}
						className="form-control mb-3"
					>
						<option value={true}>Yes</option>
						<option value={false}>No</option>
					</select>
				</div>
			</div>
			<div className="row">
				<div className="col">
					<label htmlFor="credentialId" className="form-label">
						Credential ID
					</label>
					<input
						id="credentialId"
						name="credentialId"
						defaultValue={object?.data?.credentialId}
						type="text"
						className="form-control mb-3"
						placeholder=""
					/>
				</div>
				<div className="col">
					<label htmlFor="credentialURL" className="form-label">
						Credential URL
					</label>
					<input
						id="credentialURL"
						name="credentialURL"
						defaultValue={object?.data?.credentialURL}
						type="text"
						className="form-control mb-3"
						placeholder=""
					/>
				</div>
				<div className="col-lg-12">
					<label htmlFor="text" className="form-label">
						Text
					</label>
					<MyTextArea
						auth={auth}
						token={token}
						id="text"
						name="text"
						defaultValue={object?.data?.text}
						onModel="Job"
						advancedTextEditor={true}
						customPlaceholder="No description"
						charactersLimit={99999}
						isRequired={false}
					/>
				</div>
			</div>
			<FormButtons />
		</form>
	);
};

export default UpdateCertificateForm;
