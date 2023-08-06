"use client";
import { useState } from "react";

const QuickQuoteDraft = () => {
	const [quickQuoteDraftData, setQuickDraftData] = useState({
		text: "No description",
	});

	const { text } = quickQuoteDraftData;

	const submitQuickQuoteDraft = async (e) => {
		e.preventDefault();
	};
	return (
		<div className="card mb-3">
			<form onSubmit={submitQuickQuoteDraft}>
				<div className="card-header">Quick Quote Draft</div>
				<div className="card-body">
					<label htmlFor="quote-text" className="form-label">
						Text
					</label>
					<textarea
						id="quote-text"
						name="text"
						className="form-control"
						placeholder={"Text"}
						value={text.trim()}
						onChange={(e) => {
							setQuickDraftData({
								...quickQuoteDraftData,
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
						disabled={text.length > 0 ? !true : !false}
					>
						Save Draft
					</button>
				</div>
			</form>
		</div>
	);
};

export default QuickQuoteDraft;
