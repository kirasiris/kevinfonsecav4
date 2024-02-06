"use client";
import { useContext } from "react";
import AuthContext from "@/helpers/globalContext";
import Image from "next/image";
import { Modal } from "react-bootstrap";
import AdminMediaLibray from "./adminmedialibray";

const AdminSidebar = ({
	displayCategoryField = true,
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
	const { files, setFiles } = useContext(AuthContext);

	return (
		<>
			{/* HERE GOES THE AVATAR */}
			{displayAvatar && (
				<div className="d-grid gap-2">
					<button
						type="button"
						className="btn btn-secondary btn-sm btn-block"
						onClick={() => setFiles({ ...files, showMediaModal: true })}
					>
						Featured Image
					</button>
					<Image
						src={
							files?.selected?.location?.secure_location ||
							avatar?.location?.secure_location ||
							"https://static.vecteezy.com/system/resources/previews/005/337/799/original/icon-image-not-found-free-vector.jpg"
						}
						alt="xD"
						width="558"
						height="558"
						style={{ maxWidth: "1920px", maxHeight: "1920px" }}
						onClick={() => setFiles({ ...files, showMediaModal: true })}
						priority={true}
					/>
				</div>
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
								fullWidth: e.target.value,
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
						<input
							id="github_readme"
							name="github_readme"
							value={github_readme}
							onChange={(e) => {
								setObjectData({
									...objectData,
									github_readme: e.target.value,
								});
							}}
							type="text"
							className="form-control mb-3"
							placeholder="#"
						/>
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
						featured: e.target.value,
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
						commented: e.target.value,
					});
				}}
				className="form-control"
			>
				<option value={true}>Yes</option>
				<option value={false}>No</option>
			</select>
			{embedding && (
				<>
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
								embedding: e.target.value,
							});
						}}
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
						value={category}
						onChange={(e) => {
							setObjectData({
								...objectData,
								category: e.target.value,
							});
						}}
						className="form-control"
					>
						{categories
							.filter((c) => c.parentCategory === undefined)
							.map((category) => (
								<optgroup key={category._id} label={category.title}>
									{categories
										.filter(
											(c) =>
												c.parentCategory?._id === category._id ||
												c._id === category._id
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
			{/* HERE GOES THE MODAL TO OPEN GALLERY */}
			<Modal
				show={files.showMediaModal}
				onHide={() => {
					setFiles({ ...files, showMediaModal: false });
				}}
				backdrop={true}
				animation={true}
				fullscreen={true}
			>
				<Modal.Header closeButton>
					<Modal.Title>Media Library</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<AdminMediaLibray multipleFiles={multipleFiles} onModel={onModel} />
				</Modal.Body>
				<Modal.Footer>
					<button
						className="btn btn-secondary btn-sm"
						onClick={() => {
							setFiles({ ...files, showMediaModal: false });
						}}
					>
						Close
					</button>
					<button
						className="btn btn-primary btn-sm"
						type="submit"
						onClick={() => {
							setFiles({ ...files, showMediaModal: false });
						}}
					>
						Submit
					</button>
				</Modal.Footer>
			</Modal>
		</>
	);
};

export default AdminSidebar;
