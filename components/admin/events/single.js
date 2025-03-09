"use client";
import Image from "next/image";
import Link from "next/link";
import DropdownButton from "react-bootstrap/DropdownButton";
import { formatDateWithoutTime } from "befree-utilities";
import DeleteModal from "@/components/global/deletemodal";
import ParseHtml from "@/layout/parseHtml";

const Single = ({
	object = {},
	handleDraft = () => {},
	handlePublish = () => {},
	handleTrash = () => {},
	handleSchedule = () => {},
	handleFeature = () => {},
	handleDelete = () => {},
	objects = [],
	setObjects = () => {},
	setTotalResults = () => {},
}) => {
	let bgcolor = object.priority === "low" && "bg-secondary text-bg-secondary";
	bgcolor = object.priority === "medium" && "bg-success text-bg-success";
	bgcolor = object.priority === "urgent" && "bg-danger text-bg-danger";
	return (
		<div className="col-lg-3">
			<div className={`card ${bgcolor} my-3 mx-1`}>
				<div className="card-header">{object.title}</div>
				<div className="card-body p-0">
					<ul className="list-group list-unstyled rounded-0">
						<li className="list-group-item border-end-0 border-start-0 border-top-0">
							Priority:&nbsp;{object.priority}
						</li>
						<li className="list-group-item border-end-0 border-start-0 border-top-0">
							Day:&nbsp;{object.day}
						</li>
						<li className="list-group-item border-end-0 border-start-0 border-top-0">
							Time:&nbsp;{object.time}
						</li>
						<li className="list-group-item border-end-0 border-start-0 border-top-0">
							Method:&nbsp;{object.method}
						</li>
						<li className="list-group-item border-end-0 border-start-0 border-top-0">
							Attendees:&nbsp;
							<div className="d-flex justify-content-center">
								{object.attendees.map((person, index) => (
									<pre key={index}>
										<p>{person.name}</p>
										<p>{person.email}</p>
										<p>{person.phoneNumber}</p>
									</pre>
								))}
							</div>
						</li>
						<li className="list-group-item border-end-0 border-start-0 border-top-0">
							<ParseHtml text={object.text} />
						</li>
					</ul>
				</div>
				<div className="card-footer">View details</div>
			</div>
			{/* <div className="blog-item__panel">
				<div className="blog-item__detail">
					<div className="blog-item__info"></div>
					<h1 className="blog-item__title">
						<Link
							href={{
								pathname: `/noadmin/blogs/update/${object._id}`,
								query: {},
							}}
							passHref
							legacyBehavior
						>
							<a className="blog-item__title-link">{object.title}</a>
						</Link>
					</h1>
					<div className="blog-item__meta">
						<span className="badge bg-dark me-1">
							{formatDateWithoutTime(object.createdAt)}
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
							pathname: `/noadmin/blogs/update/${object._id}`,
							query: {},
						}}
						passHref
						legacyBehavior
					>
						<a className="blog-type-list__blog-thumbnail-link">
							<Image
								src={
									object.files?.avatar?.location.secure_location ||
									`https://source.unsplash.com/random/83x63`
								}
								className="blog-type-list__blog-thumbnail"
								alt="Blog titles image"
								width="83"
								height="63"
							/>
						</a>
					</Link>
				</div>
				<div className="blog-actions-ellipsis-menu">
					<span className="ellipsis-menu">
						<DropdownButton title="Options" variant="secondary">
							<Link
								href={{
									pathname: `/noadmin/blogs/read/${object._id}`,
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
							<button
								className="dropdown-item btn btn-sm"
								onClick={() => handleFeature(object._id)}
							>
								Feature&nbsp;It
							</button>

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
			</div> */}
		</div>
	);
};

export default Single;
