"use client";
import { useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { toast } from "react-toastify";
import {
	fetchurl,
	setAuthTokenOnServer,
	setUserOnServer,
} from "@/helpers/setTokenOnServer";

const LoginForm = () => {
	const router = useRouter();
	const awtdParams = useParams();
	const awtdSearchParams = useSearchParams();

	const [btnText, setBtnText] = useState("Submit");

	const loginAccount = async (e) => {
		e.preventDefault();
		setBtnText(`Processing`);

		const form = e.target;
		const formData = new FormData(form);

		const rawFormData = {
			email: formData.get("email"),
			password: formData.get("password"),
			captcha: formData.get("captcha"),
		};

		if (rawFormData.captcha !== "5") {
			toast.error("There was an error, try again");
			setBtnText("Submit");
			return;
		}

		const res = await fetchurl(
			`/auth/login`,
			"POST",
			"no-cache",
			{
				...rawFormData,
				website: "beFree",
			},
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
		if (res?.data) {
			toast.info("Please enter your 2FA token", "bottom");
			router.push(`/auth/validatetwofactorauth/${res?.data?._id}`);
		}

		// Else continue,
		// furthermore, setAuthTokenOnServer needs to be prior to setUserOnServer
		await setAuthTokenOnServer(res?.token);

		const loadUser = await fetchurl(`/auth/me`, "GET", "default");

		await setUserOnServer(await loadUser?.data);

		let returnpage = awtdSearchParams.get("returnpage");

		// Ensure returnpage is only modified if it points to armedcodellc.com
		if (returnpage) {
			try {
				const returnUrl = new URL(returnpage);
				if (returnUrl.hostname === "armedcodellc.com") {
					returnpage += `?xAuthToken=${res?.token}`;
				}
			} catch (err) {
				toast.error(`Invalid return URL: ${err}`, "bottom");
			}
		}

		router.push(returnpage || `/auth/profile`);
	};

	const resetForm = (e) => {
		e.target.closest("form").reset();
	};

	return (
		<form onSubmit={loginAccount}>
			<label htmlFor="email" className="form-label">
				Email
			</label>
			<input
				id="email"
				name="email"
				defaultValue=""
				type="email"
				className="form-control mb-3"
				required
				placeholder="john@doe.com"
			/>
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
			<label htmlFor="captcha" className="form-label">
				Captcha: 3+2?
			</label>
			<input
				id="captcha"
				name="captcha"
				defaultValue=""
				type="number"
				className="form-control mb-3"
				required
				placeholder="0"
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

export default LoginForm;
