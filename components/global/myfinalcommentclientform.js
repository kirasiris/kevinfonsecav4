"use client";
import { fetchurl } from "@/helpers/setTokenOnServer";
import { revalidatePath } from "next/cache";
import { useState } from "react";

const MyFinalCommentForm = ({
	resourceId = null,
	parentId = null,
	postType = "blog",
	onModel = "Blog",
	objects,
	setObjects,
}) => {
	const [newCommentData, setNewCommentData] = useState({
		title: "",
		text: "",
		resourceId: resourceId,
		parentId: parentId,
		postType: postType,
		onModel: onModel,
	});

	const { title, text } = newCommentData;

	const addComment = async (e) => {
		e.preventDefault();
		const res = await fetchurl(
			`/comments/${resourceId}`,
			"POST",
			"no-cache",
			newCommentData
		);
		resetForm();
		setObjects([res.data, ...objects.data]);
	};

	const resetForm = () => {
		setNewCommentData({
			title: "",
			text: "",
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
						defaultValue={title}
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
						className="form-control"
						rows="5"
						placeholder="Tell us what you think!"
						defaultValue={text}
						onChange={(e) => {
							setNewCommentData({
								...newCommentData,
								text: e.target.value,
							});
						}}
					/>
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

export default MyFinalCommentForm;
