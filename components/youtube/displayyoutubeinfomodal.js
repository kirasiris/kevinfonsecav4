"use client";
import { useState } from "react";
import Modal from "react-bootstrap/Modal";

const DisplayYoutubeInfoModal = ({ object = {} }) => {
	const [activeModal, setActiveModal] = useState(false);

	return (
		<>
			<button
				className="btn btn-secondary btn-sm m-1"
				type="button"
				onClick={() => setActiveModal(!activeModal)}
				id={object._id}
			>
				<i className={`fas fa-exclamation-triangle me-1`} aria-hidden />
				More
			</button>
			<Modal
				id={object._id}
				show={activeModal}
				onHide={() => setActiveModal(!activeModal)}
				size="xl"
				backdrop={true}
				animation={true}
			>
				<Modal.Header closeButton>
					<Modal.Title>Download Options</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					{object?.text}
					<hr />
					<h2 className="display-6">More downloading options below:</h2>
					<div className="btn-group">
						<>
							<a
								href={`${object?.videoOnly?.url}`}
								className={`btn btn-sm btn-dark`}
								download
								rel="noopener noreferrer"
							>
								Download Video ONLY
							</a>
							<a
								href={`${object?.audioOnly?.url}`}
								className={`btn btn-sm btn-dark`}
								download
								rel="noopener noreferrer"
							>
								Download Audio ONLY
							</a>
						</>
					</div>
				</Modal.Body>
				<Modal.Footer>
					<button
						className="btn btn-secondary btn-sm"
						onClick={() => setActiveModal(!activeModal)}
					>
						Close
					</button>
				</Modal.Footer>
			</Modal>
		</>
	);
};

export default DisplayYoutubeInfoModal;
