"use client";
import { useRef } from "react";
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

const excerptOf = (text = "", words = 8) => {
	const parts = String(text).trim().split(/\s+/);
	return parts.length > words
		? `${parts.slice(0, words).join(" ")}…`
		: parts.join(" ");
};

const Single = ({
	object = {},
	handleDraft = () => {},
	handlePublish = () => {},
	handleTrash = () => {},
	handleDelete = () => {},
	isDrafting = false,
	isPublishing = false,
	isTrashing = false,
	isDeleting = false,
	leaving = false,
	entering = false,
	onLeft = () => {},
	onEntered = () => {},
	onDeleted = () => {},
}) => {
	const rowRef = useRef(null);
	const id = object._id;
	const author = object.authorName || "Unknown author";

	const busyLabel =
		(isDrafting && "Drafting") ||
		(isPublishing && "Publishing") ||
		(isTrashing && "Trashing") ||
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
					<div className="blog-item__info">{object.text}</div>
					<h1 className="blog-item__title">
						<Link
							href={{
								pathname: `/noadmin/quotes/update/${id}`,
								query: {},
							}}
							className="blog-item__title-link"
						>
							{object.authorName}
						</Link>
					</h1>
					<div className="blog-item__meta">
						<span className="badge bg-dark me-1">
							<LocalDate value={object.createdAt} />
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
									pathname: `/noadmin/quotes/update/${id}`,
									query: {
										isAdmin: true,
									},
								}}
								className="dropdown-item btn btn-link"
							>
								View&nbsp;It
							</Link>
							<button
								type="button"
								className="dropdown-item btn btn-sm"
								disabled={isBusy}
								onClick={() => run(handleDraft)}
							>
								{isDrafting ? <>Drafting&hellip;</> : <>Draft&nbsp;It</>}
							</button>
							<button
								type="button"
								className="dropdown-item btn btn-sm"
								disabled={isBusy}
								onClick={() => run(handlePublish)}
							>
								{isPublishing ? <>Publishing&hellip;</> : <>Publish&nbsp;It</>}
							</button>
							<button
								type="button"
								className="dropdown-item btn btn-sm"
								disabled={isBusy}
								onClick={() => run(handleTrash)}
							>
								{isTrashing ? <>Trashing&hellip;</> : <>Trash&nbsp;It</>}
							</button>
							<hr />
							<DeleteModal
								id={id}
								sId={null}
								location=""
								as="button"
								size="sm"
								classStr={`dropdown-item`}
								action={() => handleDelete(object)}
								itemTitle={`"${excerptOf(object.text)}" by ${author}`}
								disabled={isBusy}
								onDeleted={() => onDeleted(id)}
								displayText={true}
							/>
						</DropdownButton>
					</span>
				</div>
			</div>
		</li>
	);
};

export default Single;
