import { Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import Loading from "@/app/profile/loading";

const Single = ({
	object = {},
	imageWidth = "500",
	imageHeight = "320",
	isSingle = true,
}) => {
	const UrlToProfileContainer = ({ children }) => {
		return (
			<Link
				href={{
					pathname: `/profile/${object?._id}/${object?.username}`,
					query: {
						page: 1,
						limit: 50,
						sort: `-createdAt`,
					},
				}}
			>
				{children}
			</Link>
		);
	};
	return (
		<Suspense fallback={<Loading />}>
			{isSingle ? (
				<article className="col-lg-3 mb-3">
					<div className="border border-1">
						<UrlToProfileContainer>
							<div
								className="widget-header"
								style={{
									background: `url(${
										object?.files?.cover?.location?.secure_location ||
										`https://source.unsplash.com/random/${imageWidth}x${imageHeight}`
									})`,
								}}
							></div>
						</UrlToProfileContainer>
						<div className="widget-body text-center">
							<UrlToProfileContainer>
								<Image
									src={
										object?.files?.avatar?.location?.secure_location ||
										`https://source.unsplash.com/random/${imageWidth}x${imageHeight}`
									}
									className="widget-img img-circle img-border"
									alt={`${object?.username || "Username"}'s profile's picture`}
									width={imageWidth}
									height={imageHeight}
									style={{
										objectFit: "cover",
									}}
								/>
							</UrlToProfileContainer>
							<UrlToProfileContainer>
								<h4 className="m-0">{object?.username || "Username"}</h4>
							</UrlToProfileContainer>
							<p className="text-muted m-0">{object?.name || "Name"}</p>
							<div className="py-1">
								{object?.social?.facebook && (
									<a
										className="btn-light btn-sm"
										href={`${object?.social?.facebook}`}
										title={`${object?.username || "Username"}'s Facebook`}
										data-original-title="Facebook"
									>
										<i className="fa-brands fa-facebook" />
									</a>
								)}
								{object?.social?.twitter && (
									<a
										className="btn-light btn-sm"
										href={`${object?.social?.twitter}`}
										title={`${object?.username || "Username"}'s X`}
										data-original-title="Twitter"
									>
										<i className="fa-brands fa-twitter" />
									</a>
								)}
								{object?.email && (
									<a
										className="btn-light btn-sm"
										href={`mailto:${object?.email}`}
										title={`${object?.username || "Username"}'s email`}
										data-original-title="Email"
									>
										<i className="fa fa-envelope" />
									</a>
								)}
							</div>
						</div>
					</div>
				</article>
			) : (
				<div className="border border-1">
					<div
						className="widget-header"
						style={{
							background: `url(${
								object?.files?.cover?.location?.secure_location ||
								`https://source.unsplash.com/random/${imageWidth}x${imageHeight}`
							})`,
						}}
					/>
					<div className="widget-body text-center">
						<Image
							src={
								object?.files?.avatar?.location?.secure_location ||
								`https://source.unsplash.com/random/${imageWidth}x${imageHeight}`
							}
							className="widget-img img-circle img-border"
							alt={`${object?.username || "Username"}'s profile's picture`}
							width={imageWidth}
							height={imageHeight}
							style={{
								objectFit: "cover",
							}}
						/>
						<h4 className="m-0">{object?.username || "Username"}</h4>
						<p className="text-muted m-0">{object?.name || "Name"}</p>
					</div>
				</div>
			)}
		</Suspense>
	);
};

export default Single;
