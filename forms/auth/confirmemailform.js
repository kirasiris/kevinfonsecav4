"use client";
import { useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { toast } from "react-toastify";
import { fetchurl } from "@/helpers/setTokenOnServer";

const ConfirmEmailForm = () => {
	const router = useRouter();
	const awtdParams = useParams();
	const awtdSearchParams = useSearchParams();

	const [btnText, setBtnText] = useState("Submit");

	const confirmAccount = async (e) => {
		e.preventDefault();
		setBtnText(`Processing`);

		const form = e.target;
		const formData = new FormData(form);

		const rawFormData = {
			email: formData.get("email"),
		};

		const confirmtoken = awtdParams.confirmtoken;

		if (!confirmtoken) {
			toast.error("There was an error, please try again", "bottom");
			router.push("/auth/login");
		}

		const res = await fetchurl(
			`/auth/confirmemail`,
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
		setBtnText("Submit");
		toast.success("Account confirmed", "bottom");
		resetForm();
		router.push(`/auth/login`);
	};

	const resetForm = () => {
		e.target.closest("form").reset();
	};

	return (
		<form onSubmit={confirmAccount}>
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

export default ConfirmEmailForm;
