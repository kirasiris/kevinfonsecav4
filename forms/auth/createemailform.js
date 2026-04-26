"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { fetchurl } from "@/helpers/setTokenOnServer";

const CreateEmailForm = ({ auth = {} }) => {
	const router = useRouter();

	const [btnText, setBtnText] = useState("Submit");

	const addEmail = async (e) => {
		e.preventDefault();
		setBtnText(`Processing`);

		const form = e.target;
		const formData = new FormData(form);

		const rawFormData = {
			email: formData.get("email"),
			website: process.env.NEXT_PUBLIC_WEBSITE_NAME,
		};

		const res = await fetchurl(
			`/auth/emails/add`,
			"PUT",
			"no-cache",
			rawFormData,
			undefined,
			false,
			false,
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
		router.push(`/auth/editsecurity`);
	};

	const resetForm = (e) => {
		e.target.closest("form").reset();
	};

	return (
		<form onSubmit={addEmail}>
			<label htmlFor="email" className="form-label">
				Email
			</label>
			<input
				id="email"
				name="email"
				defaultValue=""
				type="email"
				className="form-control mb-3"
				placeholder="john.doe@demo.com"
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

export default CreateEmailForm;
