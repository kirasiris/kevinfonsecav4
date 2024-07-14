"use client";
import { Suspense, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Loading from "@/app/comment/loading";
import ParseHtml from "@/layout/parseHtml";
import { DropdownButton } from "react-bootstrap";
import DeleteModal from "../global/deletemodal";
import CommentBox from "../global/myfinalcommentbox";
import MyFinalCommentClientForm from "../global/myfinalcommentclientform";
import { fetchurl } from "@/helpers/setTokenOnServer";

const Single = ({
	auth = {},
	object = {},
	handleDraft,
	handlePublish,
	handleTrash,
	handleSchedule,
	handleDelete,
	objects,
	setObjects,
	setTotalResults,
}) => {
	const [replyButton, setReplyButton] = useState("Reply");
	const [openCommentForm, setOpenCommentForm] = useState(false);
	const [childComments, setChildComments] = useState([]);

	const fetchComments = async (params = "") => {
		const children = await fetchurl(`/comments${params}`);
		console.log("children", children.data);
		setChildComments(children);
	};

	return (
		<Suspense fallback={<Loading />}>
			<article id={object?._id} className={object?._id}>
				<div className="d-flex my-4" id={`media comment ${object?._id}`}>
					<div className="flex-shrink-0">
						<Link
							href={`/profile/${object?.user?._id}/${object?.user?.username}`}
							passHref
							legacyBehavior
						>
							<Image
								src={
									object?.user.files?.avatar?.location?.secure_location ||
									`https://source.unsplash.com/random/64x64`
								}
								alt={`${object?.user?.username || "Username"}'s featured image`}
								width="64"
								height="64"
								className="div-hover"
							/>
						</Link>
					</div>
					<div className="flex-grow-1 ms-3">
						<div className="float-start">
							<Link
								href={`/comment/${object?._id}/${object?.slug}`}
								passHref
								legacyBehavior
							>
								{object.title || "Untitled"}
							</Link>
							&nbsp;by&nbsp;
							<Link
								href={`/profile/${object?.user?._id}/${object?.user?.username}`}
								passHref
								legacyBehavior
							>
								<a className="btn btn-secondary btn-sm">
									{object?.user?.username || "Username"}
								</a>
							</Link>
						</div>
						{auth?.userId === object?.user?._id && (
							<div className="float-end">
								<DropdownButton title="..." variant="secondary" size="sm">
									<button
										className="dropdown-item btn btn-sm"
										onClick={() => handleDraft(object._id)}
									>
										Draft&nbsp;It
									</button>
									<button
										className="dropdown-item btn btn-sm"
										onClick={() => handlePublish(object._id)}
									>
										Publish&nbsp;It
									</button>
									<button
										className="dropdown-item btn btn-sm"
										onClick={() => handleTrash(object._id)}
									>
										Trash&nbsp;It
									</button>
									<button
										className="dropdown-item btn btn-sm"
										onClick={() => handleSchedule(object._id)}
									>
										Schedule&nbsp;It
									</button>
									<DeleteModal
										id={object?._id}
										action={handleDelete}
										classStr="dropdown-item"
										objects={objects}
										setObjects={setObjects}
										setTotalResults={setTotalResults}
									/>
								</DropdownButton>
							</div>
						)}
						<div className="clearfix" />
						<div className="card-text mt-1">
							{typeof object?.text === "object" ? (
								"TEXT IS EITHER ENCRYPTED OR PASSWORD PROTECTED"
							) : (
								<ParseHtml text={object?.text} />
							)}
							{auth?.userId && (
								<div className={`create-child-comment-${object?._id}`}>
									{(object.parentId === null ||
										object.parentId === undefined ||
										object.parentId === "") && (
										<button
											className="btn btn-link btn-sm"
											onClick={async () => {
												setReplyButton(
													replyButton === "Reply"
														? `Replying to ${object?.user?.username}`
														: "Reply"
												);
												setOpenCommentForm(!openCommentForm);
												await fetchComments(
													`?parentId=${object?._id}&decrypt=true`
												);
											}}
											type="button"
										>
											{replyButton}
										</button>
									)}
									{openCommentForm && (
										<MyFinalCommentClientForm
											resourceId={object?.resourceId?._id}
											parentId={object?._id}
											postType="comment"
											onModel="Comment"
											objects={childComments}
											setObjects={setChildComments}
										/>
									)}
									<CommentBox
										auth={auth}
										allLink=""
										pageText="Child Comments"
										objects={childComments}
										searchParams={undefined}
										handleDraft={undefined}
										handlePublish={undefined}
										handleTrash={undefined}
										handleSchedule={undefined}
										handleDelete={handleDelete}
										handleTrashAllFunction={undefined}
										handleDeleteAllFunction={undefined}
										displayPagination={false}
									/>
								</div>
							)}
						</div>
					</div>
				</div>
			</article>
		</Suspense>
	);
};

export default Single;
