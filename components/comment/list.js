"use client";
import NothingFoundAlert from "@/layout/nothingfoundalert";
import Globalcontent from "@/layout/content";
import CommentBox from "../global/commentbox";

const List = ({ auth = {}, token = {}, objects = [], searchParams = {} }) => {
	return (
		<section className="py-5">
			<div className="container">
				<div className="row">
					<Globalcontent containerClasses="col-lg-12">
						{objects?.data?.length > 0 ? (
							<CommentBox
								resourceId={searchParams.resourceId}
								onModel={searchParams.onModel}
								postType="comment"
								advancedTextEditor={false}
								token={token}
								auth={auth}
								endpoint="/global/comments"
								createEndpoint={`/global/comments/${searchParams.resourceId}`}
								isRemote={false}
								comments={objects}
								onCreate={null}
								onPosted={null}
								searchParams={searchParams}
								heading="Comments"
								emptyText="No comments yet."
								pageSize={25}
								siblings={1}
								displayPagination={true}
								displayComposer={true}
								newestFirst={true}
								profileBasePath={`/profile`}
								decodeStoredEntities={true}
								className=""
							/>
						) : (
							<NothingFoundAlert />
						)}
					</Globalcontent>
				</div>
			</div>
		</section>
	);
};
export default List;
