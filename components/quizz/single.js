import { Suspense } from "react";
import Link from "next/link";
import Loading from "@/app/blog/loading";
import Image from "next/image";

const Single = ({ quizz = {} }) => {
	return (
		<Suspense fallback={<Loading />}>
			<article className={`${quizz._id} col-lg-3`}>
				<div className={`card mb-3`}>
					<div className="card-header">
						<Link
							href={{
								pathname: `/quizz/${quizz._id}/${quizz?.category?._id}/${quizz?.category?.slug}/${quizz.slug}`,
							}}
							passHref
							legacyBehavior
						>
							<a>{quizz.title}</a>
						</Link>
					</div>
					<div className="card-body p-0">
						<ul className="list-group list-group-flush">
							<li className="list-group-item p-0">
								<p className="m-0">
									<Link
										href={{
											pathname: `/quizz/${quizz._id}/${quizz?.category?._id}/${quizz?.category?.slug}/${quizz.slug}`,
										}}
										passHref
										legacyBehavior
									>
										<Image
											src={
												quizz.avatar?.location?.secure_location ||
												`https://source.unsplash.com/random/300x200`
											}
											className="card-img-top rounded-0"
											alt={`${quizz.title}'s featured image`}
											width={`300`}
											height={`200`}
										/>
									</Link>
								</p>
							</li>
							<li className="list-group-item">
								<p className="m-0">
									Category: {quizz.category?.title || "No category"}
								</p>
							</li>
							<li className="list-group-item">
								<p className="m-0">Duration: {quizz.duration}</p>
							</li>
							<li className="list-group-item">
								<p className="m-0">Minimum score: {quizz.minimumSocre}</p>
							</li>
							<li className="list-group-item">
								<p className="m-0">Maximum score: {quizz.maximumScore}</p>
							</li>
							<li className="list-group-item">
								<p className="m-0">Attempts allowed: {quizz.attempts}</p>
							</li>
							<li className="list-group-item">
								<p className="m-0">
									{quizz.singlePage ? "Single page" : "Multiple pages"}
								</p>
							</li>
						</ul>
					</div>
					<div className="card-footer">
						<Link
							href={{
								pathname: `/quizz/${quizz._id}/${quizz?.category?._id}/${quizz?.category?.slug}/${quizz.slug}`,
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
