"use client";
import Link from "next/link";
import DropdownButton from "react-bootstrap/DropdownButton";
import DeleteModal from "@/components/global/deletemodal";

const Single = ({
	object = {},
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
								pathname: `/noadmin/settings/update/${object._id}`,
								query: {},
							}}
							passHref
							legacyBehavior
						>
							<a className="blog-item__title-link">{object.title}</a>
						</Link>
					</h1>
					<div className="blog-item__meta">
						{/* <span className="blog-item__meta-time-status">{object.text}</span> */}
					</div>
				</div>
				<div className="blog-actions-ellipsis-menu">
					<span className="ellipsis-menu">
						<DropdownButton title="Options" variant="secondary">
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