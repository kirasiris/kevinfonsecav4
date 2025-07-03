"use client";
import { useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { toast } from "react-toastify";
import { fetchurl } from "@/helpers/setTokenOnServer";

const ResetPasswordForm = () => {
	const router = useRouter();
	const awtdParams = useParams();
	const awtdSearchParams = useSearchParams();

	const [btnText, setBtnText] = useState("Submit");

	const resetPasswordAccount = async (e) => {
		e.preventDefault();
		setBtnText(`Processing`);

		const form = e.target;
		const formData = new FormData(form);

		const rawFormData = {
			password: formData.get("password"),
			password2: formData.get("password2"),
		};

		const userid = awtdParams.userid;
		const resettoken = awtdParams.resettoken;

		if (!userid || !resettoken) {
			toast.error("There was an error, please try again", "bottom");
		}

		if (rawFormData.password !== rawFormData.password2) {
			toast.error(`Passwords do not match`);
			return;
		}

		const res = await fetchurl(
			`/auth/resetpassword/${userid}/${resettoken}`,
			"PUT",
			"no-cache",
			{
				...rawFormData,
				website: "beFree",
			}
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
		toast.success("Password has been updated", "bottom");
		let returnpage = awtdSearchParams.returnpage;
		router.push(returnpage || `/auth/login`);
	};

	const resetForm = (e) => {
		e.target.closest("form").reset();
	};

	return (
		<form onSubmit={resetPasswordAccount}>
			<label htmlFor="password" className="form-label">
				Password
			</label>
			<input
				id="password"
				name="password"
				type="password"
				className="form-control mb-3"
				required
				placeholder="******"
				defaultValue=""
			/>
			<label htmlFor="password2" className="form-label">
				Confirm Password
			</label>
			<input
				id="password2"
				name="password2"
				type="password"
				className="form-control mb-3"
				required
				placeholder="******"
				defaultValue=""
			/>
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

export default ResetPasswordForm;
