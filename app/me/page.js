import SingleStory from "@/components/me/singlestory";
import Single from "@/components/me/single";
import Header from "@/layout/header";
import Footer from "@/layout/footer";
import Filter from "@/components/me/filter";
import Sidebar from "@/components/me/sidebar";
import PostNew from "@/components/me/postnew";

async function getMe(params) {
	const res = await fetch(`http://localhost:5000/api/v1/users${params}`);
	return res.json();
}

async function getFeaturedPost(params) {
	const res = await fetch(`http://localhost:5000/api/v1/posts${params}`, {
		cache: "no-store",
	});

	return res.json();
}

async function getPosts(params) {
	const res = await fetch(`http://localhost:5000/api/v1/posts${params}`, {
		cache: "no-store",
	});

	return res.json();
}

async function getMedias(params) {
	const res = await fetch(`http://localhost:5000/api/v1/medias${params}`, {
		cache: "no-store",
	});

	return res.json();
}

const MeIndex = async ({ searchParams }) => {
	const getMeData = getMe(`?username=kirasiris&email=kebin1421@hotmail.com`);

	const getFeaturedPostsData = getFeaturedPost(
		`?featured=true&status=published`
	);

	const limit = searchParams.limit || 10;
	const page = searchParams.page || 1;

	const getStoriesData = getPosts(
		`?page=${page}&limit=${limit}&sort=-createdAt&status=published&postType=story`
	);

	const subType =
		(searchParams.subType && `&subType=${searchParams.subType}`) || "";

	const getPostsData = getPosts(
		`?page=${page}&limit=${limit}&sort=-createdAt&status=published&postType=post${subType}`
	);

	const getMediasData = getMedias(`?limit=9&type=image`);

	const me = await getMeData;

	const [featured, stories, posts, photos] = await Promise.all([
		getFeaturedPostsData,
		getStoriesData,
		getPostsData,
		getMediasData,
	]);

	const nextPage = posts?.pagination?.next?.page || 0;
	const prevPage = posts?.pagination?.prev?.page || 0;

	return (
		<>
			<Header
				headerStyle={{
					background: `linear-gradient(to bottom, rgba(0,0,0,0.7) 0%,rgba(0,0,0,0.7) 100%), url(${
						me.data[0].cover?.location.secure_location ||
						`https://befreebucket-for-outputs.s3.amazonaws.com/2023/02/map-image.png`
					})`,
					backgroundPosition: "center",
					backgroundSize: "cover",
				}}
			/>
			<div className="container">
				<div className="row">
					<div className="col-xl-4 col-lg-4 col-md-4 col-sm-12 col-xs-12">
						<Sidebar me={me} photos={photos} />
					</div>
					<div className="col-xl-8 col-lg-8 col-md-12 col-sm-12 col-xs-12">
						{/* Stories */}
						{stories?.data?.length > 0 && (
							<div className="row mb-3">
								{stories.data?.map((story) => (
									<SingleStory key={story._id} story={story} />
								))}
							</div>
						)}
						{/* TEXT AREA */}
						<PostNew />
						<Filter />
						{/* Featured list */}
						{featured?.data?.length > 0 && (
							<>
								<h2>Featured</h2>
								{featured.data?.map((featured) => (
									<Single key={featured._id} post={featured} />
								))}
							</>
						)}
						{/* Post timeline */}
						{posts?.data?.length > 0 && (
							<>
								<h2>Timeline</h2>
								{posts.data?.map((post) => (
									<Single key={post._id} post={post} />
								))}
							</>
						)}
						<Single />
					</div>
				</div>
			</div>
			<Footer />
		</>
	);
};

export default MeIndex;
