"use client";
import { useState } from "react";
import Modal from "react-bootstrap/Modal";

const DeleteAllModal = ({ action }) => {
	const [confirmDeleteAllModal, setConfirmDeleteAllModal] = useState(false);

	const deleteObject = async (e) => {
		e.preventDefault();
		await action()
			.then(() => {
				setConfirmDeleteAllModal(true);
			})
			.catch((err) => {
				console.error(err);
			});
	};

	return (
		<>
			<button
				className="btn btn-danger btn-sm"
				type="button"
				onClick={() => setConfirmDeleteAllModal(!confirmDeleteAllModal)}
			>
				{/* <i className={`fas fa-trash-alt mr-1`} aria-hidden /> */}
				Delete all permanently
			</button>
			<Modal
				show={confirmDeleteAllModal}
				onHide={() => setConfirmDeleteAllModal(!confirmDeleteAllModal)}
				backdrop={true}
				animation={true}
				size={`sm`}
			>
				<Modal.Header closeButton>
					<Modal.Title>Are you sure about this?</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					You are about to delete everything from this collection!
				</Modal.Body>
				<Modal.Footer>
					<button
						className="btn btn-secondary btn-sm"
						onClick={() => setConfirmDeleteAllModal(!confirmDeleteAllModal)}
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

export default DeleteAllModal;
