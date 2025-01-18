"use client";
import Link from "next/link";
import DropdownButton from "react-bootstrap/DropdownButton";
import DeleteModal from "@/components/global/deletemodal";

const Single = ({
	object = {},
	handleDraft,
	handlePublish,
	handleTrash,
	handleSchedule,
	handleDelete,
	objects,
	setObjects,
	setTotalResults,
}) => {
	return (
		<li className="list-group-item">
			<div className="float-start">
				<Link
					href={{
						pathname: `/noadmin/menus/page/${object?._id}/update`,
						query: {},
					}}
					passHref
					legacyBehavior
				>
					<a className="me-1">
						<span className="badge bg-secondary me-1">
							{object?.orderingNumber}
						</span>
						{object?.title}
					</a>
				</Link>
				<span className="badge bg-dark me-1">{object?.rel}</span>
				<span className="badge bg-dark me-1">{object?.target}</span>
				<span className="badge bg-dark me-1">{object?.status}</span>
			</div>
			<div className="float-end">
				<div className="blog-item__panel">
					<div className="blog-actions-ellipsis-menu">
						<span className="ellipsis-menu">
							<DropdownButton title="Options" variant="secondary">
								<Link
									href={{
										pathname: object?.url,
										query: {
											isAdmin: true,
										},
									}}
									passHref
									legacyBehavior
								>
									<a className="dropdown-item btn btn-link">View&nbsp;It</a>
								</Link>
								<button
									className="dropdown-item btn btn-sm"
									onClick={() => handleDraft(object._id)}
								>
									Draft&nbsp;It
								</button>
								<button
									className="dropdown-item btn btn-sm"
									onClick={() => handlePublish(object._id)}
								>
									Publish&nbsp;It
								</button>
								<button
									className="dropdown-item btn btn-sm"
									onClick={() => handleTrash(object._id)}
								>
									Trash&nbsp;It
								</button>
								<button
									className="dropdown-item btn btn-sm"
									onClick={() => handleSchedule(object._id)}
								>
									Schedule&nbsp;It
								</button>
								<DeleteModal
									id={object._id ? object._id : object._id}
									action={handleDelete}
									classStr={`dropdown-item`}
									objects={objects}
									setObjects={setObjects}
									setTotalResults={setTotalResults}
								/>
							</DropdownButton>
						</span>
					</div>
				</div>
			</div>
		</li>
	);
};

export default Single;
