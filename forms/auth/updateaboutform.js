"use client";
import { useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { toast } from "react-toastify";
import { fetchurl } from "@/helpers/setTokenOnServer";
import MyTextArea from "@/components/global/myfinaltextarea";

const UpdateAboutForm = ({ auth = {}, profiles = [] }) => {
	const router = useRouter();
	const awtdParams = useParams();
	const awtdSearchParams = useSearchParams();

	const [showPartner, setShowPartner] = useState(
		auth?.data?.relationshipStatus === "taken"
	);

	const [btnText, setBtnText] = useState("Submit");

	const upgradeAbout = async (e) => {
		e.preventDefault();
		setBtnText(`Processing`);

		const form = e.target;
		const formData = new FormData(form);

		const rawFormData = {
			name: formData.get("name"),
			sex: formData.get("sex"),
			gender: formData.get("gender"),
			relationshipStatus: formData.get("relationshipStatus"),
			inRelationshipWith: formData.get("inRelationshipWith"),
			company: formData.get("company"),
			phoneNumber: formData.get("phoneNumber"),
			age: formData.get("age"),
			text: formData.get("text"),
			tags: formData.get("tags"),
		};

		const res = await fetchurl(
			`/auth/updateabout`,
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
		<form onSubmit={upgradeAbout}>
			<label htmlFor="name" className="form-label">
				Name
			</label>
			<input
				id="name"
				name="name"
				defaultValue={auth?.data?.name}
				type="text"
				className="form-control mb-3"
				required
				placeholder="John Doe"
			/>
			<label htmlFor="sex" className="form-label">
				Sex
			</label>
			<input
				id="sex"
				name="sex"
				defaultValue={auth?.data?.sex}
				type="text"
				className="form-control mb-3"
				placeholder="male"
			/>
			<label htmlFor="gender" className="form-label">
				Gender
			</label>
			<select
				id="gender"
				name="gender"
				defaultValue={auth?.data?.gender}
				className="form-control mb-3"
			>
				<option value={`non-binary`}>Non&nbsp;binary</option>
				<option value={`intersex`}>Intersex</option>
				<option value={`gender-variance`}>Gender&nbsp;variance</option>
				<option value={`male`}>Male</option>
				<option value={`butch`}>Butch</option>
				<option value={`transgender`}>Transgender</option>
				<option value={`agender`}>Agender</option>
				<option value={`pangender`}>Pangender</option>
				<option value={`demigender`}>Demigender</option>
				<option value={`female`}>Cis&nbsp;woman</option>
				<option value={`cisgender`}>Cis&nbsp;gender</option>
				<option value={`bigender`}>Bi&nbsp;gender</option>
				<option value={`androgyne`}>Androgyne</option>
				<option value={`trigender`}>Trigender</option>
				<option value={`neutral`}>Neutral</option>
			</select>
			<div className="row">
				<div className="col">
					<label htmlFor="relationshipStatus" className="form-label">
						Relationship&nbsp;Status
					</label>
					<select
						id="relationshipStatus"
						name="relationshipStatus"
						defaultValue={auth?.data?.relationshipStatus}
						className="form-control mb-3"
						onChange={(e) => setShowPartner(e.target.value === "taken")}
					>
						<option value="single">Single</option>
						<option value="taken">Taken</option>
						<option value="complicated">Complicated</option>
						<option value="widowed">Widowed</option>
						<option value="divorced">Divorced</option>
					</select>
				</div>

				{showPartner && profiles.data.length >= 1 && (
					<div className="col">
						<label htmlFor="inRelationshipWith" className="form-label">
							In&nbsp;Relationship&nbsp;With?
						</label>
						<select
							id="inRelationshipWith"
							name="inRelationshipWith"
							defaultValue={auth?.data?.inRelationshipWith?._id}
							className="form-control mb-3"
						>
							{profiles.data
								.filter((excludedUser) => excludedUser._id !== auth.data._id)
								.map((user) => (
									<option key={user._id} value={user._id}>
										{user.username}
									</option>
								))}
						</select>
					</div>
				)}
			</div>
			<label htmlFor="company" className="form-label">
				Company
			</label>
			<input
				id="company"
				name="company"
				defaultValue={auth?.data?.company}
				type="text"
				className="form-control mb-3"
				placeholder="John Doe's Business"
			/>
			<label htmlFor="phoneNumber" className="form-label">
				Phone Number
			</label>
			<input
				id="phoneNumber"
				name="phoneNumber"
				defaultValue={auth?.data?.phoneNumber}
				type="text"
				className="form-control mb-3"
				placeholder="012-345-6789"
			/>
			<label htmlFor="age" className="form-label">
				Age
			</label>
			<input
				id="age"
				name="age"
				defaultValue={auth?.data?.age}
				type="number"
				className="form-control mb-3"
				min={18}
				max={99}
				placeholder="18"
			/>
			<label htmlFor="bio" className="form-label">
				Bio
			</label>
			<MyTextArea
				auth={undefined}
				token={undefined}
				id="text"
				name="text"
				onModel="User"
				advancedTextEditor={false}
				customPlaceholder="Lets get to know you!"
				defaultValue={auth?.data?.bio}
			/>
			<label htmlFor="tags" className="form-label">
				Skills
			</label>
			<input
				id="tags"
				name="tags"
				defaultValue={auth?.data?.tags}
				type="text"
				className="form-control mb-3"
				required
				placeholder="html, css, javascript, php, etc"
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

export default UpdateAboutForm;
