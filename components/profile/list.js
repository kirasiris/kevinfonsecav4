import Filter from "./filter";
import PostNew from "./postnew";
import NumericPagination from "@/layout/numericpagination";
import NothingFoundAlert from "@/layout/nothingfoundalert";
// import Sidebar from "./sidebar";
import Globalcontent from "@/layout/content";
import Single from "./post/single";

const List = ({
	object = {},
	stories = [],
	featured = {},
	objects = [],
	params = {},
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
			<Filter params={params} />
			{/* Featured list */}
			{featured?.data?.length > 0 && (
				<>
					<h2>Featured</h2>
					{featured.data?.map((featured) => (
						<Single key={featured._id} object={featured} />
					))}
				</>
			)}
			{/* Post timeline */}
			{objects?.data?.length > 0 && (
				<>
					<h2>Timeline</h2>
					{objects.data?.map((post) => (
						<Single key={post._id} object={post} />
					))}
				</>
			)}
		</Globalcontent>
	);
};

export default List;
