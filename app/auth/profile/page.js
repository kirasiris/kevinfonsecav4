import { Suspense } from "react";
import { redirect } from "next/navigation";
import Link from "next/link";
import Sidebar from "@/layout/auth/sidebar";
import Globalcontent from "@/layout/content";
import Loading from "@/app/blog/loading";
import ParseHtml from "@/layout/parseHtml";
import Single from "@/components/profile/single";
import Head from "@/app/head";
import { getGlobalData } from "@/helpers/globalData";

const AuthIndex = async ({ params, searchParams }) => {
	const { auth, settings } = await getGlobalData();

	// Redirect if user is not logged in
	(auth?.error?.statusCode === 401 || !auth?.data?.isOnline) &&
		redirect(`/auth/login`);

	return (
		<Suspense fallback={<Loading />}>
			<Head
				title={`${settings?.data?.title} - Account`}
				description={"Your account"}
				favicon={settings?.data?.favicon}
				postImage=""
				imageWidth=""
				imageHeight=""
				videoWidth=""
				videoHeight=""
				card="summary"
				robots=""
				category=""
				url={`/auth/profile`}
				author=""
				createdAt=""
				updatedAt=""
				locales=""
				posType="page"
			/>
			<div className="container my-4">
				<div className="row">
					<Sidebar />
					<Globalcontent>
						<div className="card mb-4">
							<div className="card-header">
								Welcome&nbsp;back,&nbsp;{auth.data.username}
							</div>
							<div className="card-body p-0">
								<div className="row">
									<div className="col-6 mb-4">
										<ul className="list-group list-group-flush">
											<li className="list-group-item text-bg-secondary">
												<Link href={`/auth/editbasics`}>BASICS</Link>
											</li>
											{auth.data.username && (
												<li className="list-group-item">
													{auth.data.username}
												</li>
											)}

											{auth.data.workstatus && (
												<li className="list-group-item">
													{auth.data.workstatus}
												</li>
											)}
											{auth.data.email && (
												<li className="list-group-item">
													{auth.data.email}&nbsp;-&nbsp;
													<span className="badge bg-secondary">primary</span>
												</li>
											)}
											{auth.data.secondaryEmail && (
												<li className="list-group-item">
													{auth.data.secondaryEmail}&nbsp;-&nbsp;
													<span className="badge bg-secondary">secondary</span>
												</li>
											)}
											{auth.data.email && (
												<li className="list-group-item">{auth.data.website}</li>
											)}
											{auth.data.social?.facebook && (
												<li className="list-group-item">
													{auth.data.social.facebook}
												</li>
											)}
											{auth.data.social?.twitter && (
												<li className="list-group-item">
													{auth.data.social.twitter}
												</li>
											)}
											{auth.data.social?.youtube && (
												<li className="list-group-item">
													{auth.data.social.youtube}
												</li>
											)}
											{auth.data.social?.instagram && (
												<li className="list-group-item">
													{auth.data.social?.instagram}
												</li>
											)}
											{auth.data.social?.linkedIn && (
												<li className="list-group-item">
													{auth.data.social?.linkedIn}
												</li>
											)}
											{auth.data.social?.steamId && (
												<li className="list-group-item">
													{auth.data.social?.steamId}
												</li>
											)}
											{auth.data.social?.xboxId && (
												<li className="list-group-item">
													{auth.data.social?.xboxId}
												</li>
											)}
										</ul>
									</div>
									<div className="col-6 mb-4">
										<ul className="list-group list-group-flush">
											<li className="list-group-item text-bg-secondary">
												<Link href={`/auth/editavatar`}>
													AVATAR&nbsp;&&nbsp;COVER
												</Link>
											</li>
											<li>
												<Single object={auth.data} isSingle={false} />
											</li>
										</ul>
									</div>
									<div className="col-12">
										<ul className="list-group list-group-flush">
											<li className="list-group-item text-bg-secondary">
												<Link href={`/auth/editabout`}>ABOUT</Link>
											</li>
											{auth.data.name && (
												<li className="list-group-item">{auth.data.name}</li>
											)}
											{auth.data.sex && (
												<li className="list-group-item">{auth.data.sex}</li>
											)}
											{auth.data.gender && (
												<li className="list-group-item">{auth.data.gender}</li>
											)}
											{auth.data.relationshipStatus && (
												<li className="list-group-item">
													{auth.data.relationshipStatus}
												</li>
											)}
											{auth.data.InRelationshipWith && (
												<li className="list-group-item">
													{auth.data.InRelationshipWith}
												</li>
											)}
											{auth.data.company && (
												<li className="list-group-item">{auth.data.company}</li>
											)}
											{auth.data.age && (
												<li className="list-group-item">{auth.data.age}</li>
											)}
											{auth.data.bio && (
												<li className="list-group-item">
													<ParseHtml text={auth.data.bio} />
												</li>
											)}
											{auth.data.tags.length >= 1 && (
												<li className="list-group-item">
													{auth.data.tags.map((skill, index) => (
														<div
															key={index}
															className="badge bg-secondary me-1"
														>
															#{skill}
														</div>
													))}
												</li>
											)}
										</ul>
									</div>
								</div>
							</div>
						</div>
					</Globalcontent>
				</div>
			</div>
		</Suspense>
	);
};

export default AuthIndex;
