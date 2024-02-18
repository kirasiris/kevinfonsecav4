import { Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import Loading from "@/app/quiz/loading";
import ParseHtml from "@/layout/parseHtml";

const Single = ({ object = {} }) => {
	return (
		<Suspense fallback={<Loading />}>
			<article className={`${object._id} col-lg-6`}>
				<div className={`card mb-3`}>
					<Link
						href={{
							pathname: `/quiz/${object._id}/${object?.category?._id}/${object?.category?.slug}/${object.slug}`,
						}}
						passHref
						legacyBehavior
					>
						<Image
							src={
								object.files?.avatar?.location?.secure_location ||
								`https://source.unsplash.com/random/300x200`
							}
							className="card-img-top rounded-0"
							alt={`${object.title}'s featured image`}
							width={`300`}
							height={`200`}
						/>
					</Link>
					<div className="card-body">
						<h5 className="card-title">{object.title}</h5>
						<p className="card-text">
							{typeof object.text === "object" ? (
								"TEXT IS EITHER ENCRYPTED OR PASSWORD PROTECTED"
							) : (
								<ParseHtml text={JSON.stringify(object.text)} />
							)}
						</p>
					</div>
					<ul className="list-group list-group-flush">
						<li className="list-group-item p-0">
							<p className="m-0"></p>
						</li>
						<li className="list-group-item">
							<p className="m-0">
								Category: {object.category?.title || "No category"}
							</p>
						</li>
						<li className="list-group-item">
							<p className="m-0">Duration: {object.duration}</p>
						</li>
						<li className="list-group-item">
							<p className="m-0">Minimum score: {object.minimumScore}</p>
						</li>
						<li className="list-group-item">
							<p className="m-0">Maximum score: {object.maximumScore}</p>
						</li>
						<li className="list-group-item">
							<p className="m-0">Attempts allowed: {object.attempts}</p>
						</li>
						<li className="list-group-item">
							<p className="m-0">
								{object.singlePage ? "Single page" : "Multiple pages"}
							</p>
						</li>
					</ul>
					<div className="card-footer">
						<Link
							href={{
								pathname: `/quiz/${object._id}/${object?.category?._id}/${object?.category?.slug}/${object.slug}`,
							}}
							passHref
							legacyBehavior
						>
							<a className="float-end">Take test</a>
						</Link>
					</div>
				</div>
			</article>
		</Suspense>
	);
};

export default Single;
