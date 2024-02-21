import Single from "./single";
import Filter from "./filter";
import PostNew from "./postnew";
import SingleStory from "./singlestory";
import SinglePost from "./singlepost";
import NumericPagination from "@/layout/numericpagination";
import NothingFoundAlert from "@/layout/nothingfoundalert";
// import Sidebar from "./sidebar";
import Globalcontent from "@/layout/content";

const List = ({
	object = {},
	stories = [],
	featured = {},
	objects = [],
	searchParams = {},
}) => {
	return (
		<Globalcontent>
			{/* Stories */}
			{/* {stories?.data?.length > 0 && (
							<div className="row mb-3">
								{stories.data?.map((story) => (
									<SingleStory key={story._id} story={story} />
								))}
							</div>
						)} */}
			{/* TEXT AREA */}
			{/* <PostNew /> */}
			{/* <Filter params={params} /> */}
			{/* Featured list */}
			{/* {featured?.data?.length > 0 && (
							<>
								<h2>Featured</h2>
								{featured.data?.map((featured) => (
									<SinglePost key={featured._id} post={featured} />
								))}
							</>
						)} */}
			{/* Post timeline */}
			{/* {posts?.data?.length > 0 && (
							<>
								<h2>Timeline</h2>
								{posts.data?.map((post) => (
									<SinglePost key={post._id} post={post} />
								))}
							</>
						)}
						<SinglePost /> */}
		</Globalcontent>
	);
};

export default List;
