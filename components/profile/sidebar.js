"use client";
import Link from "next/link";
import Image from "next/image";
import Globalsidebar from "@/layout/sidebar";

const Sidebar = ({ object = {} }) => {
	return (
		<Globalsidebar>
			<div className="card mb-3">
				<div className="card-header">About</div>
				<div className="card-body p-0">
					<ul className="list-group list-group-flush">
						<li className="list-group-item">
							<p className="m-0">
								{object.data?.isOnline ? (
									<strong className="text-success">Is&nbsp;Online</strong>
								) : (
									<strong className="text-danger">Is&nbsp;Offline</strong>
								)}
								{object.data?.isLive && (
									<>
										&nbsp;&amp;&nbsp;<strong>Is Live</strong>
									</>
								)}
							</p>
						</li>

						{object.data?.bio && (
							<li className="list-group-item">
								<p className="m-0">{object.data?.bio}</p>
							</li>
						)}
						{object.data?.sex && (
							<li className="list-group-item">
								<p className="m-0">
									{object.data?.sex.charAt(0).toUpperCase() +
										object.data?.sex.slice(1)}
								</p>
							</li>
						)}
						{object.data?.gender && (
							<li className="list-group-item">
								<p className="m-0">
									{object.data?.gender.charAt(0).toUpperCase() +
										object.data?.gender.slice(1)}
								</p>
							</li>
						)}
						{object.data?.age && (
							<li className="list-group-item">
								<p className="m-0">{object.data?.age}</p>
							</li>
						)}
						{object.data?.company && (
							<li className="list-group-item">
								<p className="m-0">{object.data?.company}</p>
							</li>
						)}
						{object.data?.workstatus && (
							<li className="list-group-item">
								<p className="m-0">
									{object.data?.workstatus.charAt(0).toUpperCase() +
										object.data?.workstatus.slice(1)}
								</p>
							</li>
						)}
						{object.data?.email && (
							<li className="list-group-item">
								<p className="m-0">{object.data?.email}</p>
							</li>
						)}
						{object.data?.relationshipStatus && (
							<li className="list-group-item">
								<p className="m-0">
									{object.data?.relationshipStatus.charAt(0).toUpperCase() +
										object.data?.relationshipStatus.slice(1)}
								</p>
							</li>
						)}
						{object.data?.inRelationshipWith && (
							<li className="list-group-item border-0 pb-1">
								<Image
									src={
										object.data?.inRelationshipWith.files?.avatar?.location
											?.secure_location ||
										`https://source.unsplash.com/random/1200x900`
									}
									className="mr-3"
									width={45}
									height={45}
									alt={`${object.data?.inRelationshipWith?.username}'s profile avatar`}
									style={{ objectFit: "cover" }}
								/>
								<Link
									href={{
										pathname: `/profile/${object.data?.inRelationshipWith?._id}/${object.data?.inRelationshipWith?.username}`,
										query: {
											page: 1,
											limit: 10,
											sort: `-createdAt`,
										},
									}}
								>
									{object.data?.inRelationshipWith.username}
								</Link>
							</li>
						)}
					</ul>
				</div>
				<div className="card-footer">
					{object.data?.role.length > 0 &&
						object.data?.role
							.filter((r) => r !== "founder")
							.map((r, i) => (
								<div key={i} className="badge bg-secondary me-1">
									{r.charAt(0).toUpperCase() + r.slice(1)}
								</div>
							))}
				</div>
			</div>
			{object.data?.tags.length > 0 && (
				<div className="card mb-3">
					<div className="card-header">Interests</div>
					<div className="card-body">
						{object.data.tags.map((tag, index) => (
							<div key={index} className="badge bg-secondary me-1">
								<Link
									href={{
										pathname: `/search/profiles`,
										query: {
											keyword: tag,
											page: 1,
											limit: 48,
											sort: `-createdAt`,
										},
									}}
								>
									#{tag.charAt(0).toUpperCase() + tag.slice(1)}
								</Link>
							</div>
						))}
					</div>
				</div>
			)}
		</Globalsidebar>
	);
};

export default Sidebar;
