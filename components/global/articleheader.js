"use client";
import Link from "next/link";
import { formatDateWithoutTime } from "befree-utilities";

const ArticleHeader = ({ object = {}, url = `#!` }) => {
	return (
		<div className="mb-3">
			<h1>{object?.data?.title}</h1>
			<div className="text-muted fst-italic mb-2">
				Posted&nbsp;on&nbsp;{formatDateWithoutTime(object?.data?.createdAt)}
				{object?.data?.user?.username && (
					<>
						&nbsp;by&nbsp;
						{object?.data?.user?.username}
					</>
				)}
			</div>
			{object?.data?.category && (
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
						{object?.data?.category?.title}
					</a>
				</Link>
			)}
		</div>
	);
};

export default ArticleHeader;
