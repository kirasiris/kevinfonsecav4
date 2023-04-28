"use client";
const NewsletterForm = ({ newsletters = {} }) => {
	return (
		<>
			<p>Join {newsletters.data?.length || 0} other subscribers!</p>
			<div className="input-group">
				<input
					type="email"
					className="form-control rounded-0"
					placeholder="Enter your email"
				/>
				<span className="input-group-btn">
					<button className="btn btn-secondary rounded-0" type="submit">
						Subscribe Now
					</button>
				</span>
			</div>
		</>
	);
};

export default NewsletterForm;
