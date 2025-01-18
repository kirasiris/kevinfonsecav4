import { Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import Loading from "@/app/realstate/loading";
import ParseHtml from "@/layout/parseHtml";

const Single = ({ object = {}, imageWidth = "415", imageHeight = "207" }) => {
	return (
		<Suspense fallback={<Loading />}>
			<article className={`${object?._id} col-lg-6`}>
				<div className={`card ${object?.featured && "text-bg-primary"} mb-4`}>
					<div>
						<Link
							href={`/realstate/${object?._id}/${object?.slug}`}
							passHref
							legacyBehavior
						>
							<Image
								src={
									object?.files?.avatar?.location.secure_location ||
									`https://source.unsplash.com/random/415x207`
								}
								className="card-img-top"
								alt={`${object?.title || "Untitled"}'s featured image`}
								width={imageWidth}
								height={imageHeight}
							/>
						</Link>
						{object?.rates?.weeklyPrice >= 1 && (
							<div className="badge bg-info position-absolute badge-tr-5">
								${object?.rates?.weeklyPrice || "0.00"}/Wkly
							</div>
						)}
						{object?.rates?.monthlyPrice >= 1 && (
							<div className="badge bg-info position-absolute badge-tr-5">
								${object?.rates?.monthlyPrice || "0.00"}/Mo
							</div>
						)}
						{object?.rates?.nightlyPrice >= 1 && (
							<div className="badge bg-info position-absolute badge-tr-5">
								${object?.rates?.nightlyPrice || "0.00"}/Q
							</div>
						)}
					</div>
					<div className="card-body">
						<div className="small text-muted">{object?.type || "house"}</div>
						<h2 className="card-title">
							<Link href={`/realstate/${object?._id}/${object?.slug}`}>
								{object?.title || "Untitled"}
							</Link>
						</h2>
						<div className="btn-group d-flex">
							<button className="btn btn-light btn-sm">
								{object?.bedrooms || "0"}
							</button>
							<button className="btn btn-light btn-sm">
								{object?.bathrooms || "0"}
							</button>
							<button className="btn btn-light btn-sm">
								{object?.landsize || "0"}
							</button>
						</div>
						<p className="card-text">
							{object?.rates?.weeklyPrice && (
								<bold>${object?.rates?.weeklyPrice}</bold>
							)}
							{object?.rates?.monthlyPrice && (
								<bold>${object?.rates?.monthlyPrice}</bold>
							)}
							{object?.rates?.nightlyPrice && (
								<bold>${object?.rates?.nightlyPrice}</bold>
							)}
						</p>
						{typeof object?.text === "object" ? (
							"TEXT IS EITHER ENCRYPTED OR PASSWORD PROTECTED"
						) : (
							<ParseHtml text={object?.text} classList="card-text" />
						)}
						<hr />
						{object?.address}
						<hr />
						<div className="float-start">
							{object?.location?.city || "Columbia"},&nbsp;
							{object?.location?.state || "SC"}
						</div>
						<div className="float-end">
							<Link
								href={`/realstate/${object?._id}/${object?.slug}`}
								passHref
								legacyBehavior
							>
								<a className="btn btn-sm btn-secondary">Read&nbsp;more</a>
							</Link>
						</div>
					</div>
				</div>
			</article>
		</Suspense>
	);
};

export default Single;
