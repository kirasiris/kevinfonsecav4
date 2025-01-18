"use client";
import { useState } from "react";
import { fetchurl } from "@/helpers/setTokenOnServer";
import { checkEmptyObject } from "befree-utilities";

const ClientCommentForm = ({
	auth = {},
	resourceId = null,
	parentId = null,
	postType = "blog",
	onModel = "Blog",
	objects = [],
	setObjects,
}) => {
	const [newCommentData, setNewCommentData] = useState({
		title: "",
		text: "",
		name: "",
		email: "",
		website: "",
		resourceId: resourceId,
		parentId: parentId,
		postType: postType,
		onModel: onModel,
	});

	const { title, text, name, email, website } = newCommentData;

	console.log("child comments within client form", objects);

	const addComment = async (e) => {
		e.preventDefault();
		try {
			const res = await fetchurl(
				`/comments/${resourceId}`,
				"POST",
				"no-cache",
				{
					...newCommentData,
					user: auth?.userId || undefined,
				}
			);

			console.log("API Response:", res);

			if (res && res.data) {
				setObjects((prevObjects) => {
					if (Array.isArray(prevObjects)) {
						return [...prevObjects, res.data];
					} else if (prevObjects && Array.isArray(prevObjects.data)) {
						return [...prevObjects.data, res.data];
					} else {
						return [res.data];
					}
				});
				resetForm();
			} else {
				console.error("Invalid response data:", res);
			}
		} catch (error) {
			console.error("Error adding comment:", error);
		}
	};

	const resetForm = () => {
		setNewCommentData({
			title: "",
			text: "",
			name: "",
			email: "",
			website: "",
			resourceId: resourceId,
			parentId: parentId,
			postType: postType,
			onModel: onModel,
		});
	};

	return (
		<form id={parentId} className="mb-3" onSubmit={addComment}>
			<div className="card mb-3">
				<div className="card-body">
					<input
						id={`title`}
						name={`title`}
						type="text"
						className="form-control mb-3"
						required
						placeholder="Title *"
						value={title}
						onChange={(e) => {
							setNewCommentData({
								...newCommentData,
								title: e.target.value,
							});
						}}
					/>
					<textarea
						id="text"
						name="text"
						className="form-control mb-3"
						rows="5"
						placeholder="Tell us what you think!"
						value={text}
						onChange={(e) => {
							setNewCommentData({
								...newCommentData,
								text: e.target.value,
							});
						}}
					/>
					{checkEmptyObject(auth?.userId) && (
						<>
							<input
								id={`name`}
								name={`name`}
								type="text"
								className="form-control mb-3"
								required
								placeholder="Name *"
								value={name}
								onChange={(e) => {
									setNewCommentData({
										...newCommentData,
										name: e.target.value,
									});
								}}
							/>
							<input
								id={`email`}
								name={`email`}
								type="email"
								className="form-control mb-3"
								required
								placeholder="Email *"
								value={email}
								onChange={(e) => {
									setNewCommentData({
										...newCommentData,
										email: e.target.value,
									});
								}}
							/>
							<input
								id={`website`}
								name={`website`}
								type="url"
								className="form-control mb-3"
								required
								placeholder="Webiste"
								value={website}
								onChange={(e) => {
									setNewCommentData({
										...newCommentData,
										website: e.target.value,
									});
								}}
							/>
						</>
					)}
				</div>
				<div className="card-footer">
					<button
						type="submit"
						className="btn btn-secondary btn-sm float-start"
						disabled={title.length > 0 && text.length > 0 ? false : true}
					>
						Submit
					</button>
					<button
						type="reset"
						className="btn btn-secondary btn-sm float-end"
						onClick={resetForm}
					>
						Reset
					</button>
				</div>
			</div>
		</form>
	);
};
export default ClientCommentForm;
