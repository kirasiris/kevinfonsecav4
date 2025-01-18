"use client";
import { useState } from "react";
import Link from "next/link";
import DeleteAllModal from "../global/deleteallmodal";
import TrashAllModal from "../global/trashallmodal";
import { useRouter } from "next/navigation";

const AdminCardHeaderMenu = ({
	stripeChargesEnabled = false,
	allLink = "",
	pageText = "",
	currentResults = 0,
	totalResults = 0,
	addLink = "#",
	searchOn = "/noadmin",
	handleTrashAllFunction,
	handleDeleteAllFunction,
	classList = "",
}) => {
	const router = useRouter();

	const [searchParams, setSearchParams] = useState({
		keyword: "",
	});

	const { keyword } = searchParams;

	const searchData = async (e) => {
		e.preventDefault();
		router.push(
			`${searchOn}/search?keyword=${keyword}&page=1&limit=10&sort=-createdAt`
		);
	};

	return (
		<div className={`card-header${classList ? ` ${classList}` : ""}`}>
			<div className="float-start">
				<div className="d-flex align-items-center">
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
					<form
						onSubmit={searchData}
						className="d-none d-md-block d-lg-block d-xl-block d-xxl-block"
					>
						<input
							id="keyword"
							name="keyword"
							value={keyword}
							onChange={(e) => {
								setSearchParams({
									...searchParams,
									keyword: e.target.value,
								});
							}}
							type="text"
							className="form-control"
							placeholder="Search title of object (EXACT MATCH)"
						/>
					</form>
				</div>
			</div>
			<div className="float-end my-1">
				<div className="btn-group">
					{addLink === "/noadmin/courses/create" && stripeChargesEnabled ? (
						<Link
							href={{
								pathname: addLink,
								query: {},
							}}
							passHref
							legacyBehavior
						>
							<a className="btn btn-primary btn-sm">Add new</a>
						</Link>
					) : (
						<></>
					)}
					{addLink === "/noadmin/memberships/create" && stripeChargesEnabled ? (
						<Link
							href={{
								pathname: addLink,
								query: {},
							}}
							passHref
							legacyBehavior
						>
							<a className="btn btn-primary btn-sm">Add new</a>
						</Link>
					) : (
						<></>
					)}
					{addLink !== "" && addLink !== undefined && addLink !== null && (
						<Link
							href={{
								pathname: addLink,
								query: {},
							}}
							passHref
							legacyBehavior
						>
							<a className="btn btn-primary btn-sm">Add new</a>
						</Link>
					)}
					<TrashAllModal action={handleTrashAllFunction} />
					<DeleteAllModal action={handleDeleteAllFunction} />
				</div>
			</div>
		</div>
	);
};

export default AdminCardHeaderMenu;
