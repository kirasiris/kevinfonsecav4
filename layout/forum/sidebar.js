"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Globalsidebar from "../sidebar";

const Sidebar = ({ quotes = [] }) => {
	const router = useRouter();
	const [searchParams, setSearchParams] = useState({
		keyword: "",
	});

	const { keyword } = searchParams;

	const searchData = async (e) => {
		e.preventDefault();
		router.push(
			`/forum/search?keyword=${keyword}&page=1&limit=10&sort=-createdAt`
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
			{/* Random quote box */}
			{quotes.data?.length > 0 && (
				<div className="card mb-4">
					<div className="card-header">Random Quote</div>
					<div className="card-body">
						{quotes.data?.map((quote, index) => (
							<figure key={quote._id}>
								<blockquote className="blockquote">
									<p>{quote.text.toUpperCase()}</p>
								</blockquote>
								<figcaption className="blockquote-footer">
									<a
										href={quote.authorUrl || "#"}
										target="_blank"
										rel="noreferrer noopener"
									>
										{quote.authorName}
									</a>
									&nbsp;-&nbsp;
									<cite title={quote.sourceWebsite}>
										<a
											href={quote.sourceUrl || "#"}
											target="_blank"
											rel="noreferrer noopener"
										>
											{quote.sourceWebsite}
										</a>
									</cite>
								</figcaption>
							</figure>
						))}
					</div>
				</div>
			)}
		</Globalsidebar>
	);
};

export default Sidebar;
