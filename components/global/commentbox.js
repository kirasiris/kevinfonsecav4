"use client";
import React, { useEffect, useState } from "react";
import Tabs from "react-bootstrap/Tabs";
import Tab from "react-bootstrap/Tab";
import Single from "../comment/single";
import MyTextArea from "@/layout/mytextarea";

const CommentBox = ({
	user = {},
	postId = null,
	secondPostId = null,
	parentId = null,
	isVisible = true,
	backToOriginalPost = true,
	postType = "",
	onModel = "",
}) => {
	const [commentId, setCommentId] = useState(null);
	const [comments, setComments] = useState([]);
	const [next, setNext] = useState(0); // Done
	const [prev, setPrev] = useState(0); // Done
	const [page, setPage] = useState(1); // Done
	const [, setTotalPages] = useState(0); // Done
	const [totalResults, setTotalResults] = useState(0); // Done
	const [shownMessage, setShownMessage] = useState(`Submit`); // Done
	const [validated, setValidated] = useState(false); // Done
	const [, setError] = useState(false); // Done
	const [, setIsBlocking] = useState(false);

	const params = `?resourceId=${postId}&page=${page}&limit=15&sort=-createdAt&status=published`;

	useEffect(() => {
		const getComments = async () => {
			const res = await fetch(`http://localhost:5000/api/v1/comments${params}`);
			const comments = await res.json();
			setComments(comments.data);
		};
		getComments();
	}, [postId]);

	// COMMENT BOX DATA
	const [commentData, setCommentData] = useState({
		title: "",
		text: "",
		parentId: parentId,
		secondResourceId: secondPostId,
	});

	const { title, text } = commentData;

	const newComment = async (e) => {
		e.preventDefault();

		const res = await fetch(`http://localhost:5000/api/v1/comments`, {
			method: "POST",
			body: commentData,
		});
		const comments = await res.json();
		console.log(comments.data);
		setComments([comments.data, ...comments]);
	};

	const resetForm = () => {
		setCommentData({
			title: ``,
			text: ``,
			parentId: parentId,
			secondResourceId: secondPostId,
		});
	};

	return (
		<div className="comments">
			{isVisible ? (
				<>
					<form className="mb-3" onSubmit={newComment}>
						<div className="card">
							<div className="card-body">
								<input
									type={`text`}
									placeholder={`Title *`}
									aria-label={`title`}
									aria-describedby={`title-text`}
									autoComplete={`title`}
									name={`title`}
									id={`title`}
									className="form-control"
									onChange={(e) => {
										setCommentData({
											...commentData,
											title: e.target.value,
										});
									}}
									value={title}
								/>
								<br />
								<MyTextArea
									name="text"
									id="text"
									value={text}
									handleChange={(e) => {
										setCommentData({
											...commentData,
											text: e.target.value,
										});
									}}
								/>
							</div>
						</div>
						<button
							type="submit"
							className="btn btn-sm btn-secondary"
							disabled={title?.length > 0 && text?.length > 0 ? !true : !false}
						>
							Submit
						</button>
						<button
							type="reset"
							className="btn btn-sm btn-secondary"
							onClick={resetForm}
						>
							Reset
						</button>
					</form>
					{comments?.data?.length > 0 && (
						<>
							<hr />
							<h5>Comments: {comments?.data?.length}</h5>
							{comments?.data?.map((comment) => (
								<Single key={comment._id} author={user} comment={comment} />
							))}
						</>
					)}
				</>
			) : (
				<>
					<hr />
					<div className="alert alert-danger">Comments are closed</div>
				</>
			)}
		</div>
	);
};

export default CommentBox;
