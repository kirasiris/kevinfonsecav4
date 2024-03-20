"use client";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import ParseHtml from "@/layout/parseHtml";
import Image from "next/image";
import Link from "next/link";
import List from "@/components/chapter/list";
import PreviewModal from "@/components/chapter/previewmodal";
import AuthContext from "@/helpers/globalContext";

const ReadCourse = () => {
	const { auth } = useContext(AuthContext);
	const router = useRouter();

	// Redirect if not authenticated
	!auth.isAuthenticated && router.push("/auth/login");

	// Redirec if not founder
	auth.isAuthenticated &&
		!auth.user.role.includes("founder") &&
		router.push("/dashboard");

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

		const fetchLessons = async () => {
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

		let allLessons = lessons; // Create a copy of the lessons array

		let movingItem = allLessons[movingItemIndex];
		let targetItem = allLessons[targetItemIndex];

		if (movingItem.orderingNumber !== targetItem.orderingNumber) {
			// Only update the ordering numbers if they are different

			// Switch the ordering numbers of the moving item and the target item
			const tempOrderingNumber = movingItem.orderingNumber;
			movingItem.orderingNumber = targetItem.orderingNumber;
			targetItem.orderingNumber = tempOrderingNumber;

			// Update the ordering numbers in the backend
			await axios.put(`/videos/${movingItem._id}/updateorder`, {
				index: movingItem.orderingNumber, // Update the moving item's ordering number
			});
			await axios.put(`/videos/${targetItem._id}/updateorder`, {
				index: targetItem.orderingNumber, // Update the target item's ordering number
			});
		}

		allLessons.splice(movingItemIndex, 1); // Remove the moving item from the original position
		allLessons.splice(targetItemIndex, 0, movingItem); // Insert the moving item at the target position

		setLessons([...lessons], allLessons);
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
				<div className="card rounded-0 mb-3">
					<div className="card-header">{course.title}</div>
					<div className="card-body">
						<ParseHtml text={course.text} />
					</div>
				</div>
				<div className="card rounded-0">
					<div className="card-header">
						<div className="float-start">
							<div className="d-flex align-items-center">
								<p className="mt-2 mb-0">Episodes</p>
							</div>
						</div>
						<div className="float-end my-1">
							<div className="btn-group">
								<Link
									href={{
										pathname: `/noadmin/courses/lesson/${course._id}/create`,
										query: {},
									}}
									passHref
									legacyBehavior
								>
									<a className="btn btn-outline-secondary btn-sm">Add lesson</a>
								</Link>
							</div>
						</div>
					</div>
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
									draggable
									onDragStart={(e) => updateOrder(e, index)}
									onDrop={(e) => updateDrop(e, index)}
								>
									<div className="float-start">
										<Link href={`/video/${lesson._id}`} passHref legacyBehavior>
											<a target="_blank">
												<span className="badge bg-secondary me-1">
													{lesson.orderingNumber}
												</span>
												{lesson.title}
											</a>
										</Link>
									</div>
									<div className="float-end">
										{lesson.free_preview && <PreviewModal object={lesson} />}
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
