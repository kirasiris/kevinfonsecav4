import Link from "next/link";
import Image from "next/image";
import ParseHtml from "@/layout/parseHtml";
import AuthorBox from "@/components/global/authorbox";
import ExportModal from "@/components/global/exportmodal";
import ReportModal from "@/components/global/reportmodal";
import Globalcontent from "@/layout/content";
import Globalsidebar from "@/layout/sidebar";
import PreviewModal from "./previewmodal";
import NewsletterForm from "../global/newsletter";

const List = ({
	object = {},
	objects = [],
	students = [],
	isAdmin = false,
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
					<Globalcontent>
						<article>
							<div className="card mb-3">
								<div className="card-header">{object.data.title}</div>
								<div className="card-body">
									<ParseHtml text={object.data?.text} />
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
															Add&nbsp;lesson
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
																href={`/course/${object.data._id}/${object.data.category}/${object.data.sub_category}/${object.data.slug}/video/${lesson._id}`}
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
															{lesson.free_preview && (
																<PreviewModal object={lesson} />
															)}
															<span className="badge bg-info me-1">
																{lesson.duration}
															</span>
															<span className="badge bg-secondary me-1">
																{lesson.views}&nbsp;Views
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
												Nothing&nbsp;found
											</div>
										)}
									</div>
									<NewsletterForm
										sectionClassList="text-bg-dark text-center pt-3 pb-3 mb-4"
										headingClassList=""
									/>
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
									<div className="comments">{/* HERE GOES THE COMMENTS */}</div>
								</>
							)}
						</article>
					</Globalcontent>
					<Globalsidebar>
						{students?.data?.length > 0 && (
							<div className="card mb-3">
								<div className="card-header">
									Enrolled&nbsp;Students
									<Link
										href={{
											pathname: `/course/${object.data?._id}/students`,
											query: {
												page: 1,
												limit: 10,
												sort: `-createdAt`,
											},
										}}
										passHref
										legacyBehavior
									>
										<a className="float-end">View&nbsp;all</a>
									</Link>
								</div>
								<div className="card-body row g-2 p-0">
									{students.data.map((student, index) => (
										<Link
											key={student._id}
											href={{
												pathname: `/profile/${student.user._id}/${student.user.username}`,
												query: {
													page: 1,
													limit: 50,
												},
											}}
											passHref
											legacyBehavior
										>
											<a className="col">
												<Image
													src={
														student.user.files.avatar.location.secure_location
													}
													className={`${index}`}
													width={130}
													height={130}
													alt={`${student.user.username}'s profile avatars`}
													style={{
														objectFit: "cover",
														margin: "1px",
													}}
												/>
											</a>
										</Link>
									))}
								</div>
							</div>
						)}
					</Globalsidebar>
				</div>
			) : (
				<p>Nothing found</p>
			)}
		</div>
	);
};

export default List;
