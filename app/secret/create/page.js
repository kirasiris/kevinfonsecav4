"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Globalcontent from "@/layout/content";
import Sidebar from "@/layout/secret/sidebar";

const CreateSecret = ({ params, searchParams }) => {
	const router = useRouter();
	const [secretData, setSecretData] = useState({
		age: 13,
		sex: "male",
		nsfw: false,
		text: ``,
	});

	const { age, sex, nsfw, text } = secretData;

	const createContact = async (e) => {
		e.preventDefault();
		const res = await fetch(`http://localhost:5000/api/v1/extras/secrets`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ ...secretData, status: "published" }),
		});
		await res.json();
		searchParams?.returnpage
			? router.push(searchParams.returnpage)
			: router.push(`/secret`);
	};

	const resetForm = () => {
		setSecretData({
			age: 13,
			sex: "male",
			nsfw: false,
			text: ``,
		});
	};
	return (
		<>
			<div className="container mt-4">
				<div className="row">
					<Globalcontent>
						<form onSubmit={createContact}>
							<label htmlFor="age" className="form-label">
								Age
							</label>
							<input
								id="age"
								name="age"
								value={age}
								onChange={(e) => {
									setSecretData({
										...secretData,
										age: e.target.value,
									});
								}}
								type="number"
								className="form-control mb-3"
								min={13}
								max={100}
								placeholder="Enter age"
							/>
							<label htmlFor="sex" className="form-label">
								Sex
							</label>
							<select
								id="sex"
								name="sex"
								value={sex}
								onChange={(e) => {
									setSecretData({
										...secretData,
										sex: e.target.value,
									});
								}}
								className="form-control mb-3"
							>
								<option value={`male`}>Male</option>
								<option value={`female`}>Female</option>
								<option value={`non-binary`}>Non-binary</option>
							</select>
							<label htmlFor="nsfw" className="form-label">
								NSFW
							</label>
							<select
								id="nsfw"
								name="nsfw"
								value={nsfw}
								onChange={(e) => {
									setSecretData({
										...secretData,
										nsfw: e.target.value,
									});
								}}
								className="form-control mb-3"
							>
								<option value={true}>Yes</option>
								<option value={false}>No</option>
							</select>
							<label htmlFor="text" className="form-label">
								Text
							</label>
							<textarea
								id="text"
								name="text"
								value={text}
								onChange={(e) => {
									setSecretData({
										...secretData,
										text: e.target.value,
									});
								}}
								className="form-control"
								placeholder={`Here goes the message`}
								rows={`3`}
							/>
							<br />
							<button
								type="submit"
								className="btn btn-secondary btn-sm float-start"
								disabled={text.length > 0 ? !true : !false}
							>
								Submit
							</button>
							<button
								type="button"
								className="btn btn-secondary btn-sm float-end"
								onClick={resetForm}
							>
								Reset
							</button>
						</form>
					</Globalcontent>
					<Sidebar />
				</div>
			</div>
		</>
	);
};

export default CreateSecret;
