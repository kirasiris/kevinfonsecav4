"use client";
import { useState } from "react";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import { toast } from "react-toastify";
import { fetchurl } from "@/helpers/setTokenOnServer";
import MyTextArea from "./myfinaltextarea";

const ReportModal = ({
	resourceId = null,
	postType = undefined,
	onModel = `Blog`,
}) => {
	const [reportModal, setReportModal] = useState(false);
	const [btnText, setBtnText] = useState("Submit");

	const resetForm = (e) => {
		e.target.closest("form").reset();
	};

	const sendReport = async (e) => {
		e.preventDefault();
		const form = e.target;
		const formData = new FormData(form);

		const rawFormData = {
			title: formData.get("title"),
			text: formData.get("text"),
			postType: postType,
			onModel: onModel,
			website: process.env.NEXT_PUBLIC_WEBSITE_NAME,
		};

		const res = await fetchurl(
			`/global/reports/${resourceId}`,
			"POST",
			"no-cache",
			rawFormData,
			undefined,
			false,
			false,
		);

		if (res.status === "error") {
			toast.error(res.message);
			setBtnText("Submit");
			return;
		}

		if (res.status === "fail") {
			toast.error(res.message);
			setBtnText("Submit");
			return;
		}
		setBtnText("Submit");
		setReportModal(false);
		resetForm();
	};

	return (
		<>
			<button
				className="btn btn-secondary btn-sm"
				type="button"
				onClick={() => setReportModal(!reportModal)}
			>
				<i className={`fas fa-exclamation-triangle me-1`} aria-hidden />
				Report Item
			</button>
			<Modal
				show={reportModal}
				onHide={() => setReportModal(!reportModal)}
				size="xl"
				backdrop={true}
				animation={true}
			>
				<Form onSubmit={sendReport}>
					<Modal.Header closeButton>
						<Modal.Title>Report!</Modal.Title>
					</Modal.Header>
					<Modal.Body>
						<label htmlFor="title" className="form-label">
							Title
						</label>
						<input
							id="title"
							name="title"
							defaultValue=""
							type="text"
							// value={title}
							// onChange={(e) => {
							// 	setReportData({
							// 		...reportData,
							// 		title: e.target.value,
							// 	});
							// }}
							className="form-control mb-3"
							required
							placeholder="I hate this article!"
						/>
						<label htmlFor="text" className="form-label">
							Text
						</label>
						{/* <Form.Control
							as={`textarea`}
							rows={`3`}
							placeholder={`Text`}
							aria-label={`Text`}
							aria-describedby={`text-text`}
							id={`text`}
							name={`text`}
							value={text}
							onChange={(e) => {
								setReportData({
									...reportData,
									text: e.target.value,
								});
							}}
							required
						/> */}
						<MyTextArea
							auth={undefined}
							token={undefined}
							id="text"
							name="text"
							defaultValue=""
							onModel="Blog"
							advancedTextEditor={false}
							customPlaceholder="Text"
							charactersLimit={1}
							isRequired={true}
						/>
					</Modal.Body>
					<Modal.Footer>
						<button
							className="btn btn-secondary btn-sm"
							onClick={() => setReportModal(!reportModal)}
						>
							Close
						</button>
						<button className="btn btn-secondary btn-sm" type="submit">
							{btnText}
						</button>
					</Modal.Footer>
				</Form>
			</Modal>
		</>
	);
};

export default ReportModal;
