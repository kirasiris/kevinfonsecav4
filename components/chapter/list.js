import ParseHtml from "@/layout/parseHtml";
import Link from "next/link";
// import CommentBox from "../global/commentbox";
import Image from "next/image";

const List = ({
	object,
	objects = [],
	isAdmin = false,
	searchParams = {},
	isIndex = true,
}) => {
	return (
		<div className="container">
			{object.data.status === "published" || searchParams.isAdmin === true ? (
				<div className="row">
					<div className="col-lg-8">
						<div className="card rounded-0 mb-3">
							<div className="card-header">{object.data.title}</div>
							<div className="card-body">
								<ParseHtml text={object.data.text} />
							</div>
						</div>
						{isIndex && (
							<>
								<div className="card rounded-0">
									<div className="card-header">
										<div className="float-start">
											<div className="d-flex align-items-center">
												<p className="mt-2 mb-0">Episodes</p>
											</div>
										</div>
										{isAdmin && (
											<div className="float-end my-1">
												<Link
													href={{
														pathname: `/noadmin/courses/lesson/${object.data._id}/create`,
														query: {},
													}}
													passHref
													legacyBehavior
												>
													<a className="btn btn-outline-secondary btn-sm">
														Add lesson
													</a>
												</Link>
											</div>
										)}
									</div>
									{objects?.data?.length > 0 ? (
										<ul
											className="list-group list-group-flush overflow-x-hidden"
											style={{ maxHeight: "1000px" }}
										>
											{objects.data.map((lesson, index) => (
												<li
													key={lesson._id}
													className={`${index} list-group-item ${lesson.orderingNumber}`}
												>
													<div className="float-start">
														<Link
															href={`/video/${lesson._id}`}
															passHref
															legacyBehavior
														>
															<a target="_blank">
																<span className="badge bg-secondary me-1">
																	{lesson.orderingNumber}
																</span>
																{lesson.title}
															</a>
														</Link>
													</div>
													<div className="float-end">
														<span className="badge bg-info me-1">
															{lesson.duration}
														</span>
														<span className="badge bg-secondary me-1">
															{lesson.views} Views
														</span>
														<span className="badge bg-dark me-1">
															{lesson.language.toUpperCase()}
														</span>
													</div>
												</li>
											))}
										</ul>
									) : (
										<div className="alert alert-danger rounded-0  m-0 border-0">
											Nothing found
										</div>
									)}
								</div>
								<hr />
								{/* <CommentBox
							user={blog?.data?.user}
							postId={blog?.data?._id}
							secondPostId={blog?.data?._id}
							isVisible={blog?.data?.commented}
							postType="blog"
							onModel="Blog"
						/> */}
							</>
						)}
					</div>
					<div className="col-xl-4 col-lg-4 col-md-4 col-sm-12 col-xs-12 d-none d-sm-none d-md-none d-lg-block dm-xl-block">
						<figure className="mb-3 bg-dark">
							<Image
								className="img-fluid p-3"
								src={
									object?.data?.files?.avatar?.location?.secure_location ||
									`https://source.unsplash.com/random/260x370`
								}
								alt={`${object?.data?.files?.avatar?.location?.filename}'s featured image`}
								width={440}
								height={570}
								priority
							/>
						</figure>
					</div>
				</div>
			) : (
				<p>Nothing found</p>
			)}
		</div>
	);
};

export default List;
