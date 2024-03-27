"use client";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

const Jumbotron = ({
	authenticatedUser = {},
	object = {},
	params = {},
	headerStyle = {},
	imageWidth = "168",
	imageHeight = "168",
}) => {
	const pathname = usePathname();
	const isActive = (path = "") => {
		return pathname === path ? "active text-bg-secondary" : "text-bg-dark";
	};

	return (
		<>
			<header className={`bg-secondary py-5`} style={headerStyle}>
				<div className={`container`}>
					<div className="row my-5">
						<div className="col">
							<figure className="mb-4 bg-dark">
								<Image
									className="img-fluid p-3"
									src={
										object?.data?.files?.avatar?.location?.secure_location ||
										`https://source.unsplash.com/random/168x168`
									}
									alt={`profile image`}
									width={imageWidth}
									height={imageHeight}
									priority
								/>
							</figure>
						</div>
						<div className="col-lg-6">
							<h1 className="fw-bolder">{object?.data?.name}</h1>
							<p className="lead">{object?.data?.bio}</p>
						</div>
					</div>
				</div>
			</header>
			<div className="bg-dark mb-4">
				<div className="container">
					<div className="row">
						<div className="col-lg-12">
							<nav className="nav">
								<Link
									href={{
										pathname: `/profile/${object?.data?._id}/${object?.data?.username}`,
										query: {
											page: 1,
											limit: 50,
											sort: `-createdAt`,
										},
									}}
									passHref
									legacyBehavior
								>
									<a
										className={`nav-link ${isActive(
											`/profile/${object?.data?._id}/${object?.data?.username}`
										)}`}
									>
										Posts
									</a>
								</Link>
								<Link
									href={{
										pathname: `/profile/${object?.data?._id}/${object?.data?.username}/information`,
										query: {},
									}}
									passHref
									legacyBehavior
								>
									<a
										className={`nav-link ${isActive(
											`/profile/${object?.data?._id}/${object?.data?.username}/information`
										)}`}
									>
										Information
									</a>
								</Link>
								<Link
									href={{
										pathname: `/profile/${object?.data?._id}/${object?.data?.username}/socials/friends`,
										query: {
											page: 1,
											limit: 10,
											sort: `-createdAt`,
										},
									}}
									passHref
									legacyBehavior
								>
									<a
										className={`nav-link ${isActive(
											`/profile/${object?.data?._id}/${object?.data?.username}/social/friends`
										)}`}
									>
										Socials
									</a>
								</Link>
								<Link
									href={{
										pathname: `/profile/${object?.data?._id}/${object?.data?.username}/photos`,
										query: {
											page: 1,
											limit: 50,
											sort: `-createdAt`,
											album: `posts`,
										},
									}}
									passHref
									legacyBehavior
								>
									<a
										className={`nav-link ${isActive(
											`/profile/${object?.data?._id}/${object?.data?.username}/photos`
										)}`}
									>
										Photos
									</a>
								</Link>
								<Link
									href={{
										pathname: `/profile/${object?.data?._id}/${object?.data?.username}/videos`,
										query: {
											page: 1,
											limit: 50,
											sort: `-createdAt`,
										},
									}}
									passHref
									legacyBehavior
								>
									<a
										className={`nav-link ${isActive(
											`/profile/${object?.data?._id}/${object?.data?.username}/videos`
										)}`}
									>
										Videos
									</a>
								</Link>
								<Link
									href={{
										pathname: `/profile/${object?.data?._id}/${object?.data?.username}/map`,
										query: {
											page: 1,
											limit: 10,
											sort: `-createdAt`,
										},
									}}
									passHref
									legacyBehavior
								>
									<a
										className={`nav-link ${isActive(
											`/profile/${object?.data?._id}/${object?.data?.username}/map`
										)}`}
									>
										Visit Registrations
									</a>
								</Link>
							</nav>
						</div>
					</div>
				</div>
			</div>
		</>
	);
};

export default Jumbotron;
