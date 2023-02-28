import Single from "@/components/post/single";
import Header from "@/layout/header";
import Footer from "@/layout/footer";

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

const PostIndex = async () => {
	const getFeaturedPostsData = getFeaturedPost(
		`?featured=true&status=published`
	);

	const getPostsData = getPosts(
		`?page=1&limit=10&sort=-createdAt&status=published`
	);

	const [featured, posts] = await Promise.all([
		getFeaturedPostsData,
		getPostsData,
	]);

	return (
		<>
			<Header
				title="Welcome to my Timeline"
				description="This is pretty much my diary!"
			/>
			<div className="container">
				<div className="row">
					{/* Featured list */}
					{featured.data?.map((featured) => (
						<Single key={featured._id} post={featured} />
					))}
					{posts?.data?.map((post) => (
						<Single key={post._id} post={post} />
					))}
				</div>
			</div>
			<Footer />
		</>
	);
};

export default PostIndex;
