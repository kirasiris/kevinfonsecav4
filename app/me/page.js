import Single from "@/components/me/single";
import Header from "@/layout/header";
import Footer from "@/layout/footer";
import Image from "next/image";
import Link from "next/link";

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

const MeIndex = async () => {
	const getMeData = getMe(`?username=kirasiris&email=kebin1421@hotmail.com`);

	const getFeaturedPostsData = getFeaturedPost(
		`?featured=true&status=published`
	);

	const getPostsData = getPosts(
		`?page=1&limit=10&sort=-createdAt&status=published`
	);

	const getMediasData = getMedias(`?limit=9&type=image`);

	const me = await getMeData;

	const [featured, posts, photos] = await Promise.all([
		getFeaturedPostsData,
		getPostsData,
		getMediasData,
	]);

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
					<div className="col-xl-8 col-lg-8 col-md-12 col-sm-12 col-xs-12">
						{/* Featured list */}
						{featured.data?.map((featured) => (
							<Single key={featured._id} post={featured} />
						))}
						{posts?.data?.map((post) => (
							<Single key={post._id} post={post} />
						))}
					</div>
					<div className="col-xl-4 col-lg-4 col-md-4 col-sm-12 col-xs-12">
						<div className="card mb-3">
							<div className="card-header">About</div>
							<div className="card-body p-0">
								<ul className="list-group list-group-flush">
									{me.data[0].bio && (
										<li className="list-group-item">
											<p className="m-0">{me.data[0].bio}</p>
										</li>
									)}
									{me.data[0].sex && (
										<li className="list-group-item">
											<p className="m-0">
												{me.data[0].sex.charAt(0).toUpperCase() +
													me.data[0].sex.slice(1)}
											</p>
										</li>
									)}
									{me.data[0].age && (
										<li className="list-group-item">
											<p className="m-0">{me.data[0].age}</p>
										</li>
									)}
									{me.data[0].company && (
										<li className="list-group-item">
											<p className="m-0">{me.data[0].company}</p>
										</li>
									)}
									{me.data[0].workstatus && (
										<li className="list-group-item">
											<p className="m-0">
												{me.data[0].workstatus.charAt(0).toUpperCase() +
													me.data[0].workstatus.slice(1)}
											</p>
										</li>
									)}
									{me.data[0].email && (
										<li className="list-group-item">
											<p className="m-0">{me.data[0].email}</p>
										</li>
									)}
									{me.data[0].relationshipStatus && (
										<li className="list-group-item">
											<p className="m-0">
												{me.data[0].relationshipStatus.charAt(0).toUpperCase() +
													me.data[0].relationshipStatus.slice(1)}
											</p>
										</li>
									)}
									{me.data[0].inRelationshipWith && (
										<li className="list-group-item border-0 pb-1">
											<Image
												src={
													me.data[0].inRelationshipWith.avatar ||
													`https://source.unsplash.com/random/1200x900`
												}
												className="mr-3"
												width={30}
												height={30}
												alt={`${me.data[0].inRelationshipWith}'s  profile avatar`}
												style={{ objectFit: "cover" }}
											/>
											<Link
												href={{
													pathname: `/profiles/${me.data[0]._id}/${me.data[0].username}`,
													query: {
														page: 1,
														limit: 10,
														sort: `-createdAt`,
													},
												}}
											>
												{me.data[0].inRelationshipWith.username}
											</Link>
										</li>
									)}
								</ul>
							</div>
							<div className="card-footer">
								{me.data[0].role.length > 0 &&
									me.data[0].role.map((r, i) => (
										<div key={i} className="badge bg-secondary">
											{r.charAt(0).toUpperCase() + r.slice(1)}
										</div>
									))}
							</div>
						</div>
						{photos.data.length > 0 && (
							<div className="card mb-3">
								<div className="card-header">
									Photos
									<Link
										href={{
											pathname: `/profiles/${me.data[0]._id}/${me.data[0].username}/photos`,
											query: {
												page: 1,
												limit: 50,
												sort: `-createdAt`,
											},
										}}
										passHref
										legacyBehavior
									>
										<a className="float-end">View all</a>
									</Link>
								</div>
								<div className="card-body p-0">
									{photos.data.map((photo, index) => (
										<Link
											key={index}
											href={{
												pathname: `/profiles/${photo.user._id}/${photo.user.username}/photos/${photo._id}`,
												query: {
													page: 1,
													limit: 50,
													sort: `-createdAt`,
												},
											}}
											passHref
											legacyBehavior
										>
											<a>
												<Image
													src={
														photo.location.secure_location ||
														`https://source.unsplash.com/random/1200x900`
													}
													className="mr-3"
													width={113}
													height={113}
													alt={`${photo.user.username}'s profile avatars`}
													style={{ objectFit: "cover", marginBottom: "4px" }}
												/>
											</a>
										</Link>
									))}
								</div>
							</div>
						)}
						{me.data[0].tags.length > 0 && (
							<div className="card mb-3">
								<div className="card-header">Interests</div>
								<div className="card-body">
									{me.data[0].tags.map((tag, index) => (
										<div key={index} className="badge bg-secondary">
											<Link
												href={{
													pathname: `/search/profiles`,
													query: {
														keyword: tag,
														page: 1,
														limit: 48,
														sort: `-createdAt`,
													},
												}}
											>
												#{tag.charAt(0).toUpperCase() + tag.slice(1)}
											</Link>
										</div>
									))}
								</div>
							</div>
						)}
					</div>
				</div>
			</div>
			<Footer />
		</>
	);
};

export default MeIndex;
