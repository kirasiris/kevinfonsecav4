"use client";
import { useState } from "react";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";

const ReportModal = ({ postId = null, postType = ``, onModel = `` }) => {
	const [reportModal, setReportModal] = useState(false);

	const [reportData, setReportData] = useState({
		title: ``,
		text: ``,
	});

	const { title, text } = reportData;

	const resetForm = () => {
		setReportData({
			title: ``,
			text: ``,
		});
	};

	const sendReport = async (e) => {
		e.preventDefault();
		await fetch(`http://localhost:5000/api/v1/reports/${postId}`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				...reportData,
				type: postType,
				onModel: onModel,
			}),
		});
		setReportModal(false);
		resetForm();
	};

	return (
		<>
			<button
				className="btn btn-info btn-sm"
				type="button"
				onClick={() => setReportModal(!reportModal)}
			>
				<i className={`fas fa-exclamation-triangle me-1`} aria-hidden />
				Report Item
			</button>
			<Modal
				show={reportModal}
				onHide={() => setReportModal(!reportModal)}
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
							value={title}
							onChange={(e) => {
								setReportData({
									...reportData,
									title: e.target.value,
								});
							}}
							className="form-control mb-3"
							placeholder="I hate this article!"
						/>
						<label htmlFor="text" className="form-label">
							Text
						</label>
						<Form.Control
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
						/>
					</Modal.Body>
					<Modal.Footer>
						<button
							className="btn btn-secondary btn-sm"
							onClick={() => setReportModal(!reportModal)}
						>
							Close
						</button>
						<button className="btn btn-primary btn-sm" type="submit">
							Submit
						</button>
					</Modal.Footer>
				</Form>
			</Modal>
		</>
	);
};

export default ReportModal;
