"use client";
import Image from "next/image";
import Link from "next/link";
import DropdownButton from "react-bootstrap/DropdownButton";
import { formatDateWithoutTime } from "befree-utilities";
import DeleteModal from "@/components/global/deletemodal";

const Single = ({
	object = {},
	handleStripeCustomerId = () => {},
	handleStripeAccountId = () => {},
	handleStripeId = () => {},
	handleSellerAccount = () => {},
	handleDelete = () => {},
	objects = [],
	setObjects = () => {},
	setTotalResults = () => {},
}) => {
	return (
		<li className="list-group-item">
			<div className="blog-item__panel">
				<div className="blog-item__detail">
					<div className="blog-item__info">{object.name}</div>
					<h1 className="blog-item__title">
						<Link
							href={{
								pathname: `/noadmin/users/update/${object._id}`,
								query: {},
							}}
							passHref
							legacyBehavior
						>
							<a className="blog-item__title-link">{object.username}</a>
						</Link>
					</h1>
					<div className="blog-item__meta">
						<span className="badge bg-dark me-1">
							{formatDateWithoutTime(object.createdAt)}
						</span>
						<span className="badge bg-dark me-1">{object.status}</span>
					</div>
				</div>
				<div className="blog-type-list__blog-thumbnail-wrapper has-image d-none d-md-block d-lg-block d-xl-block d-xxl-block">
					<Link
						href={{
							pathname: `/noadmin/users/update/${object._id}`,
							query: {},
						}}
						passHref
						legacyBehavior
					>
						<a className="blog-type-list__blog-thumbnail-link">
							<Image
								src={
									object.files?.avatar?.location.secure_location ||
									`https://source.unsplash.com/random/83x63`
								}
								className="blog-type-list__blog-thumbnail"
								alt="Blog titles image"
								width="83"
								height="63"
							/>
						</a>
					</Link>
				</div>
				<div className="blog-actions-ellipsis-menu">
					<span className="ellipsis-menu">
						<DropdownButton title="Options" variant="secondary">
							{(object?.stripe?.stripeCustomerId === `` ||
								object?.stripe?.stripeCustomerId === undefined ||
								object?.stripe?.stripeCustomerId === null) && (
								<button
									className="dropdown-item btn btn-sm"
									onClick={() => handleStripeCustomerId(object._id)}
								>
									Assign&nbsp;Stripe&nbsp;Customer&nbsp;Id
								</button>
							)}
							{(object?.stripe?.stripeAccountId === `` ||
								object?.stripe?.stripeAccountId === undefined ||
								object?.stripe?.stripeAccountId === null) && (
								<button
									className="dropdown-item btn btn-sm"
									onClick={() => handleStripeAccountId(object._id)}
								>
									Assign&nbsp;Stripe&nbsp;Account&nbsp;Id
								</button>
							)}
							{(object?.stripe?.stripeCustomerId === "" ||
								object?.stripe?.stripeCustomerId === undefined ||
								object?.stripe?.stripeCustomerId === null) &&
								(object?.stripe?.stripeAccountId === "" ||
									object?.stripe?.stripeAccountId === undefined ||
									object?.stripe?.stripeAccountId === null) && (
									<button
										className="dropdown-item btn btn-sm"
										onClick={() => handleStripeId(object._id)}
									>
										Assign&nbsp;Stripe&nbsp;Customer&nbsp;and&nbsp;Account&nbsp;Ids
									</button>
								)}
							{object.stripe?.stripeAccountId !== `` &&
								object.stripe?.stripeAccountId !== undefined &&
								object.stripe?.stripeAccountId !== null && (
									<button
										className="dropdown-item btn btn-sm"
										onClick={() => handleSellerAccount(object._id)}
									>
										Update&nbsp;Stripe&nbsp;Seller&nbsp;Account?
									</button>
								)}
							<Link
								href={{
									pathname: `/noadmin/users/read/${object._id}`,
									query: {
										isAdmin: true,
									},
								}}
								passHref
								legacyBehavior
							>
								<a className="dropdown-item btn btn-link" target="_blank">
									View&nbsp;It
								</a>
							</Link>
							<DeleteModal
								id={object._id ? object._id : object._id}
								action={handleDelete}
								classStr={`dropdown-item`}
								objects={objects}
								setObjects={setObjects}
								setTotalResults={setTotalResults}
							/>
						</DropdownButton>
					</span>
				</div>
			</div>
		</li>
	);
};

export default Single;
