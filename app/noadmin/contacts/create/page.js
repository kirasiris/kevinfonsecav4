"use client";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import MyTextArea from "@/components/global/mytextarea";
import AuthContext from "@/helpers/globalContext";

const CreateContact = () => {
	const { files } = useContext(AuthContext);

	const router = useRouter();

	const [contactData, setContactData] = useState({
		firstName: "",
		middleName: "",
		lastName: "",
		phoneticFirst: "",
		phoneticMiddle: "",
		phoneticLast: "",
		nickname: "",
		occupation: [
			{
				company: "",
				title: "",
				department: "",
				address: "",
			},
		],
		emails: [
			{
				handle: "",
				type: "other",
			},
		],
		phones: [
			{
				handle: "",
				type: "mobile",
			},
		],
		birthdate: "",
		significantDates: [],
		socials: [
			{
				handle: "",
				type: "website",
			},
		],
		related: [
			{
				handle: "",
				type: "relative",
			},
		],
		text: `No description`,
		status: `draft`,
	});
	const {
		firstName,
		middleName,
		lastName,
		phoneticFirst,
		phoneticMiddle,
		phoneticLast,
		nickname,
		occupation,
		emails,
		phones,
		birthdate,
		significantDates,
		socials,
		related,
		text,
		status,
	} = contactData;

	const addContact = async (e) => {
		e.preventDefault();
		try {
			console.log(contactData);
			// await axios.post(`/contacts`, {
			// 	...contactData,
			// 	files: { avatar: files?.selected?._id },
			// });
			// toast.success(`Item created`);
			// resetForm();
			// router.push(`/noadmin/contacts`);
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
		setContactData({
			firstName: "",
			middleName: "",
			lastName: "",
			phoneticFirst: "",
			phoneticMiddle: "",
			phoneticLast: "",
			nickname: "",
			occupation: [
				{
					company: "",
					title: "",
					department: "",
					address: "",
				},
			],
			emails: [
				{
					handle: "",
					type: "other",
				},
			],
			phones: [
				{
					handle: "",
					type: "mobile",
				},
			],
			birthdate: "",
			significantDates: [],
			socials: [
				{
					handle: "",
					type: "website",
				},
			],
			related: [
				{
					handle: "",
					type: "relative",
				},
			],
			text: `No description`,
			status: `draft`,
		});
	};

	/*****************
	 ******************
	 * OCCUPATIONS
	 ******************
	 ******************/
	const handleOccupationsChange = (index, field) => (e) => {
		const newOccupation = [...occupation];
		newOccupation[index][field] = e.target.value;

		if (index === contactData.occupation.length - 1 && e.target.value !== "") {
			newOccupation.push({
				company: "",
				title: "",
				department: "",
				address: "",
			});
		}

		setContactData({
			...contactData,
			occupation: newOccupation,
		});
	};

	const handleAddOccupationRow = () => {
		occupation.push({ company: "", title: "", department: "", address: "" });
	};

	const handleRemoveOccupationRow = (index) => () => {
		const newOccupation = occupation.filter((_, i) => i !== index);
		setContactData({
			...contactData,
			occupation: newOccupation,
		});
	};

	/*****************
	 ******************
	 * EMAILS
	 ******************
	 ******************/
	const handleEmailsChange = (index, field) => (e) => {
		const newEmail = [...emails];
		newEmail[index][field] = e.target.value;

		if (index === contactData.emails.length - 1 && e.target.value !== "") {
			newEmail.push({
				handle: "",
				type: "",
			});
		}

		setContactData({
			...contactData,
			emails: newEmail,
		});
	};

	const handleAddEmailRow = () => {
		newEmail.push({
			handle: "",
			type: "",
		});
	};

	const handleRemoveEmailRow = (index) => () => {
		const newEmail = emails.filter((_, i) => i !== index);
		setContactData({
			...contactData,
			emails: newEmail,
		});
	};

	/*****************
	 ******************
	 * PHONES
	 ******************
	 ******************/
	const handlePhonesChange = (index, field) => (e) => {
		const newPhone = [...phones];
		newPhone[index][field] = e.target.value;

		if (index === contactData.phones.length - 1 && e.target.value !== "") {
			newPhone.push({
				handle: "",
				type: "",
			});
		}

		setContactData({
			...contactData,
			phones: newPhone,
		});
	};

	const handleAddPhoneRow = () => {
		newPhone.push({
			handle: "",
			type: "",
		});
	};

	const handleRemovePhoneRow = (index) => () => {
		const newPhone = phones.filter((_, i) => i !== index);
		setContactData({
			...contactData,
			phones: newPhone,
		});
	};

	return (
		<form className="row" onSubmit={addContact}>
			<div className="col">
				<label htmlFor="firstName" className="form-label">
					First Name
				</label>
				<input
					id="firstName"
					name="firstName"
					value={firstName}
					onChange={(e) => {
						setContactData({
							...contactData,
							firstName: e.target.value,
						});
					}}
					type="text"
					className="form-control mb-3"
					placeholder=""
				/>
				<label htmlFor="middleName" className="form-label">
					Middle Name
				</label>
				<input
					id="middleName"
					name="middleName"
					value={middleName}
					onChange={(e) => {
						setContactData({
							...contactData,
							middleName: e.target.value,
						});
					}}
					type="text"
					className="form-control mb-3"
					placeholder=""
				/>
				<label htmlFor="lastName" className="form-label">
					Last Name
				</label>
				<input
					id="lastName"
					name="lastName"
					value={lastName}
					onChange={(e) => {
						setContactData({
							...contactData,
							lastName: e.target.value,
						});
					}}
					type="text"
					className="form-control mb-3"
					placeholder=""
				/>
				<label htmlFor="phoneticFirst" className="form-label">
					Phonetic First Name
				</label>
				<input
					id="phoneticFirst"
					name="phoneticFirst"
					value={phoneticFirst}
					onChange={(e) => {
						setContactData({
							...contactData,
							phoneticFirst: e.target.value,
						});
					}}
					type="text"
					className="form-control mb-3"
					placeholder=""
				/>
				<label htmlFor="phoneticMiddle" className="form-label">
					Phonetic Middle Name
				</label>
				<input
					id="phoneticMiddle"
					name="phoneticMiddle"
					value={phoneticMiddle}
					onChange={(e) => {
						setContactData({
							...contactData,
							phoneticMiddle: e.target.value,
						});
					}}
					type="text"
					className="form-control mb-3"
					placeholder=""
				/>
				<label htmlFor="phoneticLast" className="form-label">
					Phonetic Last Name
				</label>
				<input
					id="phoneticLast"
					name="phoneticLast"
					value={phoneticLast}
					onChange={(e) => {
						setContactData({
							...contactData,
							phoneticLast: e.target.value,
						});
					}}
					type="text"
					className="form-control mb-3"
					placeholder=""
				/>
				<label htmlFor="nickname" className="form-label">
					*Nickname
				</label>
				<input
					id="nickname"
					name="nickname"
					value={nickname}
					onChange={(e) => {
						setContactData({
							...contactData,
							nickname: e.target.value,
						});
					}}
					type="text"
					className="form-control mb-3"
					placeholder=""
				/>
				<label htmlFor="occupation" className="form-label">
					Occupation
				</label>
				<table className="table table-striped table-hover">
					<thead>
						<tr>
							<th scope="col">#</th>
							<th scope="col">Company</th>
							<th scope="col">Title</th>
							<th scope="col">Department</th>
							<th scope="col">Address</th>
							<th scope="col">Action</th>
						</tr>
					</thead>
					<tbody>
						{occupation?.length > 0 &&
							occupation.map((occupation, index) => (
								<tr key={index}>
									<th>{index + 1}</th>
									<td>
										<input
											id={`occupation[${index}].company`}
											name={`occupation[${index}].company`}
											value={occupation.company}
											onChange={handleOccupationsChange(index, "company")}
											type="text"
											className="form-control mb-3"
											placeholder=""
										/>
									</td>
									<td>
										<input
											id={`occupation[${index}].title`}
											name={`occupation[${index}].title`}
											value={occupation.title}
											onChange={handleOccupationsChange(index, "title")}
											type="text"
											className="form-control mb-3"
											placeholder=""
										/>
									</td>
									<td>
										<input
											id={`occupation[${index}].department`}
											name={`occupation[${index}].department`}
											value={occupation.department}
											onChange={handleOccupationsChange(index, "department")}
											type="text"
											className="form-control mb-3"
											placeholder=""
										/>
									</td>
									<td>
										<input
											id={`occupation[${index}].address`}
											name={`occupation[${index}].address`}
											value={occupation.address}
											onChange={handleOccupationsChange(index, "address")}
											type="text"
											className="form-control mb-3"
											placeholder=""
										/>
									</td>
									<td>
										{index === occupation.length - 1 ? (
											<button
												className="btn btn-success"
												onClick={handleAddOccupationRow}
											>
												+
											</button>
										) : (
											<button
												className="btn btn-danger"
												onClick={handleRemoveOccupationRow(index)}
											>
												x
											</button>
										)}
									</td>
								</tr>
							))}
					</tbody>
				</table>
				<label htmlFor="emails" className="form-label">
					Emails
				</label>
				<table className="table table-striped table-hover">
					<thead>
						<tr>
							<th scope="col">#</th>
							<th scope="col">Handle</th>
							<th scope="col">Type</th>
							<th scope="col">Action</th>
						</tr>
					</thead>
					<tbody>
						{emails?.length > 0 &&
							emails.map((email, index) => (
								<tr key={index}>
									<th>{index + 1}</th>
									<td>
										<input
											id={`email[${index}].handle`}
											name={`email[${index}].handle`}
											value={email.handle}
											onChange={handleEmailsChange(index, "handle")}
											type="text"
											className="form-control mb-3"
											placeholder=""
										/>
									</td>
									<td>
										<select
											id={`email[${index}].type`}
											name={`email[${index}].type`}
											value={email.type}
											onChange={handleEmailsChange(index, "type")}
											className="form-control"
										>
											<option value="home">Home</option>
											<option value="work">Work</option>
											<option value="other">Other</option>
										</select>
									</td>
									<td>
										{index === emails.length - 1 ? (
											<button
												className="btn btn-success"
												onClick={handleAddEmailRow}
											>
												+
											</button>
										) : (
											<button
												className="btn btn-danger"
												onClick={handleRemoveEmailRow(index)}
											>
												x
											</button>
										)}
									</td>
								</tr>
							))}
					</tbody>
				</table>
				<label htmlFor="phones" className="form-label">
					Phones
				</label>
				<label htmlFor="birthdate" className="form-label">
					Birthdate
				</label>
				<input
					id="birthdate"
					name="birthdate"
					value={birthdate}
					onChange={(e) => {
						setContactData({
							...contactData,
							birthdate: e.target.value,
						});
					}}
					type="text"
					className="form-control mb-3"
					placeholder=""
				/>
				<label htmlFor="significantDates" className="form-label">
					Significant Dates
				</label>
				<label htmlFor="socials" className="form-label">
					Socials
				</label>
				<label htmlFor="related" className="form-label">
					Related
				</label>
				<label htmlFor="text" className="form-label">
					Text
				</label>
				<MyTextArea
					id="text"
					name="text"
					value={text}
					objectData={contactData}
					setObjectData={setContactData}
					onModel="Blog"
					advancedTextEditor={true}
				/>
				<br />
				<button
					type="submit"
					className="btn btn-secondary btn-sm float-start"
					disabled={nickname.length > 0 && text.length > 0 ? !true : !false}
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

export default CreateContact;
