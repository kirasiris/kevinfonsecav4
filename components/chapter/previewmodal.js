"use client";
import { useState } from "react";
import Modal from "react-bootstrap/Modal";

const PreviewModal = ({ object = {} }) => {
	const [previewModal, setPreviewModal] = useState(false);

	return (
		<>
			<span
				className="badge bg-info div-hover me-1"
				onClick={() => setPreviewModal(!previewModal)}
			>
				Preview
			</span>
			<Modal
				show={previewModal}
				onHide={() => setPreviewModal(!previewModal)}
				backdrop={true}
				animation={true}
				size="xl"
			>
				<Modal.Header closeButton>
					<Modal.Title>Preview!</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<video
						title={object.title || "Untitled"}
						controls
						style={{ maxWidth: "100%" }}
					>
						<source
							src={
								object?.files?.video_url?.location?.secure_location || "xd.mp4"
							}
							type={`${object?.files?.video_url?.format_type}/${object?.files?.video_url?.format}`}
						/>
					</video>
				</Modal.Body>
				<Modal.Footer>
					<button
						className="btn btn-secondary btn-sm"
						onClick={() => setPreviewModal(!previewModal)}
					>
						Close
					</button>
				</Modal.Footer>
			</Modal>
		</>
	);
};

export default PreviewModal;
