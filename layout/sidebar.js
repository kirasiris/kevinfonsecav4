import Link from "next/link";

const Sidebar = ({ quotes = [], categories = [] }) => {
	return (
		<>
			{/* Search box */}
			<div className="card mb-4">
				<div className="card-header">Search</div>
				<div className="card-body">
					<div className="input-group">
						<input
							className="form-control"
							type="text"
							placeholder="Enter search term..."
							aria-label="Enter search term..."
							aria-describedby="button-search"
						/>
						<button
							className="btn btn-primary"
							id="button-search"
							type="button"
						>
							Go!
						</button>
					</div>
				</div>
			</div>
			{/* Random quote box */}
			{quotes.data.length > 0 && (
				<div className="card mb-4">
					<div className="card-header">Random Quote</div>
					<div className="card-body">
						{quotes.data.map((quote, index) => (
							<figure key={quote._id}>
								<blockquote className="blockquote">
									<p>{quote.text}</p>
								</blockquote>
								<figcaption className="blockquote-footer">
									{quote.authorName}&nbsp;-&nbsp;
									<cite title={quote.sourceWebsite}>{quote.sourceWebsite}</cite>
								</figcaption>
							</figure>
						))}
					</div>
				</div>
			)}
			{/* Categories box */}
			{categories.data.length > 0 && (
				<div className="card mb-4">
					<div className="card-header">Categories</div>
					<div className="card-body p-0">
						<ul className="list-group list-group-flush">
							{categories.data.map((category, index) => (
								<li key={category._id} className="list-group-item">
									<Link
										href={`/blogs?category=${category._id}`}
										passHref
										legacyBehavior
									>
										<a className="btn btn-sm btn-link">{category.title}</a>
									</Link>
								</li>
							))}
						</ul>
					</div>
				</div>
			)}
		</>
	);
};

export default Sidebar;
