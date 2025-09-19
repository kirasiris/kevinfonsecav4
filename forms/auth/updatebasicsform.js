"use client";
import { useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { toast } from "react-toastify";
import { fetchurl } from "@/helpers/setTokenOnServer";

const UpdateBasicsForm = ({ auth = {} }) => {
	const router = useRouter();
	const awtdParams = useParams();
	const awtdSearchParams = useSearchParams();

	const [btnText, setBtnText] = useState("Submit");

	const upgradeBasics = async (e) => {
		e.preventDefault();
		setBtnText(`Processing`);

		const form = e.target;
		const formData = new FormData(form);

		const rawFormData = {
			username: formData.get("username"),
			workstatus: formData.get("workstatus"),
			secondaryEmail: formData.get("secondaryEmail"),
			website: formData.get("website"),
			facebook: formData.get("facebook"),
			twitter: formData.get("twitter"),
			youtube: formData.get("youtube"),
			instagram: formData.get("instagram"),
			linkedin: formData.get("linkedin"),
			steamId: formData.get("steamId"),
			xboxId: formData.get("xboxId"),
		};

		const res = await fetchurl(
			`/auth/updatebasics`,
			"PUT",
			"no-cache",
			rawFormData,
			undefined,
			false,
			false
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

	const resetForm = (e) => {
		e.target.closest("form").reset();
	};

	return (
		<form onSubmit={upgradeBasics}>
			<label htmlFor="username" className="form-label">
				Username
			</label>
			<input
				id="username"
				name="username"
				defaultValue={auth?.data?.username}
				type="text"
				className="form-control mb-3"
				required
				placeholder="john.doe"
			/>
			<label htmlFor="email" className="form-label">
				Email
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
			<label htmlFor="secondaryEmail" className="form-label">
				Secondary&nbsp;Email
			</label>
			<input
				id="secondaryEmail"
				name="secondaryEmail"
				defaultValue={auth?.data?.secondaryEmail}
				type="email"
				className="form-control mb-3"
				placeholder="john.doe2@demo.com"
			/>
			<label htmlFor="workstatus" className="form-label">
				Work&nbsp;Status
			</label>
			<select
				id="workstatus"
				name="workstatus"
				defaultValue={auth?.data?.workstatus}
				className="form-control mb-3"
			>
				<option value="nini">Nini</option>
				<option value="student">Student</option>
				<option value="unemployed">Unemployed</option>
				<option value="employed">Employed</option>
			</select>
			<label htmlFor="website" className="form-label">
				Website
			</label>
			<input
				id="website"
				name="website"
				defaultValue={auth?.data?.website}
				type="text"
				className="form-control mb-3"
				placeholder="https://demo.com"
			/>
			<h6 className="display-6 text-center text-decoration-underline">
				Socials
			</h6>
			<div className="row">
				<div className="col">
					<label htmlFor="facebook" className="form-label">
						Facebook
					</label>
					<input
						id="facebook"
						name="facebook"
						defaultValue={auth?.data?.social?.facebook}
						type="text"
						className="form-control mb-3"
						placeholder="https://facebook.com"
					/>
				</div>
				<div className="col">
					<label htmlFor="twitter" className="form-label">
						Twitter
					</label>
					<input
						id="twitter"
						name="twitter"
						defaultValue={auth?.data?.social?.twitter}
						type="text"
						className="form-control mb-3"
						placeholder="https://x.com/john.doe"
					/>
				</div>
				<div className="col">
					<label htmlFor="youtube" className="form-label">
						YouTube
					</label>
					<input
						id="youtube"
						name="youtube"
						defaultValue={auth?.data?.social?.youtube}
						type="text"
						className="form-control mb-3"
						placeholder="https://youtube.com/channel/john.doe"
					/>
				</div>
			</div>
			<div className="row">
				<div className="col">
					<label htmlFor="instagram" className="form-label">
						Instagram
					</label>
					<input
						id="instagram"
						name="instagram"
						defaultValue={auth?.data?.social?.instagram}
						type="text"
						className="form-control mb-3"
						placeholder="https://instagram.com/john.doe"
					/>
				</div>
				<div className="col">
					<label htmlFor="linkedin" className="form-label">
						LinkedIn
					</label>
					<input
						id="linkedin"
						name="linkedin"
						defaultValue={auth?.data?.social?.linkedin}
						type="text"
						className="form-control mb-3"
						placeholder="https://www.linkedin.com/in/john-doe-12345678a/"
					/>
				</div>
			</div>
			<div className="row">
				<div className="col">
					<label htmlFor="steamId" className="form-label">
						Steam Id
					</label>
					<input
						id="steamId"
						name="steamId"
						defaultValue={auth?.data?.social?.steamId}
						type="text"
						className="form-control mb-3"
						placeholder="https://www.steam.com"
					/>
				</div>
				<div className="col">
					<label htmlFor="xboxId" className="form-label">
						Xbox Id
					</label>
					<input
						id="xboxId"
						name="xboxId"
						defaultValue={auth?.data?.social?.xboxId}
						type="text"
						className="form-control mb-3"
						placeholder="https://account.xbox.com/en-us/Profile?csrf=ID"
					/>
				</div>
			</div>
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

export default UpdateBasicsForm;
