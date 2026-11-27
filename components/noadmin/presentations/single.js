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
	handleDraft = () => {},
	handlePublish = () => {},
	handleTrash = () => {},
	handleSchedule = () => {},
	handleFeature = () => {},
	handleUnfeature = () => {},
	handleDelete = () => {},
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
								pathname: `/noadmin/presentations/update/${id}`,
								query: {},
							}}
							className="blog-item__title-link"
						>
							{object.title}
						</Link>
					</h1>
					<div className="blog-item__meta">
						<span className="badge bg-dark me-1">
							<LocalDate value={object.createdAt} />
						</span>
						<span className="badge bg-dark me-1">{object.status}</span>
						{object.featured && (
							<span className="badge bg-dark me-1">featured</span>
						)}
					</div>
				</div>
				<div className="blog-type-list__blog-thumbnail-wrapper has-image d-none d-md-block d-lg-block d-xl-block d-xxl-block">
					<Link
						href={{
							pathname: `/noadmin/presentations/update/${id}`,
							query: {},
						}}
						className="blog-type-list__blog-thumbnail-link"
					>
						<Image
							src={
								object.files?.avatar?.location.secure_location ||
								`https://picsum.photos/83/63?blur`
							}
							className="blog-type-list__blog-thumbnail"
							alt={`${object.title}' avatar`}
							width="83"
							height="63"
						/>
					</Link>
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
									pathname: `/noadmin/presentations/read/${object._id}`,
									query: {
										isAdmin: true,
									},
								}}
								className="dropdown-item btn btn-link"
							>
								View&nbsp;It
							</Link>
							<hr />
							<Link
								href={{
									pathname: `/noadmin/comments/create`,
									query: {
										resourceId: id,
										onModel: `Presentation`,
									},
								}}
								className="dropdown-item btn btn-link"
							>
								Add&nbsp;Comment
							</Link>
							<Link
								href={{
									pathname: `/noadmin/reports/create`,
									query: {
										resourceId: id,
										onModel: `Presentation`,
									},
								}}
								className="dropdown-item btn btn-link"
							>
								Add&nbsp;Report
							</Link>
							<hr />
							<DeleteModal
								id={id}
								sId={null}
								location=""
								as="button"
								size="sm"
								classStr={`dropdown-item`}
								action={() => handleDelete(object)}
								itemTitle={object.title}
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
