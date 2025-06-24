"use client";
import { useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { toast } from "react-toastify";
import { fetchurl } from "@/helpers/setTokenOnServer";

const RecoverForm = () => {
	const router = useRouter();
	const awtdParams = useParams();
	const awtdSearchParams = useSearchParams();

	// const [rawFormData, setRawFormData] = useState({
	// 	email: ``,
	// });

	const [btnText, setBtnText] = useState("Submit");
	// const { email } = rawFormData;

	const recoverAccount = async (e) => {
		e.preventDefault();
		setBtnText(`Processing`);

		const form = e.target;
		const formData = new FormData(form);

		const rawFormData = {
			email: formData.get("email"),
		};

		const res = await fetchurl(`/auth/forgotpassword`, "POST", "no-cache", {
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
		toast.success(
			`An email has been sent to ${rawFormData.email} associated with this account`,
			"bottom"
		);
		let returnpage = awtdSearchParams.returnpage;
		router.push(returnpage || `/auth/profile`);
	};

	const resetForm = () => {
		e.target.closest("form").reset();
		// setRawFormData({
		// 	email: ``,
		// });
	};

	return (
		<form onSubmit={recoverAccount}>
			<label htmlFor="email" className="form-label">
				Email
			</label>
			<input
				id="email"
				name="email"
				// value={email}
				// onChange={(e) => {
				// 	setRawFormData({
				// 		...rawFormData,
				// 		email: e.target.value,
				// 	});
				// }}
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

export default RecoverForm;
