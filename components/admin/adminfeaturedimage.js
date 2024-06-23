"use client";
import { useState } from "react";
import Image from "next/image";
import { Modal } from "react-bootstrap";
import List from "./files/list";

const AdminFeaturedImage = ({
	avatar = "",
	multipleFiles = false,
	onModel = "Blog",
	files = [],
	selectedFile = null,
	setSelectedFile = () => {},
	auth = {},
	token = null,
}) => {
	const [showMediaModal, setShowMediaModel] = useState(false);

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
				<figure>
					<Image
						src={
							selectedFile?.location?.secure_location ||
							avatar?.location?.secure_location ||
							"https://static.vecteezy.com/system/resources/previews/005/337/799/original/icon-image-not-found-free-vector.jpg"
						}
						alt="xD"
						width="558"
						height="558"
						style={{ maxWidth: "1920px", maxHeight: "1920px" }}
						priority={true}
						onClick={() => setShowMediaModel(true)}
					/>
				</figure>
				{/* <figure>
					<video title="" controls style={{ maxWidth: "100%" }}>
						<source
							src={
								selectedFile?.location?.secure_location ||
								avatar?.location?.secure_location
							}
						></source>
					</video>
				</figure> */}
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
