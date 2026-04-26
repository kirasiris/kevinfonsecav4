"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { fetchurl } from "@/helpers/setTokenOnServer";

const UpdateEmailsForm = ({ auth = {} }) => {
	const router = useRouter();

	const [rawEmails, setRawEmails] = useState({
		emails: auth?.data?.emails || [
			{
				address: "",
				isPrimary: false,
				isVerified: false,
				website: process.env.NEXT_PUBLIC_WEBSITE_NAME,
			},
		],
	});

	const [btnText, setBtnText] = useState("Submit");

	const { emails } = rawEmails;

	const handleAddEmail = () => {
		setRawEmails({
			...rawEmails,
			emails: [
				...emails,
				{
					address: "",
					isPrimary: false,
					isVerified: false,
					website: process.env.NEXT_PUBLIC_WEBSITE_NAME,
				},
			],
		});
	};

	const handleRemoveEmail = (index) => {
		const newEmails = emails.filter((_, i) => i !== index);
		setRawEmails({ ...rawEmails, emails: newEmails });
	};

	const handleChange = (index, field, value) => {
		const newEmails = [...emails];
		newEmails[index][field] = value;
		setRawEmails({ ...rawEmails, emails: newEmails });
	};

	const handlePrimaryChange = (index) => {
		const newEmails = emails.map((email, i) => ({
			...email,
			isPrimary: i === index, // only one true
		}));
		setRawEmails({ ...rawEmails, emails: newEmails });
	};

	const addEmails = async (e) => {
		e.preventDefault();
		setBtnText(`Processing`);

		const rawFormData = {
			emails: emails,
		};

		const res = await fetchurl(
			`/auth/emails/manage`,
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
		router.push(`/auth/profile`);
	};

	return (
		<form onSubmit={addEmails}>
			<label htmlFor="email" className="form-label">
				Primary&nbsp;Email
			</label>
			<input
				id="email"
				name="email"
				defaultValue={auth?.data?.email}
				type="email"
				className="form-control mb-3"
				disabled
				placeholder="john.doe@demo.com"
			/>
			{emails.map((email, index) => (
				<div key={index} className="d-flex mb-3">
					<input
						id={`email-${index}`}
						name="emails[]"
						value={email.address}
						type="email"
						className="form-control me-2"
						onChange={(e) => handleChange(index, "address", e.target.value)}
						placeholder="Enter email"
					/>
					<div className="form-check mt-1">
						<input
							type="checkbox"
							className="form-check-input"
							checked={email.isPrimary}
							onChange={() => handlePrimaryChange(index)}
						/>
					</div>
					<button
						type="button"
						className="btn btn-danger"
						onClick={() => handleRemoveEmail(index)}
						disabled={emails.length === 1}
					>
						Remove
					</button>
				</div>
			))}
			<button
				type="button"
				className="btn btn-secondary mb-3 w-100"
				onClick={handleAddEmail}
			>
				Add&nbsp;Email
			</button>
			<button type="submit" className="btn btn-secondary btn-sm float-start">
				{btnText}
			</button>
		</form>
	);
};

export default UpdateEmailsForm;
