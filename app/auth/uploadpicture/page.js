import { Suspense } from "react";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { fetchurl } from "@/helpers/setTokenOnServer";
import Link from "next/link";
import Sidebar from "@/layout/auth/sidebar";
import Globalcontent from "@/layout/content";
import Loading from "@/app/blog/loading";
import UploadPictureForm from "@/forms/auth/uploadpictureform";
import Head from "@/app/head";
import { getGlobalData } from "@/helpers/globalData";
import ErrorPage from "@/layout/errorpage";
import MasonryLayout from "@/components/auth/masonrylayout";

async function getFiles(params) {
	const res = await fetchurl(
		`/global/files${params}&album=profile-avatars&select=-data`,
		"GET",
		"no-cache",
	);
	return res;
}

const UploadPicture = async ({ params, searchParams }) => {
	const { auth, settings } = await getGlobalData();

	// Redirect if user is not logged in
	(auth?.error?.statusCode === 401 || !auth?.data?.isOnline) &&
		redirect(`/auth/login`);

	const files = await getFiles(`?user=${auth?.data?._id}`);

	const setAvatar = async (id) => {
		"use server";
		// const rawFormData = {}
		await fetchurl(`/auth/updateavatar`, "PUT", "no-cache", {
			avatar: id,
		});
		revalidatePath(`/auth/uploadpicture`);
	};

	return (
		<>
			<Head
				title={`${settings?.data?.title} - Account Photo`}
				description={"Your account photo"}
				favicon={settings?.data?.favicon}
				postImage=""
				imageWidth=""
				imageHeight=""
				videoWidth=""
				videoHeight=""
				card="summary"
				robots=""
				category=""
				url={`/auth/uploadpicture`}
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
								<div className="card mb-3">
									<div className="card-header">
										<div className="float-start">
											<p className="m-1">Take&nbsp;a&nbsp;Picture</p>
										</div>
										<div className="float-end">
											<div className="btn-group">
												<Link
													href="/auth/editavatar"
													className="btn btn-secondary btn-sm"
												>
													Update avatar
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
									<UploadPictureForm auth={auth} />
								</div>
								<div className="card">
									<div className="card-header">Previous&nbsp;Avatars</div>
									<div className="card-body">
										<MasonryLayout
											setNewAvatar={setAvatar}
											objects={files.data}
										/>
									</div>
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

export default UploadPicture;
