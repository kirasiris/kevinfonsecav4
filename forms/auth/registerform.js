"use client";
import { useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { toast } from "react-toastify";
import { fetchurl } from "@/helpers/setTokenOnServer";

const RegisterForm = () => {
	const router = useRouter();
	const awtdParams = useParams();
	const awtdSearchParams = useSearchParams();

	const [btnText, setBtnText] = useState("Submit");

	const registerAccount = async (e) => {
		e.preventDefault();
		setBtnText(`Processing`);

		const form = e.target;
		const formData = new FormData(form);

		const rawFormData = {
			username: formData.get("username"),
			name: formData.get("name"),
			email: formData.get("email"),
			password: formData.get("password"),
			password2: formData.get("password2"),
		};

		if (rawFormData.password !== rawFormData.password2) {
			toast.error(`Passwords do not match`);
			return;
		}

		const res = await fetchurl(`/auth/register`, "POST", "no-cache", {
			...rawFormData,
			website: "beFree",
		});
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
		setBtnText("Submit");
		toast.success("Account registered", "bottom");
		toast.success(
			`An email has been sent to ${rawFormData.email}. Please verify account`
		);
		router.push(`/auth/login`);
	};

	const resetForm = () => {
		e.target.closest("form").reset();
	};

	return (
		<form onSubmit={registerAccount}>
			<label htmlFor="username" className="form-label">
				Username
			</label>
			<input
				id="username"
				name="username"
				type="text"
				className="form-control mb-3"
				required
				placeholder="john.doe"
				defaultValue=""
			/>
			<label htmlFor="name" className="form-label">
				Name
			</label>
			<input
				id="name"
				name="name"
				type="text"
				className="form-control mb-3"
				placeholder="John Doe"
				defaultValue=""
			/>
			<label htmlFor="email" className="form-label">
				Email
			</label>
			<input
				id="email"
				name="email"
				type="email"
				className="form-control mb-3"
				required
				placeholder="john@doe.com"
				defaultValue=""
			/>
			<label htmlFor="password" className="form-label">
				Password
			</label>
			<input
				id="password"
				name="password"
				type="password"
				className="form-control mb-3"
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

export default RegisterForm;
