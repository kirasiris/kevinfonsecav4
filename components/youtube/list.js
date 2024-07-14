"use client";
import { useEffect, useState } from "react";
import Single from "./single";

const List = ({ featured = {}, objects = [], searchParams = {} }) => {
	const [keyword, setKeyword] = useState("");
	const [list, setList] = useState([]);

	useEffect(() => {
		setList(objects.data);
	}, [objects.data]);

	useEffect(() => {
		if (keyword !== "") {
			const result = objects.data.filter((object) => {
				return object.title.toLowerCase().startsWith(keyword.toLowerCase());
			});
			setList(result);
		} else {
			setList(objects.data);
		}
	}, [keyword, objects.data]);

	return (
		<>
			<input
				id="keyword"
				name="keyword"
				defaultValue={keyword}
				onChange={(e) => {
					e.preventDefault();
					setKeyword(e.target.value);
				}}
				type="text"
				className="form-control mb-3"
				placeholder="Search..."
			/>

			{list?.length > 0 && (
				<>
					<hr />
					<h2>Videos found ({list.length})...</h2>
					<p className="p-3 text-bg-danger">
						Data gets deleted on the 15 of each month
					</p>
					<hr />
				</>
			)}
			<div
				className="card list-container"
				style={{
					height: "1300px",
					overflowY: "auto",
				}}
			>
				{list?.length > 0 ? (
					<ul className="list-group list-group-flush">
						{list.map(
							(video) =>
								video !== undefined &&
								video !== null && <Single key={video?._id} object={video} />
						)}
					</ul>
				) : (
					<div className="alert alert-danger m-0 rounded-0">Nothing found</div>
				)}
			</div>
		</>
	);
};

export default List;
