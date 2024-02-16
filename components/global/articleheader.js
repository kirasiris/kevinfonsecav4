"use client";
import Link from "next/link";

const ArticleHeader = ({
	object = {},
	url = `#!`,
	params = {},
	isCourse = false,
}) => {
	return (
		<div className="mb-3">
			<h1>{object.data.title}</h1>
			<div className="text-muted fst-italic mb-2">
				Posted&nbsp;on&nbsp;{object.data.createdAt}&nbsp;by&nbsp;
				{object.data.user.username}
			</div>
			{object.data.category && (
				<Link
					href={{
						pathname: url,
						query: {
							page: 1,
							limit: 10,
						},
					}}
					passHref
					legacyBehavior
				>
					<a className="badge bg-secondary text-decoration-none link-light">
						{object.data.category.title}
					</a>
				</Link>
			)}
			{isCourse && params.category && (
				<Link
					href={{
						pathname: `/course/category/${params.category}`,
						query: {
							page: 1,
							limit: 32,
						},
					}}
					passHref
					legacyBehavior
				>
					<a className="badge bg-secondary text-decoration-none link-light me-1">
						{params.category}
					</a>
				</Link>
			)}
			{isCourse && params.subcategory && (
				<Link
					href={{
						pathname: `/course/subcategory/${params.subcategory}`,
						query: {
							page: 1,
							limit: 32,
						},
					}}
					passHref
					legacyBehavior
				>
					<a className="badge bg-secondary text-decoration-none link-light">
						{params.subcategory}
					</a>
				</Link>
			)}
		</div>
	);
};

export default ArticleHeader;
