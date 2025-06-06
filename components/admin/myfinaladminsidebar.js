"use client";
import { useState } from "react";
import AdminFeaturedImage from "./adminfeaturedimage";
import { fetchurl } from "@/helpers/setTokenOnServer";

const AdminSidebar = ({
	displayCategoryField = true,
	displayAvatar = true,
	avatar = "",
	avatarFormat = "image",
	status = "draft",
	fullWidth = false,
	password = "",
	featured = false,
	commented = false,
	embedding = false,
	github_readme = "",
	category = undefined,
	categories = [],
	multiple_categories = false,
}) => {
	const [fileId, setFileId] = useState(avatar);
	const [loading, setLoading] = useState("Paste file Id");
	const [featuredFile, setFeaturedFile] = useState(avatar);

	const fetchFile = async (e) => {
		e.preventDefault();

		// Grab the pasted value
		const pastedText = e.clipboardData?.getData("text");

		const retrieveFile = await fetchurl(
			`/global/files/${pastedText}`,
			"GET",
			"no-cache"
		);

		console.log("File retrieved", retrieveFile);

		// If the file is valid, update state
		setLoading("Loading...");
		setFileId(retrieveFile?.data._id);
		setFeaturedFile(retrieveFile?.data);
		setLoading("Paste file Id");
	};

	return (
		<>
			{/* HERE GOES THE AVATAR */}
			{displayAvatar && (
				<>
					<AdminFeaturedImage
						avatar={featuredFile}
						avatarFormat={avatarFormat}
					/>
					<label htmlFor="file" className="form-label">
						Featured Image - {loading}
					</label>
					<input
						id="file"
						name="file"
						defaultValue={fileId}
						type="text"
						className="form-control mb-3"
						placeholder="0123456789"
						onPaste={fetchFile}
					/>
				</>
			)}
			<label htmlFor="status" className="form-label">
				Status
			</label>
			<select
				id="status"
				name="status"
				defaultValue={status}
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
						defaultValue={fullWidth}
						className="form-control"
					>
						<option value={true}>Yes</option>
						<option value={false}>No</option>
					</select>
				</>
			)}
			{password !== "" && password !== undefined && password !== null && (
				<>
					<label htmlFor="password" className="form-label">
						Password
					</label>
					<input
						id="password"
						name="password"
						defaultValue={password}
						type="password"
						className="form-control mb-3"
						placeholder="******"
					/>
				</>
			)}
			{github_readme !== "" &&
				github_readme !== null &&
				github_readme !== undefined && (
					<>
						<label htmlFor="github_readme" className="form-label">
							GitHub readME
						</label>
						<input
							id="github_readme"
							name="github_readme"
							defaultValue={github_readme}
							type="text"
							className="form-control mb-3"
							placeholder="#"
						/>
					</>
				)}
			{featured && (
				<>
					<label htmlFor="featured" className="form-label">
						Featured
					</label>
					<select
						id="featured"
						name="featured"
						defaultValue={featured}
						className="form-control"
					>
						<option value={true}>Yes</option>
						<option value={false}>No</option>
					</select>
				</>
			)}
			{commented && (
				<>
					<label htmlFor="commented" className="form-label">
						Commented
					</label>
					<select
						id="commented"
						name="commented"
						defaultValue={commented}
						className="form-control"
					>
						<option value={true}>Yes</option>
						<option value={false}>No</option>
					</select>
				</>
			)}
			{embedding && (
				<>
					<label htmlFor="embedding" className="form-label">
						Embedding
					</label>
					<select
						id="embedding"
						name="embedding"
						defaultValue={embedding}
						className="form-control"
					>
						<option value={true}>Yes</option>
						<option value={false}>No</option>
					</select>
				</>
			)}
			{/* HERE GOES THE CATEGORIES SELECT */}
			{displayCategoryField && (
				<>
					<label htmlFor="category" className="form-label">
						Category
					</label>
					<select
						id="category"
						name="category"
						defaultValue={category}
						className="form-control"
						multiple={multiple_categories} // or use your `multiple_categories` variable
					>
						{categories
							.filter((c) => !c.parentCategory) // top-level categories
							.map((category) => (
								<optgroup key={category._id} label={category.title}>
									{categories
										.filter(
											(c) =>
												c.parentCategory?._id === category._id ||
												c._id === category._id // also include top-level category itself as option
										)
										.map((childC) => (
											<option key={childC._id} value={childC._id}>
												{childC.title}
											</option>
										))}
								</optgroup>
							))}
					</select>
				</>
			)}
		</>
	);
};

export default AdminSidebar;
