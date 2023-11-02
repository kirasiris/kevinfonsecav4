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
				number: "",
				type: "mobile",
			},
		],
		birthdate: "",
		significantDates: [
			{
				date: "",
				type: "other",
			},
		],
		socials: [
			{
				url: "",
				type: "website",
			},
		],
		related: [
			{
				name: "",
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
			await axios.post(`/contacts`, {
				...contactData,
				// files: { avatar: files?.selected?._id },
				occupation: contactData.occupation.filter(
					(obj) =>
						obj.company !== "" &&
						obj.title !== "" &&
						obj.department !== "" &&
						obj.address !== ""
				),
				emails: contactData.emails.filter(
					(obj) => obj.handle !== "" && obj.type !== ""
				),
				phones: contactData.phones.filter(
					(obj) => obj.number !== "" && obj.type !== ""
				),
				significantDates: contactData.significantDates.filter(
					(obj) => obj.date !== "" && obj.type !== ""
				),
				socials: contactData.socials.filter(
					(obj) => obj.url !== "" && obj.type !== ""
				),
				related: contactData.related.filter(
					(obj) => obj.name !== "" && obj.type !== ""
				),
			});
			toast.success(`Item created`);
			router.push(`/noadmin/contacts`);
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
					number: "",
					type: "mobile",
				},
			],
			birthdate: "",
			significantDates: [
				{
					date: "",
					type: "other",
				},
			],
			socials: [
				{
					url: "",
					type: "website",
				},
			],
			related: [
				{
					name: "",
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
		newOccupation.push({ company: "", title: "", department: "", address: "" });
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
		const newEmail = [...emails];
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
				number: "",
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
			number: "",
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
	/*****************
	 ******************
	 * SIGNIFICANT DATES
	 ******************
	 ******************/
	const handleSignificantDatesChange = (index, field) => (e) => {
		const newSignificantDate = [...significantDates];
		newSignificantDate[index][field] = e.target.value;

		if (
			index === contactData.significantDates.length - 1 &&
			e.target.value !== ""
		) {
			newSignificantDate.push({
				date: "",
				type: "",
			});
		}

		setContactData({
			...contactData,
			significantDates: newSignificantDate,
		});
	};

	const handleAddSignificantDateRow = () => {
		newSignificantDate.push({
			date: "",
			type: "",
		});
	};

	const handleRemoveSignificantDateRow = (index) => () => {
		const newSignificantDate = significantDates.filter((_, i) => i !== index);
		setContactData({
			...contactData,
			significantDates: newSignificantDate,
		});
	};

	/*****************
	 ******************
	 * SOCIALS
	 ******************
	 ******************/
	const handleSocialsChange = (index, field) => (e) => {
		const newSocial = [...socials];
		newSocial[index][field] = e.target.value;

		if (index === contactData.socials.length - 1 && e.target.value !== "") {
			newSocial.push({
				url: "",
				type: "",
			});
		}

		setContactData({
			...contactData,
			socials: newSocial,
		});
	};

	const handleAddSocialRow = () => {
		newSocial.push({
			url: "",
			type: "",
		});
	};

	const handleRemoveSocialRow = (index) => () => {
		const newSocial = socials.filter((_, i) => i !== index);
		setContactData({
			...contactData,
			socials: newSocial,
		});
	};

	/*****************
	 ******************
	 * RELATED
	 ******************
	 ******************/
	const handleRelatesChange = (index, field) => (e) => {
		const newRelated = [...related];
		newRelated[index][field] = e.target.value;

		if (index === contactData.related.length - 1 && e.target.value !== "") {
			newRelated.push({
				name: "",
				type: "",
			});
		}

		setContactData({
			...contactData,
			related: newRelated,
		});
	};

	const handleAddRelatedRow = () => {
		newRelated.push({
			name: "",
			type: "",
		});
	};

	const handleRemoveRelatedRow = (index) => () => {
		const newRelated = related.filter((_, i) => i !== index);
		setContactData({
			...contactData,
			related: newRelated,
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
				<table className="table table-bordered">
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
												type="button"
												onClick={handleAddOccupationRow}
											>
												+
											</button>
										) : (
											<button
												className="btn btn-danger"
												type="button"
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
				<table className="table table-bordered">
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
												type="button"
												onClick={handleAddEmailRow}
											>
												+
											</button>
										) : (
											<button
												className="btn btn-danger"
												type="button"
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
				<table className="table table-bordered">
					<thead>
						<tr>
							<th scope="col">#</th>
							<th scope="col">Number</th>
							<th scope="col">Type</th>
							<th scope="col">Action</th>
						</tr>
					</thead>
					<tbody>
						{phones?.length > 0 &&
							phones.map((phone, index) => (
								<tr key={index}>
									<th>{index + 1}</th>
									<td>
										<input
											id={`phone[${index}].number`}
											name={`phone[${index}].number`}
											value={phone.number}
											onChange={handlePhonesChange(index, "number")}
											type="text"
											className="form-control mb-3"
											placeholder=""
										/>
									</td>
									<td>
										<select
											id={`phone[${index}].type`}
											name={`phone[${index}].type`}
											value={phone.type}
											onChange={handlePhonesChange(index, "type")}
											className="form-control"
										>
											<option value="home">Home</option>
											<option value="work">Work</option>
											<option value="other">Other</option>
											<option value="mobile">Mobile</option>
											<option value="main">Main</option>
											<option value="home-fax">Home Fax</option>
											<option value="work-fax">Work Fax</option>
											<option value="google-voice">Google Voice</option>
											<option value="pager">Pager</option>
										</select>
									</td>
									<td>
										{index === phones.length - 1 ? (
											<button
												className="btn btn-success"
												type="button"
												onClick={handleAddPhoneRow}
											>
												+
											</button>
										) : (
											<button
												className="btn btn-danger"
												type="button"
												onClick={handleRemovePhoneRow(index)}
											>
												x
											</button>
										)}
									</td>
								</tr>
							))}
					</tbody>
				</table>
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
				<table className="table table-bordered">
					<thead>
						<tr>
							<th scope="col">#</th>
							<th scope="col">Date</th>
							<th scope="col">Type</th>
							<th scope="col">Action</th>
						</tr>
					</thead>
					<tbody>
						{significantDates?.length > 0 &&
							significantDates.map((significantDate, index) => (
								<tr key={index}>
									<th>{index + 1}</th>
									<td>
										<input
											id={`significantDate[${index}].date`}
											name={`significantDate[${index}].date`}
											value={significantDate.date}
											onChange={handleSignificantDatesChange(index, "date")}
											type="text"
											className="form-control mb-3"
											placeholder=""
										/>
									</td>
									<td>
										<select
											id={`significantDate[${index}].type`}
											name={`significantDate[${index}].type`}
											value={significantDate.type}
											onChange={handleSignificantDatesChange(index, "type")}
											className="form-control"
										>
											<option value="anniversary">Anniversary</option>
											<option value="other">Other</option>
										</select>
									</td>
									<td>
										{index === significantDates.length - 1 ? (
											<button
												className="btn btn-success"
												type="button"
												onClick={handleAddSignificantDateRow}
											>
												+
											</button>
										) : (
											<button
												className="btn btn-danger"
												type="button"
												onClick={handleRemoveSignificantDateRow(index)}
											>
												x
											</button>
										)}
									</td>
								</tr>
							))}
					</tbody>
				</table>
				<label htmlFor="socials" className="form-label">
					Socials
				</label>
				<table className="table table-bordered">
					<thead>
						<tr>
							<th scope="col">#</th>
							<th scope="col">Url</th>
							<th scope="col">Type</th>
							<th scope="col">Action</th>
						</tr>
					</thead>
					<tbody>
						{socials?.length > 0 &&
							socials.map((social, index) => (
								<tr key={index}>
									<th>{index + 1}</th>
									<td>
										<input
											id={`social[${index}].url`}
											name={`social[${index}].url`}
											value={social.url}
											onChange={handleSocialsChange(index, "url")}
											type="text"
											className="form-control mb-3"
											placeholder=""
										/>
									</td>
									<td>
										<select
											id={`social[${index}].type`}
											name={`social[${index}].type`}
											value={social.type}
											onChange={handleSocialsChange(index, "type")}
											className="form-control"
										>
											<option value="website">Website</option>
											<option value="facebook">Facebook</option>
											<option value="twitter-x">Twitter / X</option>
											<option value="instagram">Instagram</option>
											<option value="pinterest">Pinterest</option>
											<option value="tiktok">TikTok</option>
											<option value="wordpress">WordPress</option>
											<option value="github">GitHub</option>
										</select>
									</td>
									<td>
										{index === socials.length - 1 ? (
											<button
												className="btn btn-success"
												type="button"
												onClick={handleAddSocialRow}
											>
												+
											</button>
										) : (
											<button
												className="btn btn-danger"
												type="button"
												onClick={handleRemoveSocialRow(index)}
											>
												x
											</button>
										)}
									</td>
								</tr>
							))}
					</tbody>
				</table>
				<label htmlFor="related" className="form-label">
					Related
				</label>
				<table className="table table-bordered">
					<thead>
						<tr>
							<th scope="col">#</th>
							<th scope="col">Name</th>
							<th scope="col">Type</th>
							<th scope="col">Action</th>
						</tr>
					</thead>
					<tbody>
						{related?.length > 0 &&
							related.map((related, index) => (
								<tr key={index}>
									<th>{index + 1}</th>
									<td>
										<input
											id={`related[${index}].name`}
											name={`related[${index}].name`}
											value={related.name}
											onChange={handleRelatesChange(index, "name")}
											type="text"
											className="form-control mb-3"
											placeholder=""
										/>
									</td>
									<td>
										<select
											id={`related[${index}].type`}
											name={`related[${index}].type`}
											value={related.type}
											onChange={handleRelatesChange(index, "type")}
											className="form-control"
										>
											<option value="spouse">Spouse</option>
											<option value="child">Child</option>
											<option value="mother">Mother</option>
											<option value="father">Father</option>
											<option value="parent">Parent</option>
											<option value="brother">Brother</option>
											<option value="sister">Sister</option>
											<option value="friend">Friend</option>
											<option value="relative">Relative</option>
											<option value="manager">Manager</option>
											<option value="assistant">Assistant</option>
											<option value="reference">Reference</option>
											<option value="partner">Partner</option>
											<option value="domestic-partner">Domestic Partner</option>
										</select>
									</td>
									<td>
										{index === related.length - 1 ? (
											<button
												className="btn btn-success"
												type="button"
												onClick={handleAddRelatedRow}
											>
												+
											</button>
										) : (
											<button
												className="btn btn-danger"
												type="button"
												onClick={handleRemoveRelatedRow(index)}
											>
												x
											</button>
										)}
									</td>
								</tr>
							))}
					</tbody>
				</table>
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
					advancedTextEditor={false}
				/>
				<label htmlFor="status" className="form-label">
					Status
				</label>
				<select
					id="status"
					name="status"
					value={status}
					onChange={(e) => {
						setContactData({
							...contactData,
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
