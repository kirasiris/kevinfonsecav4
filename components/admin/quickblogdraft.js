"use client";
import axios from "axios";
import { useState } from "react";
import MyTextArea from "../global/mytextarea";

const QuickBlogDraft = () => {
	const [quickBlogDraftData, setQuickDraftData] = useState({
		title: "untitled",
		text: "No description",
	});

	const { title, text } = quickBlogDraftData;

	const submitQuickBlogDraft = async (e) => {
		e.preventDefault();
		try {
			await axios.post(`/blogs`, {
				...quickBlogDraftData,
				postType: "blog",
			});
			toast.success(`Item created`);
			resetForm();
		} catch (err) {
			console.log(err);
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
		setQuickDraftData({
			title: "untitled",
			text: "No description",
		});
	};
	return (
		<div className="card mb-3">
			<form onSubmit={submitQuickBlogDraft}>
				<div className="card-header">Quick Blog Draft</div>
				<div className="card-body">
					<label htmlFor="blog-title" className="form-label">
						Title
					</label>
					<input
						id="blog-title"
						name="title"
						value={title}
						onChange={(e) => {
							setQuickDraftData({
								...quickBlogDraftData,
								title: e.target.value,
							});
						}}
						type="text"
						className="form-control mb-3"
						placeholder=""
					/>
					<label htmlFor="blog-text" className="form-label">
						Text
					</label>
					<MyTextArea
						id="text"
						name="text"
						value={text}
						objectData={quickBlogDraftData}
						setObjectData={setQuickDraftData}
						onModel="Blog"
						advancedTextEditor={false}
					/>
				</div>
				<div className="card-footer">
					<button
						className="btn btn-danger btn-sm"
						type="submit"
						disabled={title.length > 0 && text.length > 0 ? !true : !false}
					>
						Save Draft
					</button>
					<button
						type="button"
						className="btn btn-secondary btn-sm"
						onClick={resetForm}
					>
						Reset
					</button>
				</div>
			</form>
		</div>
	);
};

export default QuickBlogDraft;
