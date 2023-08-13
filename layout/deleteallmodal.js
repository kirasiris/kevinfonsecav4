"use client";
import { useState } from "react";
import Modal from "react-bootstrap/Modal";

const DeleteAllModal = ({ action }) => {
	const [confirmDeleteAllModal, setConfirmDeleteAllModal] = useState(false);

	const openDeleteModal = (e) => {
		setConfirmDeleteAllModal(true);
	};

	const closeDeleteModal = (e) => {
		setConfirmDeleteAllModal(false);
	};

	const deleteObject = async (e) => {
		e.preventDefault();
		await action()
			.then(() => {
				closeDeleteModal();
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
				onClick={openDeleteModal}
			>
				{/* <i className={`fas fa-trash-alt mr-1`} aria-hidden /> */}
				Delete all
			</button>
			{confirmDeleteAllModal && (
				<Modal
					show={true}
					onHide={closeDeleteModal}
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
							onClick={closeDeleteModal}
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
			)}
		</>
	);
};

export default DeleteAllModal;
