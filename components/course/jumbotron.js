"use client";
import { currencyFormatter } from "@/helpers/utilities";
import Image from "next/image";
import Link from "next/link";

const Jumbotron = ({
	object = {},
	params = {},
	imageWidth = "1200",
	imageHeight = "900",
}) => {
	return (
		<header className="bg-secondary border-bottom py-5 mb-4">
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
										pathname: `/course/category/${params.category}`,
										query: {
											page: 1,
											limit: 32,
										},
									}}
									passHref
									legacyBehavior
								>
									<a className="badge bg-dark text-decoration-none">
										{params.category}
									</a>
								</Link>
								&nbsp;|&nbsp;
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
									<a className="badge bg-dark text-decoration-none">
										{params.subcategory}
									</a>
								</Link>
							</p>
							{/* author */}
							<p>Created&nbsp;by&nbsp;{object.data.user.name}</p>
							{/* updatedAt */}
							<p>Last&nbsp;updated&nbsp;{object.data.updatedAt}</p>
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
							<p>VIDEO</p>
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
						<div className="d-grid gap-2 col-12 mt-3 mb-3">
							{object.data.isFree ? (
								<button className="btn btn-dark btn-sm">Enroll for Free</button>
							) : (
								<button className="btn btn-dark btn-sm">Pay to Enroll</button>
							)}
						</div>
					</div>
				</div>
			</div>
		</header>
	);
};

export default Jumbotron;