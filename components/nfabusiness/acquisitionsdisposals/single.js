"use client";
import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import DropdownButton from "react-bootstrap/DropdownButton";
import LocalDate from "@/components/global/localdate";
import DeleteModal from "@/components/global/deletemodal";
import {
	actionFailed,
	flashElement,
	shakeElement,
	useRowMotion,
} from "@/components/global/actionfeedback";

const Single = ({
	object = {},
	handleAcquire = () => {},
	handleDispose = () => {},
	handleDraft = () => {},
	handlePublish = () => {},
	handleTrash = () => {},
	handleSchedule = () => {},
	handleFeature = () => {},
	handleUnfeature = () => {},
	handleDelete = () => {},
	isAcquiring = false,
	isDisposing = false,
	isDrafting = false,
	isPublishing = false,
	isTrashing = false,
	isScheduling = false,
	isFeaturing = false,
	isUnfeaturing = false,
	isDeleting = false,
	leaving = false,
	entering = false,
	onLeft = () => {},
	onEntered = () => {},
	onDeleted = () => {},
}) => {
	const rowRef = useRef(null);
	const id = object._id;

	const busyLabel =
		(isAcquiring && "Acquiring") ||
		(isDisposing && "Disposing") ||
		(isDrafting && "Drafting") ||
		(isPublishing && "Publishing") ||
		(isTrashing && "Trashing") ||
		(isScheduling && "Scheduling") ||
		(isFeaturing && "Featuring") ||
		(isUnfeaturing && "Unfeaturing") ||
		(isDeleting && "Deleting") ||
		"";

	const isBusy = busyLabel !== "";

	useRowMotion(rowRef, { id, leaving, entering, onLeft, onEntered });

	const run = async (handler) => {
		const res = await handler(object);
		const node = rowRef.current;
		if (!node) return;
		if (actionFailed(res)) {
			flashElement(node, "error");
			shakeElement(node);
		} else {
			flashElement(node, "success");
		}
	};

	return (
		<li
			ref={rowRef}
			className="list-group-item"
			aria-busy={isBusy || undefined}
			style={
				leaving
					? { overflow: "hidden", pointerEvents: "none" }
					: entering
						? { overflow: "hidden" }
						: undefined
			}
		>
			<div className="blog-item__panel">
				<div
					className="blog-item__detail"
					style={{
						opacity: isBusy ? 0.55 : 1,
						transition: "opacity 150ms ease",
					}}
				>
					<div className="blog-item__info"></div>
					<h1 className="blog-item__title">
						<Link
							href={{
								pathname: `/nfabusiness/acquisitionsdisposals/update/${id}`,
								query: {},
							}}
							className="blog-item__title-link"
						>
							{object.manufacturer}&nbsp;-&nbsp;
							{object.title}&nbsp;-&nbsp;
							{object.caliber}
						</Link>
					</h1>
					<div className="blog-item__meta">
						<span className="badge bg-primary me-1">
							Transfer:&nbsp;#{object.orderingNumber}
						</span>
						<span className="badge bg-dark me-1">
							<LocalDate value={object.createdAt} />
						</span>
						<span className="badge bg-danger me-1">
							Account:&nbsp;-&nbsp;{object.hasAccount.toString()}
						</span>
						<span className="badge bg-dark me-1">{object.status}</span>
					</div>
				</div>
				<div className="blog-actions-ellipsis-menu">
					<span className="ellipsis-menu">
						<DropdownButton
							title={
								<span className="position-relative d-inline-block">
									<span className={isBusy ? "invisible" : undefined}>
										Options
									</span>
									{isBusy && (
										<span className="position-absolute top-50 start-50 translate-middle d-flex">
											<span
												className="spinner-border spinner-border-sm"
												aria-hidden="true"
											/>
											<span className="visually-hidden">{busyLabel}...</span>
										</span>
									)}
								</span>
							}
							variant="secondary"
							disabled={isBusy || leaving}
						>
							<Link
								href={{
									pathname: `/nfabusiness/acquisitionsdisposals/read/${id}`,
									query: {
										isAdmin: true,
									},
								}}
								className="dropdown-item btn btn-link"
							>
								View&nbsp;It
							</Link>
							{!object.hasAccount && (
								<Link
									href={{
										pathname: `/nfabusiness/acquisitionsdisposals/read/${id}/create/useraccount`,
										query: {},
									}}
									className="dropdown-item btn btn-link"
								>
									Create&nbsp;Account
								</Link>
							)}
							<button
								type="button"
								className="dropdown-item btn btn-sm"
								disabled={isBusy}
								onClick={() => run(handleAcquire())}
							>
								{isAcquiring ? <>Acquiring&hellip;</> : <>Acquire&nbsp;It</>}
							</button>
							<button
								type="button"
								className="dropdown-item btn btn-sm"
								disabled={isBusy}
								onClick={() => run(handleDispose())}
							>
								{isDisposing ? <>Disposing&hellip;</> : <>Dispose&nbsp;It</>}
							</button>
						</DropdownButton>
					</span>
				</div>
			</div>
		</li>
	);
};

export default Single;
