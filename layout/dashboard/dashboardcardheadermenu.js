"use client";
import { useContext } from "react";
import Link from "next/link";
import DeleteAllModal from "@/components/global/deleteallmodal";
import TrashAllModal from "@/components/global/trashallmodal";
import AuthContext from "@/helpers/globalContext";

const DashboardCardHeaderMenu = ({
	allLink = "",
	pageText = "",
	currentResults = 0,
	totalResults = 0,
	addLink = "#",
	addLinkText = "",
	handleTrashAllFunction,
	handleDeleteAllFunction,
	keyword = "",
	setKeyword,
	classList = "",
}) => {
	const { auth } = useContext(AuthContext);
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
					<form className="d-none d-md-block d-lg-block d-xl-block d-xxl-block">
						<div className="input-group">
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
					{auth?.user?.stripe.stripeChargesEnabled && (
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

export default DashboardCardHeaderMenu;
