"use client";
import { useId } from "react";
import Modal from "react-bootstrap/Modal";
import { useConfirmAction } from "@/components/global/actionfeedback";

const TrashAllModal = ({
	action = () => {},
	classList = "btn-dark",
	disabled = false,
}) => {
	const titleId = useId();

	const { show, pending, error, bodyRef, open, close, confirm, handleExited } =
		useConfirmAction({
			action,
			failText: "Could not move everything to the trash. Please try again.",
		});

	return (
		<>
			<button
				className={`btn ${classList} btn-sm`}
				type="button"
				onClick={open}
				disabled={disabled}
			>
				Trash all
			</button>
			<Modal
				show={show}
				onHide={close}
				onExited={handleExited}
				size={`xl`}
				backdrop={pending ? "static" : true}
				keyboard={!pending}
				animation={true}
				aria-labelledby={titleId}
			>
				<Modal.Header closeButton>
					<div className="modal-title h4" id={titleId}>
						Are you sure about this?
					</div>
				</Modal.Header>
				<div className="modal-body" ref={bodyRef}>
					You are about to move everything to trash!
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
								Trashing...
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

export default TrashAllModal;
