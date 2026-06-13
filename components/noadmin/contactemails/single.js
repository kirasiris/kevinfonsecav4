"use client";
import Link from "next/link";
import DropdownButton from "react-bootstrap/DropdownButton";
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
								pathname: `/noadmin/contactemails/read/${object._id}`,
								query: {},
							}}
							className="blog-item__title-link"
						>
							{object.email}&nbsp;-&nbsp;{object.subject}
						</Link>
					</h1>
					<div className="blog-item__meta">
						<span className="blog-item__meta-time-status">
							{object.name}&nbsp;-&nbsp;{object.ipAddress}
						</span>
					</div>
				</div>
				<div className="blog-actions-ellipsis-menu">
					<span className="ellipsis-menu">
						<DropdownButton title="Options" variant="secondary">
							<Link
								href={{
									pathname: `/noadmin/contactemails/read/${object._id}`,
									query: {
										isAdmin: true,
									},
								}}
								className="dropdown-item btn btn-link"
							>
								View&nbsp;It
							</Link>
							<hr />
							<DeleteModal
								id={object._id}
								sId={null}
								location=""
								as="button"
								size="sm"
								classStr={`dropdown-item`}
								action={handleDelete}
								action2={() => {}}
								objects={objects}
								setObjects={setObjects}
								setTotalResults={setTotalResults}
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
