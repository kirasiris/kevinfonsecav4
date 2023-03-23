import Image from "next/image";
import Link from "next/link";
const Sidebar = ({ me = {}, photos = [] }) => {
	return (
		<>
			<div className="card mb-3">
				<div className="card-header">About</div>
				<div className="card-body p-0">
					<ul className="list-group list-group-flush">
						{me.data[0].bio && (
							<li className="list-group-item">
								<p className="m-0">{me.data[0].bio}</p>
							</li>
						)}
						{me.data[0].sex && (
							<li className="list-group-item">
								<p className="m-0">
									{me.data[0].sex.charAt(0).toUpperCase() +
										me.data[0].sex.slice(1)}
								</p>
							</li>
						)}
						{me.data[0].age && (
							<li className="list-group-item">
								<p className="m-0">{me.data[0].age}</p>
							</li>
						)}
						{me.data[0].company && (
							<li className="list-group-item">
								<p className="m-0">{me.data[0].company}</p>
							</li>
						)}
						{me.data[0].workstatus && (
							<li className="list-group-item">
								<p className="m-0">
									{me.data[0].workstatus.charAt(0).toUpperCase() +
										me.data[0].workstatus.slice(1)}
								</p>
							</li>
						)}
						{me.data[0].email && (
							<li className="list-group-item">
								<p className="m-0">{me.data[0].email}</p>
							</li>
						)}
						{me.data[0].relationshipStatus && (
							<li className="list-group-item">
								<p className="m-0">
									{me.data[0].relationshipStatus.charAt(0).toUpperCase() +
										me.data[0].relationshipStatus.slice(1)}
								</p>
							</li>
						)}
						{me.data[0].inRelationshipWith && (
							<li className="list-group-item border-0 pb-1">
								<Image
									src={
										me.data[0].inRelationshipWith.avatar ||
										`https://source.unsplash.com/random/1200x900`
									}
									className="mr-3"
									width={30}
									height={30}
									alt={`${me.data[0].inRelationshipWith}'s  profile avatar`}
									style={{ objectFit: "cover" }}
								/>
								<Link
									href={{
										pathname: `/profiles/${me.data[0]._id}/${me.data[0].username}`,
										query: {
											page: 1,
											limit: 10,
											sort: `-createdAt`,
										},
									}}
								>
									{me.data[0].inRelationshipWith.username}
								</Link>
							</li>
						)}
					</ul>
				</div>
				<div className="card-footer">
					{me.data[0].role.length > 0 &&
						me.data[0].role.map((r, i) => (
							<div key={i} className="badge bg-secondary">
								{r.charAt(0).toUpperCase() + r.slice(1)}
							</div>
						))}
				</div>
			</div>
			{photos.data.length > 0 && (
				<div className="card mb-3">
					<div className="card-header">
						Photos
						<Link
							href={{
								pathname: `/profiles/${me.data[0]._id}/${me.data[0].username}/photos`,
								query: {
									page: 1,
									limit: 50,
									sort: `-createdAt`,
								},
							}}
							passHref
							legacyBehavior
						>
							<a className="float-end">View all</a>
						</Link>
					</div>
					<div className="card-body p-0">
						{photos.data.map((photo, index) => (
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
										width={113}
										height={113}
										alt={`${photo.user.username}'s profile avatars`}
										style={{ objectFit: "cover", marginBottom: "4px" }}
									/>
								</a>
							</Link>
						))}
					</div>
				</div>
			)}
			{me.data[0].tags.length > 0 && (
				<div className="card mb-3">
					<div className="card-header">Interests</div>
					<div className="card-body">
						{me.data[0].tags.map((tag, index) => (
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
