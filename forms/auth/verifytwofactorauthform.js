"use client";
import { useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { toast } from "react-toastify";
import { fetchurl } from "@/helpers/setTokenOnServer";

const VerifyTwoFactorAuthenticationForm = ({ auth = {} }) => {
	const router = useRouter();
	const awtdParams = useParams();
	const awtdSearchParams = useSearchParams();

	const [displayToken, setDisplayToken] = useState("");
	const [displayText, setDisplayText] = useState(false);

	const [btnText, setBtnText] = useState("Submit");

	const verifyTFA = async (e) => {
		e.preventDefault();
		setBtnText(`Processing`);

		const form = e.target;
		const formData = new FormData(form);

		const rawFormData = {
			token: formData.get("token"),
		};

		if (!rawFormData.token) {
			toast.error("Token cannot be empty", "bottom");
			return;
		}

		const res = await fetchurl(
			`/auth/2fa/verify/${auth?.data?._id}`,
			"PUT",
			"no-cache",
			{ ...rawFormData, website: "beFree" },
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
		setDisplayText(true);
		setDisplayToken(res?.data);
		setBtnText("Submit");
		resetForm();
	};

	const resetForm = (e) => {
		e.target.closest("form").reset();
	};

	return (
		<form onSubmit={verifyTFA}>
			<div className="form-group">
				<label htmlFor="token" className="form-label">
					Token
				</label>
				<div className="input-group">
					<input
						id="token"
						name="token"
						defaultValue=""
						type="text"
						className="form-control mb-3"
						required
						placeholder="012 345"
					/>
				</div>
			</div>
			{displayText && (
				<>
					<p>
						Please keep this code in a safe but accessible area. This is your{" "}
						<b>BACKUP</b> code:
						<br />
						<code>{displayToken}</code>
						<hr />
						<b>You can now close this window</b>
					</p>
				</>
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

export default VerifyTwoFactorAuthenticationForm;
