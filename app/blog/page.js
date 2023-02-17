import Image from "next/image";
import Link from "next/link";

async function getFeaturedBlog(params) {
	const res = await fetch(`http://localhost:5000/api/v1/blogs${params}`, {
		cache: "no-store",
	});

	if (!res.ok) {
		// This will activate the closest `error.js` Error Boundary
		throw new Error("Failed to fetch data");
	}

	return res.json();
}

async function getBlogs(params) {
	const res = await fetch(`http://localhost:5000/api/v1/blogs${params}`, {
		cache: "no-store",
	});

	if (!res.ok) {
		// This will activate the closest `error.js` Error Boundary
		throw new Error("Failed to fetch data");
	}

	return res.json();
}

async function getQuotes() {
	const res = await fetch(`http://localhost:5000/api/v1/extras/quotes/random`, {
		cache: "no-store",
	});

	if (!res.ok) {
		// This will activate the closest `error.js` Error Boundary
		throw new Error("Failed to fetch data");
	}

	return res.json();
}

const BlogIndex = async () => {
	const getFeaturedBlogsData = getFeaturedBlog(
		`?featured=true&postType=blog&status=published`
	);
	const getBlogsData = getBlogs(
		`?page=1&limit=10&sort=-createdAt&postType=blog&status=published`
	);

	const getQuotesData = getQuotes();

	const [featured, blogs, quotes] = await Promise.all([
		getFeaturedBlogsData,
		getBlogsData,
		getQuotesData,
	]);

	return (
		<>
			<div className="container">
				<div className="row">
					<div className="col-lg-8">
						{/* Featured list */}
						{featured.data.map((featured, index) => (
							<article key={featured._id}>
								<div className="card mb-4">
									<Link href={`/blog/${featured._id}`} passHref legacyBehavior>
										<Image
											src={featured.avatar.location.secure_location}
											className="card-img-top"
											alt={`${featured.title}'s featured image`}
											width={`850`}
											height={`350`}
										/>
									</Link>
									<div className="card-body">
										<div className="small text-muted">{featured.createdAt}</div>
										<h2 className="card-title">{featured.title}</h2>
										<p className="card-text">{featured.text.iv}</p>
										<Link
											href={`/blog/${featured._id}`}
											passHref
											legacyBehavior
										>
											<a className="btn btn-primary">Read more</a>
										</Link>
									</div>
								</div>
							</article>
						))}
						{/* Blog list */}
						<div className="row">
							<div className="col-lg-12">
								{blogs.data.map((blog, index) => (
									<article key={blog._id}>
										<div className="card mb-4">
											<Link href={`/blog/${blog._id}`} passHref legacyBehavior>
												<Image
													src={blog.avatar.location.secure_location}
													className="card-img-top"
													alt={`${blog.title}'s featured image`}
													width={`700`}
													height={`350`}
												/>
											</Link>
											<div className="card-body">
												<div className="small text-muted">{blog.createdAt}</div>
												<h3 className="card-title">{blog.title}</h3>
												<p className="card-text">{blog.text.iv}</p>
												<Link
													href={`/blog/${blog._id}`}
													passHref
													legacyBehavior
												>
													<a className="btn btn-primary">Read more</a>
												</Link>
											</div>
										</div>
									</article>
								))}
							</div>
						</div>
						<nav aria-label="Pagination">
							<hr className="my-0" />
							<ul className="pagination justify-content-center my-4">
								<li className="page-item disabled">
									<a
										className="page-link"
										href="#"
										tabIndex="-1"
										aria-disabled="true"
									>
										Newer
									</a>
								</li>
								<li className="page-item active" aria-current="page">
									<a className="page-link" href="#!">
										1
									</a>
								</li>
								<li className="page-item">
									<a className="page-link" href="#!">
										2
									</a>
								</li>
								<li className="page-item">
									<a className="page-link" href="#!">
										3
									</a>
								</li>
								<li className="page-item disabled">
									<a className="page-link" href="#!">
										...
									</a>
								</li>
								<li className="page-item">
									<a className="page-link" href="#!">
										15
									</a>
								</li>
								<li className="page-item">
									<a className="page-link" href="#!">
										Older
									</a>
								</li>
							</ul>
						</nav>
					</div>
					<div className="col-lg-4">
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
											<cite title={quote.sourceWebsite}>
												{quote.sourceWebsite}
											</cite>
										</figcaption>
									</figure>
								))}
							</div>
						</div>
					</div>
				</div>
			</div>
		</>
	);
};

export default BlogIndex;
