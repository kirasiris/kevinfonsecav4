"use client";
import { useState } from "react";
import Modal from "react-bootstrap/Modal";

const TrashAllModal = ({ action = () => {} }) => {
	const [confirmTrashAllModal, setConfirmTrashAllModal] = useState(false);

	const deleteObject = async (e) => {
		e.preventDefault();
		await action()
			.then(() => {
				setConfirmTrashAllModal(true);
			})
			.catch((err) => {
				console.error(err);
			});
	};

	return (
		<>
			<button
				className="btn btn-dark btn-sm"
				type="button"
				onClick={() => setConfirmTrashAllModal(!confirmTrashAllModal)}
			>
				Trash all
			</button>
			<Modal
				show={confirmTrashAllModal}
				onHide={() => setConfirmTrashAllModal(!confirmTrashAllModal)}
				size={`xl`}
				backdrop={true}
				animation={true}
			>
				<Modal.Header closeButton>
					<Modal.Title>Are you sure about this?</Modal.Title>
				</Modal.Header>
				<Modal.Body>You are about to move everything to trash!</Modal.Body>
				<Modal.Footer>
					<button
						className="btn btn-secondary btn-sm"
						onClick={() => setConfirmTrashAllModal(!confirmTrashAllModal)}
					>
						Close
					</button>
					<button
						className="btn btn-primary btn-sm"
						type="submit"
						onClick={deleteObject}
					>
						Submit
					</button>
				</Modal.Footer>
			</Modal>
		</>
	);
};

export default TrashAllModal;
