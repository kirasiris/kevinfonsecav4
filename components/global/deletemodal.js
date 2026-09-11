"use client";
import { useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";

const DeleteModal = ({
	id = null,
	sId = null,
	location = ``,
	as = `button`,
	size = `sm`,
	classStr = ``,
	action = () => {},
	action2 = () => {},
	objects = [],
	setObjects = () => {},
	setTotalResults = () => {},
	displayText = true,
}) => {
	const [confirmDeleteModal, setConfirmDeleteModal] = useState(false);
	const [, setError] = useState(false);

	const deleteObject = async (e) => {
		e.preventDefault();
		await action(id, sId)
			.then(() => {
				if (typeof action2 === `function`) {
					action2(location)
						.then(() => {
							console.log(`Done`);
						})
						.catch((err) => {
							setError(true);
						});
				}
			})
			.catch((err) => {
				setError(true);
			});
		if (sId) {
			setObjects(objects?.filter((object) => object._id !== sId));
		} else {
			setObjects(objects?.filter((object) => object._id !== id));
		}
		setTotalResults(objects?.length - 1);
	};

	return (
		<>
			<Button
				variant={`danger`}
				size={size}
				onClick={() => setConfirmDeleteModal(!confirmDeleteModal)}
				data-target={`deleteModal#${id}`}
				as={as}
				className={classStr}
			>
				{displayText ? (
					"Delete"
				) : (
					<i className={`fas fa-trash-alt`} aria-hidden />
				)}
			</Button>
			<Modal
				show={confirmDeleteModal}
				onHide={() => setConfirmDeleteModal(!confirmDeleteModal)}
				backdrop={true}
				animation={true}
				size={`sm`}
				id={`deleteModal#${id}`}
			>
				<Modal.Header closeButton>
					<div className="modal-title h4">Are you sure?</div>
				</Modal.Header>
				<div className="modal-body">{id}</div>
				<div className="modal-footer">
					<button
						className="btn btn-secondary btn-sm"
						onClick={() => setConfirmDeleteModal(!confirmDeleteModal)}
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
				</div>
			</Modal>
		</>
	);
};

export default DeleteModal;
