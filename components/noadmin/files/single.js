"use client";
import Link from "next/link";
import DropdownButton from "react-bootstrap/DropdownButton";
import { formatFileSize } from "@/helpers/formatFileSize";

const FileIcon = ({ type }) => {
	switch (type) {
		case "audio":
			return <i className="fa-solid fa-file-audio fa-xl" />;
		case "video":
			return <i className="fa-solid fa-file-video fa-xl" />;
		case "image":
			return <i className="fa-solid fa-file-image fa-xl" />;
		default:
			return <i className="fa-solid fa-file-pdf fa-xl" />;
	}
};

const Single = ({
	index = 0,
	object = {},
	handleDelete = () => {},
	isDeleting = false,
}) => {
	return (
		<div className="col-12 col-sm-6 col-md-4 col-lg-3">
			<div className="card rounded-0">
				<div className="card-header d-flex justify-content-between align-items-center py-2">
					<div className="d-flex align-items-center gap-2">
						<span className="badge bg-secondary">{index + 1}</span>
						<span className={object.info.textClass}>
							<FileIcon type={object.info.type} />
						</span>
					</div>
					<span className={`badge ${object.info.className}`}>
						{object.info.label}
					</span>
				</div>
				<div className="card-body p-2">
					{object.info.type === "image" && object.url ? (
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
					) : object.info.type === "video" && object.url ? (
						<video
							src={object.url}
							controls
							preload="metadata"
							className="w-100"
							style={{ height: "150px", objectFit: "fill" }}
						/>
					) : object.info.type === "audio" && object.url ? (
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
							<FileIcon type={object.info.type} />
						</div>
					)}
				</div>
				<div className="card-footer py-2">
					<Link
						href={{
							pathname: `/noadmin/files/update/${object.raw._id}`,
						}}
						className="mb-1 small fw-medium"
					>
						{object.raw.album}
					</Link>
					<div className="d-flex justify-content-between align-items-center gap-2">
						<small>{formatFileSize(object.size)}</small>
						<div className="d-flex gap-1">
							<DropdownButton
								title="..."
								variant="secondary"
								size="sm"
								className="py-0"
							>
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
								<hr />
								<Link
									href={{
										pathname: `/noadmin/comments/create`,
										query: {
											resourceId: object.raw._id,
											onModel: `File`,
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
											onModel: `File`,
										},
									}}
									className="dropdown-item"
								>
									Add&nbsp;Report
								</Link>
							</DropdownButton>
							<button
								type="button"
								className="btn btn-danger btn-sm py-0"
								disabled={isDeleting}
								onClick={() => {
									handleDelete(object?.raw);
								}}
							>
								{isDeleting ? "..." : "Delete"}
							</button>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Single;
