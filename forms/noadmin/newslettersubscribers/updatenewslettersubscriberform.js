"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { fetchurl } from "@/helpers/setTokenOnServer";
import FormButtons from "@/components/global/formbuttons";

const UpdateNewsletterSubscriberForm = ({ object = {} }) => {
	const router = useRouter();

	const [btnText, setBtnText] = useState(`Submit`);

	const upgradeEmail = async (e) => {
		e.preventDefault();
		setBtnText("...");
		const form = e.target;
		const formData = new FormData(form);

		const rawFormData = {
			email: formData.get("email"),
		};

		const res = await fetchurl(
			`/noadmin/newslettersubscribers/${object?.data?._id}`,
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
		toast.success(`Newsletter subscriber updated`, "bottom");
		router.push(`/noadmin/newslettersubscribers`);
	};

	const resetForm = (e) => {
		e.target.closest("form").reset();
	};

	return (
		<form className="row" onSubmit={upgradeEmail}>
			<div className="col">
				<label htmlFor="email" className="form-label">
					Email
				</label>
				<input
					id="email"
					name="email"
					defaultValue={object?.data?.email}
					type="email"
					className="form-control mb-3"
					placeholder=""
				/>
				<br />
				<FormButtons />
			</div>
		</form>
	);
};

export default UpdateNewsletterSubscriberForm;
