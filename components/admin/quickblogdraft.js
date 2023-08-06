"use client";
import { useState } from "react";

const QuickBlogDraft = () => {
	const [quickBlogDraftData, setQuickDraftData] = useState({
		title: "untitled",
		text: "No description",
	});

	const { title, text } = quickBlogDraftData;

	const submitQuickBlogDraft = async (e) => {
		e.preventDefault();
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
					<textarea
						id="blog-text"
						name="text"
						className="form-control"
						placeholder={"Text"}
						value={text.trim()}
						onChange={(e) => {
							setQuickDraftData({
								...quickBlogDraftData,
								text: e.target.value,
							});
						}}
						rows="3"
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
				</div>
			</form>
		</div>
	);
};

export default QuickBlogDraft;
