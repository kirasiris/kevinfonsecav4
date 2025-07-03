"use client";
import { useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { toast } from "react-toastify";
import {
	fetchurl,
	setAuthTokenOnServer,
	setUserOnServer,
} from "@/helpers/setTokenOnServer";

const ValidateTwoFactorAuthenticationForm = () => {
	const router = useRouter();
	const awtdParams = useParams();
	const awtdSearchParams = useSearchParams();

	const [btnText, setBtnText] = useState("Submit");

	const validateTwoFactorAuthToken = async (e) => {
		e.preventDefault();
		setBtnText(`Processing`);

		const form = e.target;
		const formData = new FormData(form);

		const rawFormData = {
			token: formData.get("token"),
		};

		const userid = awtdParams.userid;

		if (!userid) {
			toast.error("There was an error, please try again", "bottom");
			router.push(`/auth/login`);
		}

		const res = await fetchurl(
			`/auth/2fa/validate/${userid}`,
			"POST",
			"no-cache",
			rawFormData,
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

		// Else continue,
		// furthermore, setAuthTokenOnServer needs to be prior to setUserOnServer
		await setAuthTokenOnServer(res?.token);

		const loadUser = await fetchurl(`/auth/me`, "GET", "default");

		await setUserOnServer(await loadUser?.data);

		router.push(`/auth/profile`);
	};

	const resetForm = (e) => {
		e.target.closest("form").reset();
	};

	return (
		<form onSubmit={validateTwoFactorAuthToken}>
			<label htmlFor="token" className="form-label">
				Token
			</label>
			<input
				id="token"
				name="token"
				type="text"
				className="form-control mb-3"
				required
				placeholder="012 345"
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

export default ValidateTwoFactorAuthenticationForm;
