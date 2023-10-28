"use client";
import Link from "next/link";
import DeleteAllModal from "../../components/global/deleteallmodal";

const AdminCardHeaderMenu = ({
	allLink = "",
	pageText = "",
	currentResults = 0,
	totalResults = 0,
	addLink = "#",
	addLinkText = "",
	handleDeleteAllFunction,
	keyword = "",
	setKeyword,
}) => {
	return (
		<div className="card-header">
			<div className="float-start objects-quantity-and-search-bar">
				<Link
					href={{
						pathname: allLink,
						query: { page: 1, limit: 10 },
					}}
					passHref
					legacyBehavior
				>
					<a className="btn btn-link btn-sm">
						{pageText} - ({currentResults} / {totalResults})
					</a>
				</Link>
				<form className="d-none d-md-block d-lg-block d-xl-block d-xxl-block">
					<input
						id="keyword"
						name="keyword"
						value={keyword}
						onChange={(e) => {
							e.preventDefault();
							setKeyword(e.target.value);
						}}
						type="text"
						className="form-control"
						placeholder="Search title of object (EXACT MATCH)"
					/>
				</form>
			</div>
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
