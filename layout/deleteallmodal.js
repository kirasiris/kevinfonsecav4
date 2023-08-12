"use client";
import { useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";

const DeleteAllModal = ({
	id = null,
	sId = null,
	size = `sm`,
	action,
	setObjects,
	objects = [],
	setTotalResults,
}) => {
	const [confirmDeleteAllModal, setConfirmDeleteAllModal] = useState(false);
	const [, setError] = useState(false);

	const openDeleteModal = (e) => {
		setConfirmDeleteAllModal(true);
	};

	const closeDeleteModal = (e) => {
		setConfirmDeleteAllModal(false);
	};

	const deleteObject = async (e) => {
		e.preventDefault();
		await action(id, sId)
			.then(() => {
				console.log("All from this collection has been deleted");
			})
			.catch((err) => {
				setError(true);
			});
		if (sId) {
			setObjects(objects.filter((object) => object._id !== sId));
		} else {
			setObjects(objects.filter((object) => object._id !== id));
		}
		setTotalResults(objects.length - 1);
	};

	return (
		<>
			<Button
				variant={`danger`}
				size={size}
				onClick={openDeleteModal}
				data-target={`deleteModal#${id}`}
			>
				{/* <i className={`fas fa-trash-alt mr-1`} aria-hidden /> */}
				Delete
			</Button>
			{confirmDeleteAllModal && (
				<Modal
					show={true}
					onHide={closeDeleteModal}
					backdrop={true}
					animation={true}
					size={`sm`}
					id={`deleteModal#${id}`}
				>
					<Modal.Header closeButton>
						<Modal.Title>Are you sure about this?</Modal.Title>
					</Modal.Header>
					<Modal.Body>
						You are about to delete everything from this collection
					</Modal.Body>
					<Modal.Footer>
						<Button
							variant={`secondary`}
							size={`sm`}
							onClick={closeDeleteModal}
						>
							Close
						</Button>
						<Button
							type={`submit`}
							size={`sm`}
							onClick={deleteObject}
							variant={`primary`}
						>
							Submit
						</Button>
					</Modal.Footer>
				</Modal>
			)}
		</>
	);
};

export default DeleteAllModal;
