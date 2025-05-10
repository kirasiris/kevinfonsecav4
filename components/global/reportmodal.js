"use client";
import { useState } from "react";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import { fetchurl } from "@/helpers/setTokenOnServer";

const ReportModal = ({
	resourceId = null,
	postType = undefined,
	onModel = `Blog`,
}) => {
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
		await fetchurl(`/global/reports/${resourceId}`, "POST", "no-cache", {
			...reportData,
			postType: postType,
			onModel: onModel,
			website: "beFree",
		});
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
						<button className="btn btn-secondary btn-sm" type="submit">
							Submit
						</button>
					</Modal.Footer>
				</Form>
			</Modal>
		</>
	);
};

export default ReportModal;
