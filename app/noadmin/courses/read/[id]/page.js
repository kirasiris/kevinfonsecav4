"use client";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import ParseHtml from "@/layout/parseHtml";
import Image from "next/image";
import Link from "next/link";

const ReadCourse = () => {
	const router = useRouter();

	const [course, setCourse] = useState(null);
	const [lessons, setLessons] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(false);

	const { id } = useParams();
	const courseId = id;

	useEffect(() => {
		const fetchCourse = async () => {
			try {
				const res = await axios.get(`/courses/${courseId}`);
				setCourse(res?.data?.data);
				setLoading(false);
			} catch (err) {
				console.log(err);
				// const error = err.response.data.message;
				const error = err?.response?.data?.error?.errors;
				const errors = err?.response?.data?.errors;

				if (error) {
					// dispatch(setAlert(error, 'danger'));
					error &&
						Object.entries(error).map(([, value]) =>
							toast.error(value.message)
						);
				}

				if (errors) {
					errors.forEach((error) => toast.error(error.msg));
				}

				toast.error(err?.response?.statusText);
				return {
					msg: err?.response?.statusText,
					status: err?.response?.status,
				};
			}
		};

		const fetchLessons = async (id) => {
			try {
				const res = await axios.get(
					`/videos?resourceId=${courseId}&sort=orderingNumber`
				);
				setLessons(res?.data?.data);
			} catch (err) {
				console.log(err);
				// const error = err.response.data.message;
				const error = err?.response?.data?.error?.errors;
				const errors = err?.response?.data?.errors;

				if (error) {
					// dispatch(setAlert(error, 'danger'));
					error &&
						Object.entries(error).map(([, value]) =>
							toast.error(value.message)
						);
				}

				if (errors) {
					errors.forEach((error) => toast.error(error.msg));
				}

				toast.error(err?.response?.statusText);
				return {
					msg: err?.response?.statusText,
					status: err?.response?.status,
				};
			}
		};
		fetchCourse();
		fetchLessons();
	}, [courseId]);

	const updateOrder = async (e, index) => {
		e.dataTransfer.setData("itemIndex", index.toString());
	};

	const updateDrop = async (e, index) => {
		const movingItemIndex = e.dataTransfer.getData("itemIndex");

		const targetItemIndex = index;

		let allLessons = lessons;

		let movingItem = allLessons[movingItemIndex];
		let targetItem = allLessons[targetItemIndex];

		if (movingItem.orderingNumber === targetItem.orderingNumber) {
			// Switch the ordering numbers of the moving item and the target item
			const tempOrderingNumber = movingItem.orderingNumber;
			movingItem.orderingNumber = targetItem.orderingNumber;
			targetItem.orderingNumber = tempOrderingNumber;
		}

		allLessons.splice(movingItemIndex, 1); // remove one item from the given index
		allLessons.splice(targetItemIndex, 0, movingItem); // Push item after target item index

		setLessons([...lessons], allLessons);

		await axios.put(`/videos/${movingItem._id}/updateorder`, {
			index: targetItemIndex,
		});
	};

	return loading || course === null || course === undefined ? (
		error ? (
			<>Not found</>
		) : (
			<>Loading...</>
		)
	) : (
		<div className="row">
			<div className="col-lg-8">
				<div className="card mb-3">
					<div className="card-header">{course.title}</div>
					<div className="card-body">
						<ParseHtml text={course.text} />
					</div>
				</div>
				<div className="card">
					<div className="card-header">Episodes</div>
					{lessons?.length > 0 ? (
						<ul
							className="list-group list-group-flush overflow-x-hidden"
							style={{ maxHeight: "1000px" }}
							onDragOver={(e) => e.preventDefault()}
						>
							{lessons.map((lesson, index) => (
								<li
									key={lesson._id}
									className={`list-group-item ${lesson.orderingNumber}`}
									draggable={true}
									onDragStart={(e) => updateOrder(e, index)}
									onDrop={(e) => updateDrop(e, index)}
								>
									<Link
										href={`/video/${lesson._id}/${lesson.slug}`}
										passHref
										legacyBehavior
									>
										<a target="_blank">
											<span className="badge bg-secondary">{index}</span> -
											{lesson.title}
										</a>
									</Link>
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
			</div>
			<div className="col-xl-4 col-lg-4 col-md-4 col-sm-12 col-xs-12 d-none d-sm-none d-md-none d-lg-block dm-xl-block">
				<figure className="mb-3 bg-dark">
					<Image
						className="img-fluid p-3"
						src={
							course?.files?.avatar?.location?.secure_location ||
							`https://source.unsplash.com/random/260x370`
						}
						alt={`${course?.files?.avatar?.location?.filename}'s featured image`}
						width={440}
						height={570}
						priority
					/>
				</figure>
			</div>
		</div>
	);
};

export default ReadCourse;
