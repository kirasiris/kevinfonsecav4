"use client";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "react-toastify";
import MyTextArea from "@/components/global/mytextarea";

const CreateSecret = () => {
	const router = useRouter();

	const [secretData, setSecretData] = useState({
		age: 1,
		sex: "non-binary",
		password: "",
		text: `No description`,
		nsfw: true,
		status: `draft`,
	});
	const { age, sex, password, text, nsfw, status } = secretData;

	const addSecret = async (e) => {
		e.preventDefault();
		try {
			await axios.post(`/extras/secrets`, secretData);
			toast.success(`Item created`);
			router.push(`/noadmin/secrets`);
		} catch (err) {
			console.log(err);
			// const error = err.response.data.message;
			const error = err?.response?.data?.error?.errors;
			const errors = err?.response?.data?.errors;

			if (error) {
				// dispatch(setAlert(error, 'danger'));
				error &&
					Object.entries(error).map(([, value]) => toast.error(value.message));
			}

			if (errors) {
				errors.forEach((error) => toast.error(error.msg));
			}

			toast.error(err?.response?.statusText);
			return { msg: err?.response?.statusText, status: err?.response?.status };
		}
	};

	const resetForm = () => {
		setSecretData({
			age: 1,
			sex: "non-binary",
			password: "",
			text: `No description`,
			nsfw: true,
			status: `draft`,
		});
	};

	return (
		<form className="row" onSubmit={addSecret}>
			<div className="col">
				<label htmlFor="age" className="form-label">
					Age
				</label>
				<input
					id="age"
					name="age"
					value={age}
					onChange={(e) => {
						const inputValue = e.target.value;
						if (/^\d+$/.test(inputValue) && parseInt(inputValue) >= 13) {
							setSecretData({
								...secretData,
								age: inputValue,
							});
						}
					}}
					type="number"
					className="form-control mb-3"
					placeholder=""
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
					className="form-control"
				>
					<option value={`male`}>Male</option>
					<option value={`female`}>Female</option>
					<option value={`non-binary`}>Non-binary</option>
				</select>
				<label htmlFor="text" className="form-label">
					Text
				</label>
				<MyTextArea
					id="text"
					name="text"
					value={text}
					objectData={secretData}
					setObjectData={setSecretData}
					onModel="Blog"
					advancedTextEditor={false}
				/>
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
					className="form-control"
				>
					<option value={true}>True</option>
					<option value={false}>False</option>
				</select>
				<label htmlFor="status" className="form-label">
					Status
				</label>
				<select
					id="status"
					name="status"
					value={status}
					onChange={(e) => {
						setSecretData({
							...secretData,
							status: e.target.value,
						});
					}}
					className="form-control"
				>
					<option value={`draft`}>Draft</option>
					<option value={`published`}>Published</option>
					<option value={`trash`}>Trash</option>
					<option value={`scheduled`}>Scheduled</option>
				</select>
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
			</div>
		</form>
	);
};

export default CreateSecret;
