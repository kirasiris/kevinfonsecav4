"use client";
import Link from "next/link";
import DropdownButton from "react-bootstrap/DropdownButton";
import { formatDateWithoutTime } from "befree-utilities";
import PreviewModal from "@/components/noadmin/animes/chapterpreviewmodal";
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
	isDeleting = false,
	dragProps = {},
}) => {
	console.log("Video", object);
	const { className = "", ...restDragProps } = dragProps;

	return (
		<li
			className={`list-group-item ${object?.raw.orderingNumber} ${className}`}
			{...restDragProps}
		>
			<div className="float-start">
				<Link
					href={{
						pathname: `/noadmin/animes/chapter/${object.key}/update`,
						query: {},
					}}
				>
					{object?.raw.title}
				</Link>
				<div className="blog-item__meta">
					<span className="badge bg-secondary me-1">{index + 1}</span>
					{object.raw.files?.video_url?.format_type && (
						<span className={`${object.info.textClass} me-1`}>
							<FileIcon type={object.raw.files.video_url.format_type} />
						</span>
					)}
					{object.raw.files?.video_url?.size && (
						<span className="badge bg-secondary me-1">
							{formatFileSize(object.raw.files.video_url.size)}
						</span>
					)}
					<span className="badge bg-dark me-1">
						{formatDateWithoutTime(object.raw.createdAt)}
					</span>
					<span className="badge bg-dark me-1">{object.raw.status}</span>
					<span className={`badge ${object.info.className}`}>
						{object.info.label}
					</span>
					{object.raw.featured && (
						<span className="badge bg-dark me-1">featured</span>
					)}
				</div>
			</div>
			<div className="float-end">
				<div className="blog-item__panel">
					{object.raw.free_preview && <PreviewModal object={object} />}
					<span className="badge bg-info me-1">{object.raw.duration}</span>
					<span className="badge bg-secondary me-1">
						{object.raw.views}&nbsp;Views
					</span>
					<span className="badge bg-dark me-1">
						{object?.raw?.language.toUpperCase()}
					</span>
					<div className="blog-actions-ellipsis-menu">
						<span className="ellipsis-menu">
							<DropdownButton title="Options" variant="secondary">
								<Link
									href={{
										pathname: `/noadmin/animes/chapter/${object.key}/read`,
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
									disabled={isDeleting}
									onClick={() => handleDraft(object.raw)}
								>
									{isDeleting ? "..." : "Draft It"}
								</button>
								<button
									type="button"
									className="dropdown-item btn btn-sm"
									disabled={isDeleting}
									onClick={() => handlePublish(object.raw)}
								>
									{isDeleting ? "..." : "Publish It"}
								</button>
								<button
									type="button"
									className="dropdown-item btn btn-sm"
									disabled={isDeleting}
									onClick={() => handleTrash(object.raw)}
								>
									{isDeleting ? "..." : "Trash It"}
								</button>
								<button
									type="button"
									className="dropdown-item btn btn-sm"
									disabled={isDeleting}
									onClick={() => handleSchedule(object.raw)}
								>
									{isDeleting ? "..." : "Schedule It"}
								</button>
								<hr />
								<Link
									href={{
										pathname: `/noadmin/comments/create`,
										query: {
											resourceId: object.raw._id,
											onModel: `Video`,
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
											resourceId: object.raw._id,
											onModel: `Video`,
										},
									}}
									className="dropdown-item btn btn-link"
								>
									Add&nbsp;Report
								</Link>
								<hr />
								<button
									type="button"
									className="dropdown-item btn-danger btn-sm"
									disabled={isDeleting}
									onClick={() => handleDelete(object.raw)}
								>
									{isDeleting ? "..." : "Delete it"}
								</button>
							</DropdownButton>
						</span>
					</div>
				</div>
			</div>
		</li>
	);
};

export default Single;
