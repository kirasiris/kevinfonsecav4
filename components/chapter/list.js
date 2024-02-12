import Image from "next/image";
import Link from "next/link";
import ParseHtml from "@/layout/parseHtml";
import AuthorBox from "@/components/global/authorbox";
import ExportModal from "@/components/global/exportmodal";
import ReportModal from "@/components/global/reportmodal";

const List = ({
	object,
	objects = [],
	isAdmin = false,
	params = {},
	searchParams = {},
	isIndex = true,
	linkToShare = "",
	postType = "",
	onModel = "",
}) => {
	return (
		<div className="container">
			{object.data.status === "published" || searchParams.isAdmin === true ? (
				<div className="row">
					<div className="col-lg-8">
						<article>
							<div className="mb-3">
								<h1>{object.data.title}</h1>
								<div className="text-muted fst-italic mb-2">
									Posted&nbsp;on&nbsp;{object.data.createdAt}&nbsp;by&nbsp;
									{object.data.user.username}
								</div>
								{params.category && (
									<Link
										href={{
											pathname: `/course/category/${params.category}`,
											query: {
												page: 1,
												limit: 32,
											},
										}}
										passHref
										legacyBehavior
									>
										<a className="badge bg-secondary text-decoration-none link-light me-1">
											{params.category}
										</a>
									</Link>
								)}
								{params.subcategory && (
									<Link
										href={{
											pathname: `/course/subcategory/${params.subcategory}`,
											query: {
												page: 1,
												limit: 32,
											},
										}}
										passHref
										legacyBehavior
									>
										<a className="badge bg-secondary text-decoration-none link-light">
											{params.subcategory}
										</a>
									</Link>
								)}
							</div>
							<div className="card mb-3">
								<div className="card-header">{object.data.title}</div>
								<div className="card-body">
									<ParseHtml text={object.data.text} />
								</div>
							</div>
							{isIndex && (
								<>
									<div className="card">
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
																<a>
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
									<div className="float-start">
										<ExportModal
											linkToShare={linkToShare}
											object={object?.data}
										/>
									</div>
									<div className="float-end">
										<ReportModal
											postId={object?.data?._id}
											postType={postType}
											onModel={onModel}
										/>
									</div>

									<div style={{ clear: "both" }} />
									<AuthorBox author={object?.data?.user} />
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
						</article>
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
