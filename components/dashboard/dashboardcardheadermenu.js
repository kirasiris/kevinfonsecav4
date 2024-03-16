"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import DeleteAllModal from "../../components/global/deleteallmodal";
import TrashAllModal from "../global/trashallmodal";

const DashboardCardHeaderMenu = ({
	allLink = "",
	pageText = "",
	currentResults = 0,
	totalResults = 0,
	addLink = "#",
	addLinkText = "",
	handleTrashAllFunction,
	handleDeleteAllFunction,
	setKeyword,
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
			`${allLink}/search?keyword=${keyword}&page=1&limit=10&sort=-createdAt`
		);
	};

	return (
		<div className={`card-header ${classList}`}>
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
						<div className="input-group">
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
							<button
								type="submit"
								className="btn btn-secondary"
								disabled={keyword.length > 0 ? !true : !false}
							>
								Go!
							</button>
						</div>
					</form>
				</div>
			</div>
			<div className="float-end my-1">
				<div className="btn-group">
					<Link
						href={{
							pathname: addLink,
							query: {},
						}}
						passHref
						legacyBehavior
					>
						{/* <a className="btn btn-primary btn-sm">Add new {addLinkText}</a> */}
						<a className="btn btn-primary btn-sm">Add new</a>
					</Link>
					<TrashAllModal action={handleTrashAllFunction} />
					<DeleteAllModal action={handleDeleteAllFunction} />
				</div>
			</div>
		</div>
	);
};

export default DashboardCardHeaderMenu;
