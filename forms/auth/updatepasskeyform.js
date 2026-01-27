"use client";
import { useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { toast } from "react-toastify";
import { fetchurl } from "@/helpers/setTokenOnServer";
import { startRegistration } from "@simplewebauthn/browser";

const UpdatePasskeyForm = ({ auth = {} }) => {
	const router = useRouter();
	const awtdParams = useParams();
	const awtdSearchParams = useSearchParams();

	const [btnText, setBtnText] = useState("Submit");

	const upgradePasskey = async (e) => {
		e.preventDefault();
		setBtnText(`Processing`);

		// const form = e.target;
		// const formData = new FormData(form);

		const res = await fetchurl(
			`/auth/2fa/passkey/enable`,
			"PUT",
			"no-cache",
			{},
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

		// Pull biometricOptions from user
		const attestResponse = await startRegistration(res?.biometricOptions);

		// Verify
		const passkeyVerification = await fetchurl(
			`/auth/2fa/passkey/validate/${auth?.data?._id}`,
			"PUT",
			"no-cache",
			{
				attestResponse: attestResponse,
			},
			undefined,
			false,
			false,
		);

		if (passkeyVerification.status === "error") {
			toast.error(passkeyVerification.message, "bottom");
			setBtnText("Submit");
			return;
		}
		if (passkeyVerification.status === "fail") {
			toast.error(passkeyVerification.message, "bottom");
			setBtnText("Submit");
			return;
		}

		if (passkeyVerification.data) {
			toast.success("Passkey registered", "bottom");
		}

		toast.success("Account has been updated", "bottom");
		// router.push(`/auth/profile`);
	};

	const resetForm = (e) => {
		e.target.closest("form").reset();
	};

	return (
		<form onSubmit={upgradePasskey}>
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

export default UpdatePasskeyForm;
