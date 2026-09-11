"use client";
import { useState } from "react";
import Modal from "react-bootstrap/Modal";
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
				<form onSubmit={sendReport}>
					<Modal.Header closeButton>
						<div className="modal-title h4">Report!</div>
					</Modal.Header>
					<div className="modal-body">
						<label htmlFor="title" className="form-label">
							Title
						</label>
						<input
							id="title"
							name="title"
							defaultValue=""
							type="text"
							className="form-control mb-3"
							required
							placeholder="I hate this article!"
						/>
						<label htmlFor="text" className="form-label">
							Text
						</label>
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
					</div>
					<div className="modal-footer">
						<button
							className="btn btn-secondary btn-sm"
							onClick={() => setReportModal(!reportModal)}
						>
							Close
						</button>
						<button className="btn btn-secondary btn-sm" type="submit">
							{btnText}
						</button>
					</div>
				</form>
			</Modal>
		</>
	);
};

export default ReportModal;
