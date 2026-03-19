"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { fetchurl } from "@/helpers/setTokenOnServer";

const CreateUserForm = ({ object = {} }) => {
	const router = useRouter();

	const [btnText, setBtnText] = useState("Submit");

	const registerAccount = async (e) => {
		e.preventDefault();
		setBtnText(`Processing`);

		const form = e.target;
		const formData = new FormData(form);

		const rawFormData = {
			username: object.email.split("@")[0],
			name: object.name,
			email: object.email,
			password: formData.get("password"),
			password2: formData.get("password2"),
		};

		if (rawFormData.captcha !== "5") {
			toast.error("There was an error, try again");
			setBtnText("Submit");
			return;
		}

		if (rawFormData.password !== rawFormData.password2) {
			toast.error(`Passwords do not match`);
			return;
		}

		const res = await fetchurl(
			`/noadmin/weaponacquisitiondisposal/${object._id}/createuseraccount`,
			"POST",
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
		setBtnText("Submit");
		toast.success("Account registered", "bottom");
		router.push(`/nfabusiness/acquisitionsdisposals/read/${object._id}`);
	};

	const resetForm = (e) => {
		e.target.closest("form").reset();
	};

	return (
		<form onSubmit={registerAccount}>
			<h1>Create&nbsp;account</h1>
			<p>This&nbsp;account&nbsp;will&nbsp;be&nbsp;under&nbsp;{object.name}</p>
			<p>
				Furthermore,&nbsp;the&nbsp;following&nbsp;email&nbsp;will&nbsp;be&nbsp;used&nbsp;
				{object.email}&nbsp;also
			</p>
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
				Confirm Password
			</label>
			<input
				id="password2"
				name="password2"
				defaultValue=""
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

export default CreateUserForm;
