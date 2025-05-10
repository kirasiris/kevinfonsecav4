"use client";
import { useState } from "react";
import Image from "next/image";
import { FaFilePdf, FaFileVideo } from "react-icons/fa";
import { Modal } from "react-bootstrap";
import List from "./files/list";

const AdminFeaturedImage = ({
	avatar = "",
	avatarFormat = "image",
	multipleFiles = false,
	onModel = "Blog",
	files = [],
	selectedFile = null,
	setSelectedFile = () => {},
	auth = {},
	token = null,
}) => {
	const [showMediaModal, setShowMediaModel] = useState(false);
	console.log("Admin Featured Image", selectedFile?.title);
	/*
	 *
	 * ANY OBJECT
	 *
	 */
	const anyObj = () => {
		return (
			<figure
				onClick={() => {
					// setSelectedFile(avatar);
					setShowMediaModel(true);
				}}
			>
				<Image
					src={
						selectedFile?.location?.secure_location ||
						avatar?.location?.secure_location ||
						"https://static.vecteezy.com/system/resources/previews/005/337/799/original/icon-image-not-found-free-vector.jpg"
					}
					alt="xD"
					width={`558`}
					height={`558`}
					style={{ maxWidth: "1920px", maxHeight: "1920px" }}
					priority={true}
				/>
			</figure>
		);
	};
	/*
	 *
	 * IMAGE OBJECT
	 *
	 */
	const imgObj = () => {
		return (
			<figure
				onClick={() => {
					// setSelectedFile(avatar);
					setShowMediaModel(true);
				}}
			>
				<Image
					src={
						selectedFile?.location?.secure_location ||
						avatar?.location?.secure_location ||
						"https://static.vecteezy.com/system/resources/previews/005/337/799/original/icon-image-not-found-free-vector.jpg"
					}
					alt="xD"
					width={`558`}
					height={`558`}
					style={{ maxWidth: "1920px", maxHeight: "1920px" }}
					priority={true}
				/>
			</figure>
		);
	};
	/*
	 *
	 * PDF OBJECT
	 *
	 */
	const pdfObj = () => {
		return (
			<figure
				onClick={() => {
					// setSelectedFile(avatar);
					setShowMediaModel(true);
				}}
			>
				<FaFilePdf style={{ fontSize: "184px" }} />
			</figure>
		);
	};
	/*
	 *
	 * VIDEO OBJECT
	 *
	 */
	const vidObj = () => {
		return (
			<figure
				onClick={() => {
					// setSelectedFile(avatar);
					setShowMediaModel(true);
				}}
			>
				<FaFileVideo style={{ fontSize: "184px" }} />
			</figure>
		);
	};
	/*
	 *
	 * AUDIO OBJECT
	 *
	 */
	const audObj = () => {
		return (
			<figure
				onClick={() => {
					// setSelectedFile(avatar);
					setShowMediaModel(true);
				}}
			>
				{/* <FaFileAudio style={{ fontSize: "184px" }} /> */}
				<audio
					controls
					style={{
						width: "100%",
						backgroundColor: "#000000",
					}}
				>
					<source
						src={
							selectedFile?.location?.secure_location ||
							avatar?.location?.secure_location ||
							"https://static.vecteezy.com/system/resources/previews/005/337/799/original/icon-image-not-found-free-vector.jpg"
						}
					/>
				</audio>
			</figure>
		);
	};
	return (
		<>
			<div className="d-grid gap-2">
				<button
					type="button"
					className="btn btn-secondary btn-sm btn-block"
					onClick={() => setShowMediaModel(true)}
				>
					Featured Image
				</button>
				{avatarFormat === "any" && anyObj()}
				{avatarFormat === "image" && imgObj()}
				{avatarFormat === "application" && pdfObj()}
				{avatarFormat === "video" && vidObj()}
				{avatarFormat === "audio" && audObj()}
			</div>
			<Modal
				show={showMediaModal}
				onHide={() => setShowMediaModel(false)}
				backdrop={true}
				animation={true}
				fullscreen={true}
			>
				<Modal.Header closeButton>
					<Modal.Title>Media Library</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<List
						auth={auth}
						token={token}
						id={undefined}
						name={undefined}
						multipleFiles={multipleFiles}
						onModel={onModel}
						allLink="/noadmin/files"
						pageText="Files"
						addLink="/noadmin/files/create"
						searchOn="/noadmin/files"
						objects={files}
						searchParams={undefined}
						handleDraft={undefined}
						handlePublish={undefined}
						handleTrash={undefined}
						handleSchedule={undefined}
						handleDelete={undefined}
						handleTrashAllFunction={undefined}
						handleDeleteAllFunction={undefined}
						setSelectedObject={setSelectedFile}
						setShowMediaModel={setShowMediaModel}
					/>
				</Modal.Body>
				<Modal.Footer>
					<button
						className="btn btn-secondary btn-sm"
						type="button"
						onClick={() => setShowMediaModel(false)}
					>
						Close
					</button>
					<button
						className="btn btn-primary btn-sm"
						type="button"
						onClick={() => setShowMediaModel(false)}
					>
						Submit
					</button>
				</Modal.Footer>
			</Modal>
		</>
	);
};

export default AdminFeaturedImage;
