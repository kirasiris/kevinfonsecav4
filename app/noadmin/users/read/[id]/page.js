import Image from "next/image";
import { formatDateWithoutTime } from "befree-utilities";
import { fetchurl } from "@/helpers/setTokenOnServer";

async function getUser(params) {
	const res = await fetchurl(`/global/users${params}`, "GET", "no-cache");
	return res;
}

const ReadUser = async ({ params, searchParams }) => {
	const awtdParams = await params;
	const awtdSearchParams = await searchParams;
	const user = await getUser(`/${awtdParams.id}`);

	return (
		<div className="row">
			<div className="col-lg-3">
				<article>
					<div className="card">
						<div className="card-header">
							User ID&nbsp;-&nbsp;(<b>{user?.data?._id}</b>)
						</div>
						<div className="card-body p-0">
							<figure>
								<Image
									className="img-thumbnail"
									src={
										user?.data?.files?.avatar?.location?.secure_location ||
										`https://source.unsplash.com/random/168x168`
									}
									alt={`profile image`}
									width={407}
									height={307}
									style={{
										width: `${407}px !important`,
										height: `${307}px !important`,
										objectFit: "cover",
									}}
									priority
								/>
							</figure>
							<ul className="list-group list-group-flush">
								<li className="list-group-item d-flex justify-content-between">
									<span>Username</span>
									<span>
										<b>{user?.data?.username}</b>
									</span>
								</li>
								<li className="list-group-item d-flex justify-content-between">
									<span>Full name</span>
									<span>{user?.data?.name}</span>
								</li>
								<li className="list-group-item d-flex justify-content-between">
									<span>Age</span>
									<span>{user?.data?.age}</span>
								</li>
								<li className="list-group-item d-flex justify-content-between">
									<span>Sex</span>
									<span>{user?.data?.sex}</span>
								</li>
								<li className="list-group-item d-flex justify-content-between">
									<span>Relationship status</span>
									<span>{user?.data?.relationshipStatus}</span>
								</li>
								<li className="list-group-item d-flex justify-content-between">
									<span>In relationship with</span>
									<span>{user?.data?.inRelationshipWith}</span>
								</li>
								<li className="list-group-item d-flex justify-content-between">
									<span>Bio</span>
									<span>{user?.data?.bio}</span>
								</li>
								<li className="list-group-item d-flex justify-content-between">
									<span>Email</span>
									<span>
										<b>{user?.data?.email}</b>
									</span>
								</li>
								<li className="list-group-item d-flex justify-content-between">
									<span>Secondary email</span>
									<span>{user?.data?.secondaryEmail}</span>
								</li>
								<li className="list-group-item d-flex justify-content-between">
									<span>Phone number</span>
									<span>
										<b>{user?.data?.phoneNumber}</b>
									</span>
								</li>
								<li className="list-group-item d-flex justify-content-between">
									<span>Company</span>
									<span>{user?.data?.company}</span>
								</li>
								<li className="list-group-item d-flex justify-content-between">
									<span>Website</span>
									<span>{user?.data?.website}</span>
								</li>
								<li className="list-group-item d-flex justify-content-between">
									<span>Registered at</span>
									<span>
										<b>{formatDateWithoutTime(user?.data?.createdAt)}</b>
									</span>
								</li>
								<li className="list-group-item d-flex justify-content-between">
									<span>Is email confirmed</span>
									<span>
										<b>{user?.data?.isEmailConfirmed.toString()}</b>
									</span>
								</li>
							</ul>
						</div>
					</div>
				</article>
			</div>
		</div>
	);
};

export default ReadUser;
