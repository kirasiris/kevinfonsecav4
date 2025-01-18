"use client";
// import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Globalsidebar from "../sidebar";

const Sidebar = ({}) => {
	const router = useRouter();
	const [searchParams, setSearchParams] = useState({
		keyword: "",
	});

	const { keyword } = searchParams;

	const searchData = async (e) => {
		e.preventDefault();
		router.push(
			`/realstate/search?keyword=${keyword}&page=1&limit=10&sort=-createdAt`
		);
	};

	return (
		<Globalsidebar>
			{/* Search box */}
			<div className="card mb-4">
				<div className="card-header">Search</div>
				<div className="card-body">
					<form onSubmit={searchData}>
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
								placeholder="Enter search term..."
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
		</Globalsidebar>
	);
};

export default Sidebar;
