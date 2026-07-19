"use client";
import Link from "next/link";
import DropdownButton from "react-bootstrap/DropdownButton";
import { formatDateWithoutTime } from "befree-utilities";
import { formatFileSize } from "@/helpers/formatFileSize";

const FileIcon = ({ type }) => {
	switch (type) {
		case "audio":
			return <i aria-hidden className="fa-solid fa-file-audio fa-xl" />;
		case "video":
			return <i aria-hidden className="fa-solid fa-file-video fa-xl" />;
		case "image":
			return <i aria-hidden className="fa-solid fa-file-image fa-xl" />;
		default:
			return <i aria-hidden className="fa-solid fa-file-pdf fa-xl" />;
	}
};

const Single = ({
	index = 0,
	object = {},
	handleDraft = () => {},
	handlePublish = () => {},
	handleTrash = () => {},
	handleSchedule = () => {},
	handleDelete = () => {},
	isDrafting = false,
	isPublishing = false,
	isTrashing = false,
	isScheduling = false,
	isDeleting = false,
	dragProps = {},
}) => {
	const { className = "", ...restDragProps } = dragProps;

	const isBusy =
		isDrafting || isPublishing || isTrashing || isScheduling || isDeleting;

	return (
		<div
			className={`col-12 col-sm-6 col-md-4 col-lg-3 ${className}`}
			{...restDragProps}
		>
			<div className="card rounded-0">
				<div className="card-header d-flex justify-content-between align-items-center py-2">
					<div className="d-flex align-items-center gap-2">
						<span className="badge bg-secondary">{index + 1}</span>
						{object.raw.files?.audio_url?.format_type && (
							<span className={object.info.textClass}>
								<FileIcon type={object.raw.files.audio_url.format_type} />
							</span>
						)}
					</div>
					<div className="d-flex align-items-center gap-2">
						<span className="badge bg-dark">
							{formatDateWithoutTime(object.raw.createdAt)}
						</span>
						<span className={`badge bg-dark`}>{object.raw.status}</span>
						<span className={`badge ${object.info.className}`}>
							{object.info.label}
						</span>
					</div>
				</div>
				<div className="card-body p-2">
					{object.raw.files.audio_url.format_type === "image" && object.url ? (
						<img
							src={object?.url || "/placeholder.svg"}
							alt={object.filename}
							loading="lazy"
							className="img-fluid"
							style={{
								height: "150px",
								width: "100%",
								objectFit: "fill",
							}}
						/>
					) : object.raw.files.audio_url.format_type === "video" &&
					  object.url ? (
						<video
							src={object.url}
							controls
							preload="metadata"
							className="w-100"
							style={{ height: "150px", objectFit: "fill" }}
						/>
					) : object.raw.files.audio_url.format_type === "audio" &&
					  object.url ? (
						<div
							className="d-flex align-items-center p-1 admin-multimedia-manager-audio-file"
							style={{ height: "150px" }}
						>
							<audio
								src={object.url}
								controls
								preload="metadata"
								className="w-100"
							/>
						</div>
					) : (
						<div
							className="d-flex align-items-center justify-content-center admin-multimedia-manager-doc-file"
							style={{ height: "150px" }}
						>
							<FileIcon type={object.raw.files.audio_url.format_type} />
						</div>
					)}
				</div>
				<div className="card-footer py-2">
					<Link
						href={{
							pathname: `/noadmin/cdalbums/song/${object.key}/update`,
						}}
						className="mb-1 small fw-medium"
					>
						{object.raw.title}
					</Link>
					<div className="d-flex justify-content-between align-items-center gap-2">
						{object.raw.files?.audio_url?.size && (
							<small>{formatFileSize(object.raw.files.audio_url.size)}</small>
						)}
						<div className="d-flex gap-1">
							<DropdownButton
								title="..."
								variant="secondary"
								size="sm"
								className="py-0"
							>
								<Link
									href={{
										pathname: `/noadmin/cdalbums/song/${object.key}/read`,
										query: { isAdmin: true },
									}}
									className="dropdown-item btn btn-link"
								>
									View&nbsp;It
								</Link>
								{object.url && (
									<a
										href={object.url}
										target="_blank"
										rel="noopener noreferrer"
										className="dropdown-item"
									>
										Open
									</a>
								)}
								<Link
									href={{
										pathname: `/noadmin/cdalbums/song/${object.key}/update`,
										query: {},
									}}
									className="dropdown-item"
								>
									Update
								</Link>
								<hr />
								<button
									type="button"
									className="dropdown-item btn btn-sm"
									disabled={isBusy}
									onClick={() => handleDraft(object.raw)}
								>
									{isDrafting ? "..." : "Draft It"}
								</button>
								<button
									type="button"
									className="dropdown-item btn btn-sm"
									disabled={isBusy}
									onClick={() => handlePublish(object.raw)}
								>
									{isPublishing ? "..." : "Publish It"}
								</button>
								<button
									type="button"
									className="dropdown-item btn btn-sm"
									disabled={isBusy}
									onClick={() => handleTrash(object.raw)}
								>
									{isTrashing ? "..." : "Trash It"}
								</button>
								<button
									type="button"
									className="dropdown-item btn btn-sm"
									disabled={isBusy}
									onClick={() => handleSchedule(object.raw)}
								>
									{isScheduling ? "..." : "Schedule It"}
								</button>
								<hr />
								<Link
									href={{
										pathname: `/noadmin/comments/create`,
										query: {
											resourceId: object.raw._id,
											onModel: `Song`,
										},
									}}
									className="dropdown-item"
								>
									Add&nbsp;Comment
								</Link>
								<Link
									href={{
										pathname: `/noadmin/reports/create`,
										query: {
											resourceId: object.raw._id,
											onModel: `Song`,
										},
									}}
									className="dropdown-item"
								>
									Add&nbsp;Report
								</Link>
							</DropdownButton>
							<button
								type="button"
								className="btn btn-danger btn-sm"
								disabled={isBusy}
								onClick={() => {
									handleDelete(object?.raw);
								}}
							>
								{isDeleting ? "..." : "Delete it"}
							</button>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Single;
