"use client";
import { useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { toast } from "react-toastify";
import { fetchurl } from "@/helpers/setTokenOnServer";

const UpdatePasswordForm = ({ auth = {} }) => {
	const router = useRouter();
	const awtdParams = useParams();
	const awtdSearchParams = useSearchParams();

	const [btnText, setBtnText] = useState("Submit");

	const upgradePassword = async (e) => {
		e.preventDefault();
		setBtnText(`Processing`);

		const form = e.target;
		const formData = new FormData(form);

		const rawFormData = {
			currentpassword: formData.get("currentpassword"),
			newpassword: formData.get("newpassword"),
			newpassword2: formData.get("newpassword2"),
			token: formData.get("token"),
		};

		const res = await fetchurl(
			`/auth/updatepassword`,
			"PUT",
			"no-cache",
			{ ...rawFormData, website: "beFree" },
			undefined,
			false,
			false
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
		toast.success("Account has been updated", "bottom");
		router.push(`/auth/profile`);
	};

	const resetForm = (e) => {
		e.target.closest("form").reset();
	};

	return (
		<form onSubmit={upgradePassword}>
			<label htmlFor="currentpassword" className="form-label">
				Current&nbsp;Password
			</label>
			<input
				id="currentpassword"
				name="currentpassword"
				type="password"
				className="form-control mb-3"
			/>
			<label htmlFor="newpassword" className="form-label">
				New&nbsp;Password
			</label>
			<input
				id="newpassword"
				name="newpassword"
				type="password"
				className="form-control mb-3"
			/>
			<label htmlFor="newpassword2" className="form-label">
				Confirm&nbsp;Password
			</label>
			<input
				id="newpassword2"
				name="newpassword2"
				type="password"
				className="form-control mb-3"
			/>
			{auth.data.twoFactorTokenEnabled && (
				<div className="form-group">
					<label htmlFor="token" className="form-label">
						Token
					</label>
					<div className="input-group">
						<input
							id="token"
							name="token"
							type="text"
							className="form-control mb-3"
							required
							placeholder="012 345"
						/>
					</div>
				</div>
			)}
			<button type="submit" className="btn btn-secondary btn-sm float-start">
				{btnText}
			</button>
			<button
				type="reset"
				onClick={resetForm}
				className="btn btn-secondary btn-sm float-end"
			>
				Reset
			</button>
		</form>
	);
};

export default UpdatePasswordForm;
