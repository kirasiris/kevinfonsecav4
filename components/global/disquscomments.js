"use client";
import { DiscussionEmbed, CommentCount } from "disqus-react";

const DisqusComments = ({ object = {}, objecturl = `` }) => {
	return (
		<div className="comments">
			{object?.data?.commented ? (
				<>
					<CommentCount
						shortname="kevinfonseca"
						config={{
							url: objecturl,
							identifier: object?.data?._id,
							title: object?.data?.title,
						}}
					>
						Comments
					</CommentCount>
					<DiscussionEmbed
						shortname="kevinfonseca"
						config={{
							url: objecturl,
							identifier: object?.data?._id,
							title: object?.data?.title,
							// language: "zh_TW", //e.g. for Traditional Chinese (Taiwan)
						}}
					/>
				</>
			) : (
				<div className="alert alert-danger">Comments are closed</div>
			)}
		</div>
	);
};

export default DisqusComments;
