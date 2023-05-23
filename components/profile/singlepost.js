"use client";
import { Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import Loading from "@/app/profile/loading";
import Carousel from "react-bootstrap/Carousel";
import Badge from "react-bootstrap/Badge";
import ExportModal from "@/layout/exportmodal";
import { DropdownButton, Button } from "react-bootstrap";
import Waveform from "@/layout/waveform";

const Single = ({ post = {} }) => {
	const Author = (author = {}, postedto = {}, postedfrom = {}) => {
		return (
			<>
				<div className="float-start">
					<Link
						// href={{
						// 	pathname: `/profiles/${user._id ? user._id : auth?.user?._id}/${user.username ? user.username : auth?.user?.username}/posts`,
						// 	query: {
						// 		page: 1,
						// 		limit: 10,
						// 		sort: `-createdAt`,
						// 		loggedInUser: auth?.user?._id,
						// 	},
						// }}
						href="#!"
						passHref
						legacyBehavior
					>
						<a>
							<Image
								src={
									post.avatar?.location.secure_location ||
									`https://source.unsplash.com/random/35x35`
								}
								className="me-3"
								width="35"
								height="35"
								alt={`Username's profile avatar`}
								style={{ objectFit: "cover" }}
							/>
						</a>
					</Link>
				</div>
				<Link
					// href={{
					// 	pathname: `/profiles/${user._id ? user._id : auth?.user?._id}/${user.username ? user.username : auth?.user?.username}/posts`,
					// 	query: {
					// 		page: 1,
					// 		limit: 10,
					// 		sort: `-createdAt`,
					// 		loggedInUser: auth?.user?._id,
					// 	},
					// }}
					href="#!"
					passHref
					legacyBehavior
				>
					<a className="me-1">USERNAME</a>
				</Link>
				is playing
				<a href="#!" className="mx-1">
					Ghost Recon Breakpoint
				</a>
				{postedto && (
					<>
						posted to
						<Link
							// href={{
							// 	pathname: `/profiles/${user._id ? user._id : auth?.user?._id}/${user.username ? user.username : auth?.user?.username}/posts`,
							// 	query: {
							// 		page: 1,
							// 		limit: 10,
							// 		sort: `-createdAt`,
							// 		loggedInUser: auth?.user?._id,
							// 	},
							// }}
							href="#!"
							passHref
							legacyBehavior
						>
							<a className="ms-1 me-1">USERNAME</a>
						</Link>
					</>
				)}
				{postedfrom && (
					<>
						shared from
						<Link
							// href={{
							// 	pathname: `/profiles/${user._id ? user._id : auth?.user?._id}/${user.username ? user.username : auth?.user?.username}/posts`,
							// 	query: {
							// 		page: 1,
							// 		limit: 10,
							// 		sort: `-createdAt`,
							// 		loggedInUser: auth?.user?._id,
							// 	},
							// }}
							href="#!"
							passHref
							legacyBehavior
						>
							<a className="ms-1">USERNAME</a>
						</Link>
					</>
				)}
				<div className={`position-absolute privacy-options`}>
					<small className="me-1">2 days ago</small>
					<DropdownButton
						alignright="true"
						variant={`secondary`}
						size={`sm`}
						drop={`down`}
						id={`update-post`}
						title={<i className={`fas fa-ellipsis-h`} />}
					>
						<>
							<Button
								// onClick={!featureded ? featurePost : unfeaturePost}
								className={`dropdown-item`}
								type={`button`}
							>
								{/* <i className={`${featuredIcon} mr-1`} aria-hidden /> */}
								Only me
							</Button>
							<Button
								// onClick={!hiden ? hidePost : unhidePost}
								className={`dropdown-item`}
								type={`button`}
							>
								{/* <i className={`${hiddenIcon} mr-1`} aria-hidden /> */}
								Everyone can see
							</Button>
							<Button
								// onClick={!openEditor ? editorOpen : editorClosed}
								className={`dropdown-item`}
								type={`button`}
							>
								<i className={`fas fa-edit mr-1`} aria-hidden />
								People I follow
							</Button>
							<Button
								// onClick={!openEditor ? editorOpen : editorClosed}
								className={`dropdown-item`}
								type={`button`}
							>
								<i className={`fas fa-edit mr-1`} aria-hidden />
								People following me
							</Button>
							<Button
								// onClick={!openEditor ? editorOpen : editorClosed}
								className={`dropdown-item`}
								type={`button`}
							>
								<i className={`fas fa-edit mr-1`} aria-hidden />
								Anonymous
							</Button>
						</>
					</DropdownButton>
				</div>
				<DropdownButton
					alignright="true"
					variant={`secondary`}
					size={`sm`}
					drop={`down`}
					id={`update-post`}
					title={<i className={`fas fa-ellipsis-h`} />}
					className={`float-end`}
				>
					<>
						<Button
							// onClick={!featureded ? featurePost : unfeaturePost}
							className={`dropdown-item`}
							type={`button`}
						>
							{/* <i className={`${featuredIcon} mr-1`} aria-hidden /> */}
							Pin post
						</Button>
						<Button
							// onClick={!hiden ? hidePost : unhidePost}
							className={`dropdown-item`}
							type={`button`}
						>
							{/* <i className={`${hiddenIcon} mr-1`} aria-hidden /> */}
							Hide post
						</Button>
						<Button
							// onClick={!openEditor ? editorOpen : editorClosed}
							className={`dropdown-item`}
							type={`button`}
						>
							<i className={`fas fa-edit mr-1`} aria-hidden />
							Update post
						</Button>
						<Button
							// onClick={!openEditor ? editorOpen : editorClosed}
							className={`dropdown-item`}
							type={`button`}
						>
							<i className={`fas fa-edit mr-1`} aria-hidden />
							Disable comments
						</Button>
					</>
				</DropdownButton>
			</>
		);
	};

	const Gallery = (media = [], text = "") => {
		return media?.media?.length > 1 ? (
			<>
				<Carousel style={{ position: "sticky" }}>
					{true
						? media?.media?.slice(0, 5).map((image, index) => (
								<Carousel.Item key={index} className={`${index}`}>
									<>
										{console.log("Displaying 5 images", image)}
										<Image
											// src={`${
											// 	image || `https://source.unsplash.com/random/1200x900`
											// }`}
											// alt={`${post?._id}'s images`}
											src={image}
											alt={`post's images`}
											className={`p-0 d-block w-100`}
											width={`450`}
											height={`450`}
										/>
									</>
								</Carousel.Item>
						  ))
						: media?.media?.map((image, index) => (
								<Carousel.Item key={index} className={`${index}`}>
									<>
										{console.log("Displaying all images", image)}
										<Image
											src={image}
											alt={`post's images`}
											className={`p-0 d-block w-100`}
											width={`450`}
											height={`450`}
										/>
									</>
								</Carousel.Item>
						  ))}
				</Carousel>
				<h6
					className={`position-absolute`}
					style={{ right: "10px", top: "62px" }}
				>
					<Badge pill variant={`light`}>
						{media?.media?.length}
					</Badge>
				</h6>
			</>
		) : media?.media?.length === 1 ? (
			<Image
				src={media?.media[0]}
				alt={`post's id image`}
				className={`p-0 d-block w-100`}
				width={`450`}
				height={`450`}
				style={{ objectFit: "fit" }}
			/>
		) : (
			<p className="mb-0">{text}</p>
		);
	};

	const images = ["https://source.unsplash.com/random/1200x900"];

	return (
		<Suspense fallback={<Loading />}>
			<article className={`${post?._id} mb-3`}>
				<div className="card">
					<div className="card-header">
						<Author
							user={post?.user}
							postedto={post?.postedto}
							postedfrom={post?.postedfrom}
						/>
					</div>
					<div
						className={`card-body ${
							(post?.media?.length >= 1 || images?.length >= 1) && `p-0`
						}`}
					>
						<Gallery
							media={images}
							text={`TEXT IS EITHER ENCRYPTED OR PASSWORD PROTECTED`}
						/>
						<Waveform
							src="/JinMoriSaysRun.mp3"
							mediaTitle="The God of High School OST - Seoul Team / Monkey King Say Run ( HQ Cover)"
							mediaAuthor="Dude's Cover"
							mediaAlbum=""
							mediaArtwork={images}
						/>
					</div>
					<div className="card-footer">
						<div className="float-end">
							<ExportModal object={post} />
						</div>
					</div>
				</div>
			</article>
		</Suspense>
	);
};

export default Single;
