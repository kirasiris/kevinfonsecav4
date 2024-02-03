"use client";
import { fetchurl } from "@/helpers/setTokenOnServer";
import axios from "axios";
import React, { useEffect, useState } from "react";
import Single from "../comment/single";
import MyTextArea from "@/components/global/mytextarea";

const CommentBox = ({
	auth = {},
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
			// const res = await fetchurl(
			// 	`http://localhost:5000/api/v1/comments${params}`,
			// 	"GET"
			// );
			const res = await axios.get(
				`http://localhost:5000/api/v1/comments${params}`
			);
			setComments(res?.data?.data);
		};
		getComments();
	}, [postId]);

	// COMMENT BOX DATA
	const [commentData, setCommentData] = useState({
		title: "",
		text: "",
		parentId: parentId,
		secondResourceId: secondPostId,
		postType: postType,
		onModel: onModel,
	});

	const { title, text } = commentData;

	const newComment = async (e) => {
		e.preventDefault();
		try {
			// const res = await fetchurl(
			// 	`http://localhost:5000/api/v1/comments/${postId}`,
			// 	"POST",
			// 	commentData
			// );
			const res = await axios.post(
				`http://localhost:5000/api/v1/comments/${postId}`,
				commentData
			);
			console.log(res?.data);
			setComments([res?.data?.data, ...comments]);
			resetForm();
		} catch (err) {
			// const error = err.response.data.message;
			const error = err?.response?.data?.error?.errors;
			const errors = err?.response?.data?.errors;

			if (error) {
				// dispatch(setAlert(error, 'danger'));
				error &&
					Object.entries(error).map(([, value]) => toast.error(value.message));
			}

			if (errors) {
				errors.forEach((error) => toast.error(error.msg));
			}

			toast.error(err?.response?.statusText);
			return { msg: err?.response?.statusText, status: err?.response?.status };
		}
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
						<div className="card mb-3">
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
									auth={auth}
									name="text"
									id="text"
									value={text}
									objectData={commentData}
									setObjectData={setCommentData}
									onModel="Comment"
									advancedTextEditor={false}
								/>
							</div>
						</div>
						<button
							type="submit"
							className="btn btn-sm btn-secondary me-1"
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
					{comments?.length > 0 && (
						<>
							<hr />
							<h5>Comments: {comments?.length}</h5>
							{comments?.map((comment) => (
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
