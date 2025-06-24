"use client";
import { useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { toast } from "react-toastify";
import { fetchurl } from "@/helpers/setTokenOnServer";

const RegisterForm = () => {
	const router = useRouter();
	const awtdParams = useParams();
	const awtdSearchParams = useSearchParams();

	const [rawFormData, setRawFormData] = useState({
		username: ``,
		name: ``,
		email: ``,
		password: ``,
		password2: ``,
	});

	const { username, name, email, password, password2 } = rawFormData;

	const [btnText, setBtnText] = useState("Submit");

	const registerAccount = async (e) => {
		e.preventDefault();
		if (rawFormData.password !== rawFormData.password2) {
			toast.error(`Passwords do not match`);
			return;
		}
		setBtnText(`Processing`);
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
		resetForm();
		// router.push(`/auth/login`);
	};

	const resetForm = () => {
		setRawFormData({
			username: ``,
			name: ``,
			email: ``,
			password: ``,
			password2: ``,
		});
	};

	return (
		<form onSubmit={registerAccount}>
			<label htmlFor="username" className="form-label">
				Username
			</label>
			<input
				id="username"
				name="username"
				value={username}
				onChange={(e) => {
					setRawFormData({
						...rawFormData,
						username: e.target.value,
					});
				}}
				type="text"
				className="form-control mb-3"
				required
				placeholder="john.doe"
			/>
			<label htmlFor="name" className="form-label">
				Name
			</label>
			<input
				id="name"
				name="name"
				value={name}
				onChange={(e) => {
					setRawFormData({
						...rawFormData,
						name: e.target.value,
					});
				}}
				type="text"
				className="form-control mb-3"
				placeholder="john@doe.com"
			/>
			<label htmlFor="email" className="form-label">
				Email
			</label>
			<input
				id="email"
				name="email"
				value={email}
				onChange={(e) => {
					setRawFormData({
						...rawFormData,
						email: e.target.value,
					});
				}}
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
				value={password}
				onChange={(e) => {
					setRawFormData({
						...rawFormData,
						password: e.target.value,
					});
				}}
				type="password"
				className="form-control mb-3"
				placeholder="******"
			/>
			<label htmlFor="password2" className="form-label">
				Confirm Password
			</label>
			<input
				id="password2"
				name="password2"
				value={password2}
				onChange={(e) => {
					setRawFormData({
						...rawFormData,
						password2: e.target.value,
					});
				}}
				type="password"
				className="form-control mb-3"
				placeholder="******"
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
