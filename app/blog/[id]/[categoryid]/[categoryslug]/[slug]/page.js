import { Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import Header from "@/layout/header";
import Footer from "@/layout/footer";
import Sidebar from "@/layout/sidebar";
import Loading from "@/app/blog/loading";

async function getBlog(params) {
	const res = await fetch(`http://localhost:5000/api/v1/blogs${params}`, {
		cache: "no-store",
	});

	if (!res.ok) {
		// This will activate the closest `error.js` Error Boundary
		throw new Error("Failed to fetch data");
	}

	return res.json();
}

async function getCategories(params) {
	const res = await fetch(`http://localhost:5000/api/v1/categories${params}`);

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

const BlogRead = async ({ params }) => {
	const getBlogsData = getBlog(`/${params.id}`);

	const getCategoriesData = getCategories(`?categoryType=blog`);

	const getQuotesData = getQuotes();

	const [blog, categories, quotes] = await Promise.all([
		getBlogsData,
		getCategoriesData,
		getQuotesData,
	]);

	return (
		<Suspense fallback={<Loading />}>
			<Header title={blog.data.title} />
			<div className="container">
				<div className="row">
					<div className={`col-lg-${blog.data.fullWidth ? "12" : "8"}`}>
						<article>
							<header className="mb-4">
								<h1>{blog.data.title}</h1>
								<div className="text-muted fst-italic mb-2">
									Posted on {blog.data.createdAt} by {blog.data.user.username}
								</div>
								{blog.data.category && (
									<Link
										href={`/blogs?category=${blog.data.category._id}`}
										passHref
										legacyBehavior
									>
										<a className="badge bg-secondary text-decoration-none link-light">
											{blog.data.category.title}
										</a>
									</Link>
								)}
							</header>
							<figure className="mb-4">
								<Image
									className="img-fluid"
									src={
										blog.data.avatar.location.secure_location ||
										`https://source.unsplash.com/random/1200x900`
									}
									alt={`${blog.data.avatar.location.fileName}`}
									width={1200}
									height={900}
									priority
								/>
							</figure>
							<section className="mb-5">{blog.data.text}</section>
						</article>
					</div>
					{blog.data.fullWidth !== true && (
						<div className="col-lg-4">
							<Sidebar quotes={quotes} categories={categories} />
						</div>
					)}
				</div>
			</div>
			<Footer />
		</Suspense>
	);
};

export default BlogRead;
