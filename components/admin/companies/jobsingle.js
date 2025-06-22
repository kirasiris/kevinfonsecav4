"use client";
import Link from "next/link";
import DropdownButton from "react-bootstrap/DropdownButton";
import DeleteModal from "@/components/global/deletemodal";

const Single = ({
	object = {},
	handleDraft = () => {},
	handlePublish = () => {},
	handleTrash = () => {},
	handleSchedule = () => {},
	handleDelete = () => {},
	objects = [],
	setObjects = () => {},
	setTotalResults = () => {},
}) => {
	return (
		<li className="list-group-item">
			<div className="float-start">
				<Link
					href={{
						pathname: `/noadmin/companies/job/${object?._id}/update`,
						query: {},
					}}
				>
					<span className="badge bg-secondary me-1">
						{object?.orderingNumber}
					</span>
					{object?.title}
				</Link>
			</div>
			<div className="float-end">
				<div className="blog-item__panel">
					<div className="blog-actions-ellipsis-menu">
						<span className="ellipsis-menu">
							<DropdownButton title="Options" variant="secondary">
								<Link
									href={{
										pathname: `/job/${object?._id}/${object?.slug}`,
										query: {
											isAdmin: true,
										},
									}}
									className="dropdown-item btn btn-link"
									target="_blank"
								>
									View&nbsp;It
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
								<hr />
								<Link
									href={{
										pathname: `/noadmin/reports/create`,
										query: {
											resourceId: object._id,
											onModel: `Job`,
										},
									}}
									className="dropdown-item btn btn-link"
								>
									Add&nbsp;Report
								</Link>
								<hr />
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
