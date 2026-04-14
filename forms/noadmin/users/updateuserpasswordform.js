"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { fetchurl } from "@/helpers/setTokenOnServer";
import FormButtons from "@/components/global/formbuttons";

const UpdateUserPasswordForm = ({ object = {} }) => {
	const router = useRouter();

	const [, setBtnText] = useState(`Submit`);

	const upgradeUserPassword = async (e) => {
		e.preventDefault();
		setBtnText("...");
		const form = e.target;
		const formData = new FormData(form);

		const rawFormData = {
			password: formData.get("password"),
			password2: formData.get("password2"),
			website: formData.get("website"),
			registeredFrom: process.env.NEXT_PUBLIC_WEBSITE_NAME,
		};

		if (rawFormData.password !== rawFormData.password2) {
			toast.error(`Passwords do not match`);
			setBtnText("Submit");
			return;
		}

		const res = await fetchurl(
			`/noadmin/users/${object?.data?._id}/updatepassword`,
			"PUT",
			"no-cache",
			{
				...rawFormData,
				website: process.env.NEXT_PUBLIC_WEBSITE_NAME,
			},
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
		toast.success(`User password updated`, "bottom");
		router.push(`/noadmin/users`);
	};

	const resetForm = (e) => {
		e.target.closest("form").reset();
	};

	return (
		<form onSubmit={upgradeUserPassword}>
			<div className="row">
				<div className="col">
					<label htmlFor="password" className="form-label">
						Password
					</label>
					<input
						id="password"
						name="password"
						defaultValue=""
						type="password"
						className="form-control mb-3"
						placeholder="******"
					/>
					<label htmlFor="password2" className="form-label">
						Confirm Password?
					</label>
					<input
						id="password2"
						name="password2"
						defaultValue=""
						type="password"
						className="form-control"
						placeholder="******"
					/>
				</div>
			</div>
			<br />
			<FormButtons />
		</form>
	);
};

export default UpdateUserPasswordForm;
