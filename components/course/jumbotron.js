"use client";
import { toast } from "react-toastify";
import Image from "next/image";
import Link from "next/link";
import { loadStripe } from "@stripe/stripe-js";
import { currencyFormatter, formatDateWithoutTime } from "befree-utilities";
import Menu from "./menu";
import { fetchurl } from "@/helpers/setTokenOnServer";

const Jumbotron = ({
	auth = {},
	object = {},
	enrollmentVerification = {},
	imageWidth = "1200",
	imageHeight = "900",
}) => {
	const handleFreeEnrollment = async () => {
		try {
			await fetchurl(
				`/extras/stripe/subscriptions/courses/${object.data._id}/free`,
				"PUT",
				"no-cache",
				{
					resourceId: object.data._id,
					status: "published",
					onModel: "Course",
					isPaid: true,
					website: process.env.NEXT_PUBLIC_WEBSITE_NAME, // THIS IS IMPORTANT FOR DB
				}
			);

			// Reload entire page
			window.location.reload();
		} catch (err) {
			// const error = err.response.data.message;
			const error = err?.response?.data?.error?.errors;
			const errors = err?.response?.data?.errors;

			if (error) {
				// dispatch(setAlert(error, 'danger'));
				error &&
					Object.entries(error).map(([, value]) => toast.error(value.message));
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

	const handlePaidEnrollment = async () => {
		try {
			const res = await fetchurl(
				`/extras/stripe/subscriptions/courses/${object.data._id}/payment`,
				"POST",
				"no-cache",
				{
					resourceId: object.data._id,
					status: "published",
					onModel: "Course",
					isPaid: false,
					website: process.env.NEXT_PUBLIC_WEBSITE_NAME, // THIS IS IMPORTANT FOR DB
				}
			);

			// Redirect to stripe
			const stripe = await loadStripe(
				process.env.NEXT_PUBLIC_STRIPE_SECRET_KEY
			);
			stripe.redirectToCheckout({ sessionId: res?.stripe.id });
		} catch (err) {
			// const error = err.response.data.message;
			const error = err?.response?.data?.error?.errors;
			const errors = err?.response?.data?.errors;

			if (error) {
				// dispatch(setAlert(error, 'danger'));
				error &&
					Object.entries(error).map(([, value]) => toast.error(value.message));
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

	const handleCancellation = async (e) => {
		try {
			await fetchurl(
				`/extras/stripe/subscriptions/courses/${object.data._id}/cancel`,
				"PUT",
				"no-cache"
			);

			// Reload page
			window.location.reload();
		} catch (err) {
			// const error = err.response.data.message;
			const error = err?.response?.data?.error?.errors;
			const errors = err?.response?.data?.errors;

			if (error) {
				// dispatch(setAlert(error, 'danger'));
				error &&
					Object.entries(error).map(([, value]) => toast.error(value.message));
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
	return (
		<>
			<header className="bg-secondary py-5">
				<div className="container">
					<div className="row my-5">
						<div className="col-lg-8">
							<div className="text-white">
								{/* title */}
								<h1 className="fw-bolder">{object.data.title}</h1>
								{/* description */}
								<p className="lead">{object.data.sub_title}</p>
								{/* category */}
								<p>
									Category&nbsp;
									<Link
										href={{
											pathname: `/course/category/${object.data.category}`,
											query: {
												page: 1,
												limit: 32,
											},
										}}
										className="badge bg-dark text-decoration-none"
									>
										{object.data.category}
									</Link>
									&nbsp;/&nbsp;
									<Link
										href={{
											pathname: `/course/subcategory/${object.data.sub_category}`,
											query: {
												page: 1,
												limit: 32,
											},
										}}
										className="badge bg-dark text-decoration-none"
									>
										{object.data.sub_category}
									</Link>
								</p>
								{/* author */}
								<p>Created&nbsp;by&nbsp;{object.data.user.name}</p>
								{/* updatedAt */}
								<p>
									Last&nbsp;updated&nbsp;
									{formatDateWithoutTime(object.data.updatedAt)}
								</p>
								{/* price */}
								<p className="fs-4 fw-bolder">
									Price&nbsp;
									{object.data.isFree
										? "Free"
										: currencyFormatter(object.data.price, "USD")}
								</p>
							</div>
						</div>
						<div className="col-lg-4">
							{/* show video or image preview */}
							{object?.data?.files?.avatar?.location?.secure_location.includes(
								".mp4"
							) ? (
								<figure className="mb-4 bg-dark">
									<p>VIDEO</p>
								</figure>
							) : (
								<figure className="mb-4 bg-dark">
									<Image
										className="img-fluid p-3"
										src={
											object?.data?.files?.avatar?.location?.secure_location ||
											`https://source.unsplash.com/random/440x570`
										}
										alt={`featured image`}
										width={imageWidth}
										height={imageHeight}
										priority
									/>
								</figure>
							)}
							{/* enroll button */}

							{auth?.data?.isOnline ? (
								// If free and not enrolled
								(object?.data?.isFree && !enrollmentVerification?.success && (
									<button
										className="btn btn-dark btn-sm w-100 mb-3"
										onClick={() => handleFreeEnrollment()}
									>
										Enroll for Free
									</button>
								)) ||
								// If not free and not enrolled
								(!object?.data?.isFree &&
									!enrollmentVerification?.success &&
									(auth.data.stripe.latestStripeCheckoutLink === null ||
									auth.data.stripe.latestStripeCheckoutLink === undefined ? (
										<button
											className="btn btn-dark btn-sm w-100 mb-3"
											onClick={() => handlePaidEnrollment()}
										>
											Pay to Enroll
										</button>
									) : (
										<div className="btn-group">
											<a
												href={auth.data.stripe.latestStripeCheckoutLink}
												target="_blank"
												className="btn btn-dark btn-sm w-100 mb-3"
											>
												There is a checkout session in your account!
											</a>
											<button
												className="btn btn-danger btn-sm w-100 mb-3"
												onClick={() => handleCancellation()}
											>
												Cancel Payment and Enrollment to Course
											</button>
										</div>
									))) ||
								// If free/not free and already enrolled
								((object?.data?.isFree || !object?.data?.isFree) &&
									enrollmentVerification?.success && (
										<p className="bg-dark text-bg-dark rounded text-center m-0 p-2">
											Already enrolled
										</p>
									))
							) : (
								<Link
									href={{
										pathname: `/auth/login`,
										query: {
											returnpage: `/course/${object.data._id}/${object.data.category}/${object.data.sub_category}/${object.data.slug}/index`,
										},
									}}
									className="btn btn-dark btn-sm w-100 mb-3"
								>
									Login to Enroll
								</Link>
							)}
						</div>
					</div>
				</div>
			</header>
			<Menu object={object} />
		</>
	);
};

export default Jumbotron;
