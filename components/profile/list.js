// import Single from "./single";
import Filter from "./filter";
import PostNew from "./postnew";
import SingleStory from "./singlestory";
// import SinglePost from "./singlepost";
import NumericPagination from "@/layout/numericpagination";
import NothingFoundAlert from "@/layout/nothingfoundalert";
// import Sidebar from "./sidebar";
import Globalcontent from "@/layout/content";
import Audio from "./single/audio";
import File from "./single/file";
import Map from "./single/map";
import Photo from "./single/photo";
import Post from "./single/post";
import Text from "./single/text";
import Video from "./single/video";

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
						<Post key={featured._id} object={featured} />
					))}
				</>
			)}
			{/* Post timeline */}
			{objects?.data?.length > 0 && (
				<>
					<h2>Timeline</h2>
					{objects.data?.map((post) => {
						return searchParams.subType === "audios" ? (
							<Audio key={post._id} object={post} />
						) : searchParams.subType === "files" ? (
							<File key={post._id} object={post} />
						) : searchParams.subType === "maps" ? (
							<Map key={post._id} object={post} />
						) : searchParams.subType === "photos" ? (
							<Photo key={post._id} object={post} />
						) : searchParams.subType === undefined ? (
							<Post key={post._id} post={post} />
						) : searchParams.subType === "text" ? (
							<Text key={post._id} object={post} />
						) : searchParams.subType === "videos" ? (
							<Video key={post._id} object={post} />
						) : (
							<Post key={post._id} post={post} />
						);
					})}
				</>
			)}
		</Globalcontent>
	);
};

export default List;
