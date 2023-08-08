"use client";

import Image from "next/image";
import { useContext } from "react";

const AdminSidebar = ({
	displayAvatar = true,
	avatar = "",
	status = "draft",
	fullWidth = false,
	password = "",
	featured = false,
	commented = false,
	embedding = false,
	github = false,
	github_readme = "",
	category = undefined,
	categories = [],
	objectData = {},
	setObjectData,
	multipleFiles = false,
	onModel = "Blog",
}) => {
	// const {files, setFiles} = useContext(GlobalContext)

	return (
		<>
			{/* HERE GOES THE AVATAR */}
			{displayAvatar && (
				<>
					<button
						type="button"
						className="btn btn-secondary btn-sm btn-block"
						// onClick={() => setFiles({...files, showMediaModal: true})}
					>
						Featured Image
					</button>
					{/* <Image /> */}
				</>
			)}
			<label htmlFor="status" className="form-label">
				Status
			</label>
			<select
				id="status"
				name="status"
				value={status}
				onChange={(e) => {
					setObjectData({
						...objectData,
						status: e.target.value,
					});
				}}
				className="form-control"
			>
				<option value={`draft`}>Draft</option>
				<option value={`published`}>Published</option>
				<option value={`trash`}>Trash</option>
				<option value={`scheduled`}>Scheduled</option>
			</select>
			{fullWidth && (
				<>
					<label htmlFor="fullWidth" className="form-label">
						Full Width
					</label>
					<select
						id="fullWidth"
						name="fullWidth"
						value={fullWidth}
						onChange={(e) => {
							setObjectData({
								...objectData,
								fullWidth: e,
							});
						}}
						className="form-control"
					>
						<option value={true}>Yes</option>
						<option value={false}>No</option>
					</select>
				</>
			)}
			<label htmlFor="password" className="form-label">
				Password
			</label>
			<input
				id="password"
				name="password"
				value={password}
				onChange={(e) => {
					setObjectData({
						...objectData,
						password: e.target.value,
					});
				}}
				type="password"
				className="form-control mb-3"
				placeholder="******"
			/>
			{github &&
				(github_readme !== "" ||
					github_readme !== null ||
					github_readme !== undefined) && (
					<>
						<label htmlFor="github_readme" className="form-label">
							GitHub readME
						</label>
						<select
							id="github_readme"
							name="github_readme"
							value={github_readme}
							onChange={(e) => {
								setObjectData({
									...objectData,
									github_readme: e.target.value,
								});
							}}
							className="form-control"
						>
							<option value={`draft`}>Draft</option>
							<option value={`published`}>Published</option>
							<option value={`trash`}>Trash</option>
							<option value={`scheduled`}>Scheduled</option>
						</select>
					</>
				)}
			<label htmlFor="featured" className="form-label">
				Featured
			</label>
			<select
				id="featured"
				name="featured"
				value={featured}
				onChange={(e) => {
					setObjectData({
						...objectData,
						featured: e,
					});
				}}
				className="form-control"
			>
				<option value={true}>Yes</option>
				<option value={false}>No</option>
			</select>
			<label htmlFor="commented" className="form-label">
				Commented
			</label>
			<select
				id="commented"
				name="commented"
				value={commented}
				onChange={(e) => {
					setObjectData({
						...objectData,
						commented: e,
					});
				}}
				className="form-control"
			>
				<option value={true}>Yes</option>
				<option value={false}>No</option>
			</select>
			<label htmlFor="embedding" className="form-label">
				Embedding
			</label>
			<select
				id="embedding"
				name="embedding"
				value={embedding}
				onChange={(e) => {
					setObjectData({
						...objectData,
						embedding: e,
					});
				}}
				className="form-control"
			>
				<option value={true}>Yes</option>
				<option value={false}>No</option>
			</select>
			{/* HERE GOES THE CATEGORIES SELECT */}

			{/* HERE GOES THE MODAL TO OPEN GALLERY */}
		</>
	);
};

export default AdminSidebar;
