"use client";
import Link from "next/link";
import DropdownButton from "react-bootstrap/DropdownButton";
import { formatDateWithoutTime } from "befree-utilities";
import DeleteModal from "@/components/global/deletemodal";

const Single = ({
	object = {},
	handleDelete = () => {},
	objects = [],
	setObjects = () => {},
	setTotalResults = () => {},
}) => {
	return (
		<li className="list-group-item">
			<div className="blog-item__panel">
				<div className="blog-item__detail">
					<div className="blog-item__info"></div>
					<h1 className="blog-item__title">
						<Link
							href={{
								pathname: `/noadmin/logs/update/${object._id}`,
								query: {},
							}}
							className="blog-item__title-link"
						>
							{object.message}
						</Link>
					</h1>
					<div className="blog-item__meta">
						<span className="blog-item__meta-time-status">
							<div
								className="blog-relative-time-status"
								title={`${object.createdAt}`}
							>
								<a
									className="blog-relative-time-status__link"
									href={`/logs/${object._id}`}
								>
									<span className="blog-relative-time-status__time">
										<time
											className="blog-relative-time-status__time-text"
											dateTime={object.createdAt}
										>
											{formatDateWithoutTime(object.createdAt)}
										</time>
									</span>
								</a>
							</div>
						</span>
						<ul className="blog-action-counts">
							<li>{object.error.statusCode}</li>
							<li>{object.error.status}</li>
							<li>{object.error.isOperacional}</li>
						</ul>
					</div>
				</div>
				<div className="blog-actions-ellipsis-menu">
					<span className="ellipsis-menu">
						<DropdownButton title="Options" variant="secondary">
							<Link
								href={{
									pathname: `/noadmin/logs/read/${object._id}`,
									query: {
										isAdmin: true,
									},
								}}
								className="dropdown-item btn btn-link"
								target="_blank"
							>
								View&nbsp;It
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
		</li>
	);
};

export default Single;
