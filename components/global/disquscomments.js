"use client";
import Link from "next/link";
import { DiscussionEmbed, CommentCount } from "disqus-react";

const DisqusComments = ({ auth = {}, object = {}, returtopageurl = `` }) => {
	return (
		<div className="comments">
			{object?.data?.commented ? (
				<>
					<CommentCount
						shortname="kevin-fonseca"
						config={{
							url: returtopageurl,
							identifier: object?.data?._id,
							title: object?.data?.title,
						}}
					>
						Comments
					</CommentCount>
					{auth?.userId ? (
						<DiscussionEmbed
							shortname="kevin-fonseca"
							config={{
								url: returtopageurl,
								identifier: object?.data?._id,
								title: object?.data?.title,
								// language: "zh_TW", //e.g. for Traditional Chinese (Taiwan)
							}}
						/>
					) : (
						<div className="alert alert-info">
							<Link
								href={{
									pathname: `/auth/login`,
									query: {
										returnpage: returtopageurl,
									},
								}}
								passHref
								legacyBehavior
							>
								<a>You need to login first</a>
							</Link>
						</div>
					)}
				</>
			) : (
				<div className="alert alert-danger">Comments are closed</div>
			)}
		</div>
	);
};

export default DisqusComments;
