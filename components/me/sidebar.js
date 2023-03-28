import Image from "next/image";
import Link from "next/link";
const Sidebar = ({ profile = {}, photos = [] }) => {
	return (
		<>
			<div className="card mb-3">
				<div className="card-header">About</div>
				<div className="card-body p-0">
					<ul className="list-group list-group-flush">
						{profile.data?.isOnline && (
							<li className="list-group-item">
								<p className="m-0">
									<strong className="text-success">Is Online</strong>
									{profile.data?.isLive && (
										<>
											&nbsp;&amp;&nbsp;<strong>Is Live</strong>
										</>
									)}
								</p>
							</li>
						)}
						{profile.data?.bio && (
							<li className="list-group-item">
								<p className="m-0">{profile.data?.bio}</p>
							</li>
						)}
						{profile.data?.sex && (
							<li className="list-group-item">
								<p className="m-0">
									{profile.data?.sex.charAt(0).toUpperCase() +
										profile.data?.sex.slice(1)}
								</p>
							</li>
						)}
						{profile.data?.gender && (
							<li className="list-group-item">
								<p className="m-0">
									{profile.data?.gender.charAt(0).toUpperCase() +
										profile.data?.gender.slice(1)}
								</p>
							</li>
						)}
						{profile.data?.age && (
							<li className="list-group-item">
								<p className="m-0">{profile.data?.age}</p>
							</li>
						)}
						{profile.data?.company && (
							<li className="list-group-item">
								<p className="m-0">{profile.data?.company}</p>
							</li>
						)}
						{profile.data?.workstatus && (
							<li className="list-group-item">
								<p className="m-0">
									{profile.data?.workstatus.charAt(0).toUpperCase() +
										profile.data?.workstatus.slice(1)}
								</p>
							</li>
						)}
						{profile.data?.email && (
							<li className="list-group-item">
								<p className="m-0">{profile.data?.email}</p>
							</li>
						)}
						{profile.data?.relationshipStatus && (
							<li className="list-group-item">
								<p className="m-0">
									{profile.data?.relationshipStatus.charAt(0).toUpperCase() +
										profile.data?.relationshipStatus.slice(1)}
								</p>
							</li>
						)}
						{profile.data?.inRelationshipWith && (
							<li className="list-group-item border-0 pb-1">
								<Image
									src={
										profile.data?.inRelationshipWith.avatar ||
										`https://source.unsplash.com/random/1200x900`
									}
									className="mr-3"
									width={30}
									height={30}
									alt={`${profile.data?.inRelationshipWith}'s  profile avatar`}
									style={{ objectFit: "cover" }}
								/>
								<Link
									href={{
										pathname: `/profiles/${profile.data?._id}/${profile.data?.username}`,
										query: {
											page: 1,
											limit: 10,
											sort: `-createdAt`,
										},
									}}
								>
									{profile.data?.inRelationshipWith.username}
								</Link>
							</li>
						)}
					</ul>
				</div>
				<div className="card-footer">
					{profile.data?.role.length > 0 &&
						profile.data?.role.map((r, i) => (
							<div key={i} className="badge bg-secondary">
								{r.charAt(0).toUpperCase() + r.slice(1)}
							</div>
						))}
				</div>
			</div>
			{photos.data?.length > 0 && (
				<div className="card mb-3">
					<div className="card-header">
						Photos
						<Link
							href={{
								pathname: `/profiles/${profile.data?._id}/${profile.data?.username}/photos`,
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
							<a className="float-end">View all</a>
						</Link>
					</div>
					<div className="card-body p-0">
						{photos.data?.map((photo, index) => (
							<Link
								key={index}
								href={{
									pathname: `/profiles/${photo.user._id}/${photo.user.username}/photos/${photo._id}`,
									query: {
										page: 1,
										limit: 50,
										sort: `-createdAt`,
									},
								}}
								passHref
								legacyBehavior
							>
								<a>
									<Image
										src={
											photo.location.secure_location ||
											`https://source.unsplash.com/random/1200x900`
										}
										className="mr-3"
										width={168}
										height={168}
										alt={`${photo.user.username}'s profile avatars`}
										style={{ objectFit: "cover", marginBottom: "4px" }}
									/>
								</a>
							</Link>
						))}
					</div>
				</div>
			)}
			{profile.data?.tags.length > 0 && (
				<div className="card mb-3">
					<div className="card-header">Interests</div>
					<div className="card-body">
						{profile.data?.tags.map((tag, index) => (
							<div key={index} className="badge bg-secondary">
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
		</>
	);
};

export default Sidebar;
