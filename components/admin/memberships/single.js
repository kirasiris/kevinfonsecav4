"use client";
import Link from "next/link";
import DropdownButton from "react-bootstrap/DropdownButton";
import DeleteModal from "@/components/global/deletemodal";
import { currencyFormatter } from "@/helpers/utilities";

const Single = ({
	object = {},
	handleDraft,
	handlePublish,
	handleTrash,
	handleSchedule,
	handleActivate,
	handleDisactivate,
	handleDelete,
	objects,
	setObjects,
	setTotalResults,
}) => {
	return (
		<li className="list-group-item">
			<div className="blog-item__panel">
				<div className="blog-item__detail">
					<div className="blog-item__info"></div>
					<h1 className="blog-item__title">
						<Link
							href={{
								pathname: `/noadmin/memberships/update/${object._id}`,
								query: {},
							}}
							passHref
							legacyBehavior
						>
							<a className="blog-item__title-link">{object.title}</a>
						</Link>
					</h1>
					<div className="blog-item__meta">
						<span className="blog-item__meta-time-status">
							{currencyFormatter(object.default_price_data.unit_amount, "USD")}
						</span>
					</div>
				</div>
				<div className="blog-actions-ellipsis-menu">
					<span className="ellipsis-menu">
						<DropdownButton title="Options" variant="secondary">
							<Link
								href={{
									pathname: `/membership/read/${object._id}`,
									query: {
										isAdmin: true,
									},
								}}
								passHref
								legacyBehavior
							>
								<a className="dropdown-item btn btn-link" target="_blank">
									View&nbsp;It
								</a>
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
							{!object.active && (
								<button
									className="dropdown-item btn btn-sm"
									onClick={() => handleActivate(object._id)}
								>
									Activate&nbsp;It
								</button>
							)}
							{object.active && (
								<button
									className="dropdown-item btn btn-sm"
									onClick={() => handleDisactivate(object._id)}
								>
									Desactivate&nbsp;It
								</button>
							)}
							{!object.active && (
								<DeleteModal
									id={object._id ? object._id : object._id}
									action={handleDelete}
									classStr={`dropdown-item`}
									objects={objects}
									setObjects={setObjects}
									setTotalResults={setTotalResults}
								/>
							)}
						</DropdownButton>
					</span>
				</div>
			</div>
		</li>
	);
};

export default Single;