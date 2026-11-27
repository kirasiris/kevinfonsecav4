"use client";
import { useId } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { useConfirmAction } from "@/components/global/actionfeedback";

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
	itemTitle = ``,
	disabled = false,
	onDeleted = () => {},
}) => {
	const titleId = useId();

	const runFollowUp = () => {
		if (typeof action2 !== `function`) return;
		try {
			Promise.resolve(action2(location)).catch((err) => console.error(err));
		} catch (err) {
			console.error(err);
		}
	};

	const { show, pending, error, bodyRef, open, close, confirm, handleExited } =
		useConfirmAction({
			action: () => action(id, sId),
			failText: "Could not delete it. Please try again.",
			onSuccess: () => {
				runFollowUp();
				const removedId = sId || id;
				setObjects(objects?.filter((object) => object._id !== removedId));
				setTotalResults(objects?.length - 1);
			},
			onDone: onDeleted,
		});

	return (
		<>
			<Button
				variant={`danger`}
				size={size}
				onClick={open}
				data-target={`deleteModal#${id}`}
				as={as}
				className={classStr}
				disabled={disabled}
			>
				{displayText ? (
					"Delete"
				) : (
					<i className={`fas fa-trash-alt`} aria-hidden />
				)}
			</Button>
			<Modal
				show={show}
				onHide={close}
				onExited={handleExited}
				backdrop={pending ? "static" : true}
				keyboard={!pending}
				animation={true}
				size={`sm`}
				id={`deleteModal#${id}`}
				aria-labelledby={titleId}
			>
				<Modal.Header closeButton>
					<div className="modal-title h4" id={titleId}>
						Are you sure?
					</div>
				</Modal.Header>
				<div className="modal-body" ref={bodyRef}>
					{itemTitle ? (
						<>
							<strong>{itemTitle}</strong> will be deleted permanently.
						</>
					) : (
						id
					)}
					{error && (
						<div
							className="alert alert-danger py-2 px-3 mt-3 mb-0 small"
							role="alert"
						>
							{error}
						</div>
					)}
				</div>
				<div className="modal-footer">
					<button
						type="button"
						className="btn btn-secondary btn-sm"
						onClick={close}
						disabled={pending}
					>
						Close
					</button>
					<button
						className="btn btn-primary btn-sm"
						type="submit"
						onClick={confirm}
						disabled={pending}
					>
						{pending ? (
							<>
								<span
									className="spinner-border spinner-border-sm me-1"
									aria-hidden="true"
								/>
								Deleting...
							</>
						) : error ? (
							"Try again"
						) : (
							"Submit"
						)}
					</button>
				</div>
			</Modal>
		</>
	);
};

export default DeleteModal;
