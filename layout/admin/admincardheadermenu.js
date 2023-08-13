"use client";
import Link from "next/link";
import DeleteAllModal from "../deleteallmodal";

const AdminCardHeaderMenu = ({
	allLink = "",
	pageText = "",
	totalResults,
	addLink = "#",
	addLinkText = "",
	handleDeleteAllFunction,
}) => {
	return (
		<div className="card-header">
			<Link
				href={{
					pathname: allLink,
					query: { page: 1, limit: 10 },
				}}
				passHref
				legacyBehavior
			>
				<a className="btn btn-link btn-sm float-start">
					{pageText} - ({totalResults})
				</a>
			</Link>
			<div className="btn-group float-end">
				<Link
					href={{
						pathname: addLink,
						query: {},
					}}
					passHref
					legacyBehavior
				>
					<a className="btn btn-primary btn-sm">Add new {addLinkText}</a>
				</Link>
				<DeleteAllModal action={handleDeleteAllFunction} />
			</div>
		</div>
	);
};

export default AdminCardHeaderMenu;
