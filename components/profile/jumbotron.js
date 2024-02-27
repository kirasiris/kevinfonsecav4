"use client";
import { currencyFormatter, formatDateWithoutTime } from "@/helpers/utilities";
import Image from "next/image";
import Link from "next/link";

const Jumbotron = ({
	authenticatedUser = {},
	object = {},
	params = {},
	headerStyle = {},
}) => {
	return (
		<>
			<header className={`bg-secondary border-bottom py-5`} style={headerStyle}>
				<div className={`container`}>Profile Jumbotron</div>
			</header>
			<div className="bg-light mb-4">
				<div className="container">
					<div className="row">
						<div className="col-lg-12">
							<nav className="nav">
								<Link
									href={{
										pathname: `/profile/${object?.data?._id}/${object?.data?.username}`,
										query: {
											page: 1,
											limit: 50,
											sort: `-createdAt`,
										},
									}}
									passHref
									legacyBehavior
								>
									<a className="nav-link active">Posts</a>
								</Link>
								<Link
									href={{
										pathname: `/profile/${object?.data?._id}/${object?.data?.username}/information`,
										query: {},
									}}
									passHref
									legacyBehavior
								>
									<a className="nav-link active">Information</a>
								</Link>
								<Link
									href={{
										pathname: `/profile/${object?.data?._id}/${object?.data?.username}/friends`,
										query: {
											page: 1,
											limit: 10,
											sort: `-createdAt`,
										},
									}}
									passHref
									legacyBehavior
								>
									<a className="nav-link active">Friends</a>
								</Link>
								<Link
									href={{
										pathname: `/profile/${object?.data?._id}/${object?.data?.username}/photos`,
										query: {
											page: 1,
											limit: 50,
											sort: `-createdAt`,
											album: `posts`,
										},
									}}
									passHref
									legacyBehavior
								>
									<a className="nav-link active">Photos</a>
								</Link>
								<Link
									href={{
										pathname: `/profile/${object?.data?._id}/${object?.data?.username}/videos`,
										query: {
											page: 1,
											limit: 50,
											sort: `-createdAt`,
										},
									}}
									passHref
									legacyBehavior
								>
									<a className="nav-link active">Videos</a>
								</Link>
								<Link
									href={{
										pathname: `/profile/${object?.data?._id}/${object?.data?.username}/map`,
										query: {
											page: 1,
											limit: 10,
											sort: `-createdAt`,
										},
									}}
									passHref
									legacyBehavior
								>
									<a className="nav-link active">Visit Registrations</a>
								</Link>
							</nav>
						</div>
					</div>
				</div>
			</div>
		</>
	);
};

export default Jumbotron;
