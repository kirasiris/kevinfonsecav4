import { Suspense } from "react";
import { redirect } from "next/navigation";
import Link from "next/link";
import Sidebar from "@/layout/auth/sidebar";
import Globalcontent from "@/layout/content";
import Loading from "@/app/blog/loading";
import UpdateCoverForm from "@/forms/auth/updatecoverform";
import Head from "@/app/head";
import { getGlobalData } from "@/helpers/globalData";

const UpdateCover = async ({ params, searchParams }) => {
	const { auth, settings } = await getGlobalData();

	// Redirect if user is not logged in
	(auth?.error?.statusCode === 401 || !auth?.data?.isOnline) &&
		redirect(`/auth/login`);

	return (
		<Suspense fallback={<Loading />}>
			<Head
				title={`${settings?.data?.title} - Account Cover`}
				description={"Your account cover"}
				favicon={settings?.data?.favicon}
				postImage=""
				imageWidth=""
				imageHeight=""
				videoWidth=""
				videoHeight=""
				card="summary"
				robots=""
				category=""
				url={`/auth/editcover`}
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
						<div className="card">
							<div className="card-header">
								<div className="float-start">
									<p className="m-1">Edit&nbsp;Cover</p>
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
											href="/auth/editavatar"
											className="btn btn-secondary btn-sm"
										>
											Update avatar
										</Link>
									</div>
								</div>
							</div>
							<UpdateCoverForm auth={auth} />
						</div>
					</Globalcontent>
				</div>
			</div>
		</Suspense>
	);
};

export default UpdateCover;
