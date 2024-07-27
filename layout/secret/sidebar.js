"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Globalsidebar from "../sidebar";

const Sidebar = ({}) => {
	const router = useRouter();
	const [searchParams, setSearchParams] = useState({
		keyword: "",
		age: 13,
		sex: "male",
		nsfw: false,
	});

	const { keyword, age, sex, nsfw } = searchParams;

	const searchData = async (e) => {
		e.preventDefault();
		router.push(
			`/secret/search?keyword=${keyword}&age=${age}&sex=${sex}&nsfw=${nsfw}&page=1&limit=10`
		);
	};

	return (
		<Globalsidebar>
			<div className="card mb-4">
				<div className="card-header">Unlock NSFW</div>
				<div className="card-body">
					<Link
						href={{
							pathname: `/secret`,
							query: {
								page: 1,
								limit: 32,
								sort: "-createdAt",
								decrypt: true,
							},
						}}
						passHref
						legacyBehavior
					>
						<a>NSFW</a>
					</Link>
				</div>
			</div>
			{/* Search box */}
			<div className="card mb-4">
				<div className="card-header">Search</div>
				<div className="card-body">
					<form onSubmit={searchData}>
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
							className="form-control mb-3"
							placeholder="Enter search term..."
						/>
						<label htmlFor="age" className="form-label">
							Age
						</label>
						<input
							id="age"
							name="age"
							value={age}
							onChange={(e) => {
								const inputValue = e.target.value;
								if (/^\d+$/.test(inputValue) && parseInt(inputValue) >= 13) {
									setSearchParams({
										...searchParams,
										age: inputValue,
									});
								}
							}}
							type="number"
							className="form-control mb-3"
							min={13}
							max={100}
							placeholder="Enter age"
						/>
						<label htmlFor="sex" className="form-label">
							Sex
						</label>
						<select
							id="sex"
							name="sex"
							value={sex}
							onChange={(e) => {
								setSearchParams({
									...searchParams,
									sex: e.target.value,
								});
							}}
							className="form-control mb-3"
						>
							<option value={`male`}>Male</option>
							<option value={`female`}>Female</option>
							<option value={`non-binary`}>Non-binary</option>
						</select>
						<label htmlFor="nsfw" className="form-label">
							NSFW
						</label>
						<select
							id="nsfw"
							name="nsfw"
							value={nsfw}
							onChange={(e) => {
								setSearchParams({
									...searchParams,
									nsfw: e.target.value,
								});
							}}
							className="form-control mb-3"
						>
							<option value={true}>Yes</option>
							<option value={false}>No</option>
						</select>
						<button
							type="submit"
							className="btn btn-secondary btn-sm"
							disabled={keyword.length > 0 ? !true : !false}
						>
							Go!
						</button>
					</form>
				</div>
			</div>
		</Globalsidebar>
	);
};

export default Sidebar;
