import { Suspense } from "react";
import { redirect } from "next/navigation";
import Link from "next/link";
import Sidebar from "@/layout/auth/sidebar";
import Globalcontent from "@/layout/content";
import Loading from "@/app/blog/loading";
import UpdateAvatarForm from "@/forms/auth/updateavatarform";
import Head from "@/app/head";
import { getGlobalData } from "@/helpers/globalData";
import ErrorPage from "@/layout/errorpage";

const UpdateAvatar = async ({ params, searchParams }) => {
	const { auth, settings } = await getGlobalData();

	// Redirect if user is not logged in
	(auth?.error?.statusCode === 401 || !auth?.data?.isOnline) &&
		redirect(`/auth/login`);

	return (
		<>
			<Head
				title={`${settings?.data?.title} - Account Avatar`}
				description={"Your account avatar"}
				favicon={settings?.data?.favicon}
				postImage=""
				imageWidth=""
				imageHeight=""
				videoWidth=""
				videoHeight=""
				card="summary"
				robots=""
				category=""
				url={`/auth/editavatar`}
				author=""
				createdAt=""
				updatedAt=""
				locales=""
				posType="page"
			/>
			{settings?.data?.maintenance === false ? (
				<Suspense fallback={<Loading />}>
					<div className="container my-4">
						<div className="row">
							<Sidebar />
							<Globalcontent>
								<div className="card">
									<div className="card-header">
										<div className="float-start">
											<p className="m-1">Edit&nbsp;Avatar</p>
										</div>
										<div className="float-end">
											<div className="btn-group">
												<Link
													href="/auth/uploadpicture"
													className="btn btn-secondary btn-sm"
												>
													Take a picture
												</Link>
												<Link
													href="/auth/editcover"
													className="btn btn-secondary btn-sm"
												>
													Update cover
												</Link>
											</div>
										</div>
									</div>
									<UpdateAvatarForm auth={auth} />
								</div>
							</Globalcontent>
						</div>
					</div>
				</Suspense>
			) : (
				<ErrorPage />
			)}
		</>
	);
};

export default UpdateAvatar;
