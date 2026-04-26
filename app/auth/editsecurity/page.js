import { Suspense } from "react";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import Link from "next/link";
import { fetchurl } from "@/helpers/setTokenOnServer";
import Sidebar from "@/layout/auth/sidebar";
import Globalcontent from "@/layout/content";
import Loading from "@/app/blog/loading";
import UpdateEmailsForm from "@/forms/auth/updateemailsform";
import UpdatePasswordForm from "@/forms/auth/updatepasswordform";
import UpdatePasskeyForm from "@/forms/auth/updatepasskeyform";
import Head from "@/app/head";
import { getGlobalData } from "@/helpers/globalData";
import ErrorPage from "@/layout/errorpage";
import List from "@/components/auth/emails/list";

const UpdatePasswords = async ({ params, searchParams }) => {
	const { auth, settings } = await getGlobalData();

	// Redirect if user is not logged in
	(auth?.error?.statusCode === 401 || !auth?.data?.isOnline) &&
		redirect(`/auth/login`);

	const removeEmail = async (id) => {
		"use server";

		// const rawFormData = {};

		await fetchurl(
			`/auth/emails/remove/${id}`,
			"DELETE",
			"no-cache",
			{},
			undefined,
			false,
			false,
		);

		revalidatePath(`/auth/editsecurity`);
	};

	const setPrimaryEmail = async (id) => {
		"use server";

		// const rawFormData = {};

		await fetchurl(
			`/auth/emails/primary/${id}`,
			"PUT",
			"no-cache",
			{},
			undefined,
			false,
			false,
		);

		revalidatePath(`/auth/editsecurity`);
	};

	return (
		<>
			<Head
				title={`${settings?.data?.title} - Account Security`}
				description={"Your account security"}
				favicon={settings?.data?.favicon}
				postImage=""
				imageWidth=""
				imageHeight=""
				videoWidth=""
				videoHeight=""
				card="summary"
				robots=""
				category=""
				url={`/auth/editsecurity`}
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
											<div className="d-flex align-items-center my-2">
												Manage&nbsp;Emails
											</div>
										</div>
										<div className="float-end my-1">
											<div className="btn-group">
												<Link
													href={{
														pathname: `/auth/emails/create`,
														query: {},
													}}
													className="btn btn-primary btn-sm"
												>
													Add&nbsp;Email
												</Link>
											</div>
										</div>
									</div>
									<div className="card-body">
										<label htmlFor="email" className="form-label">
											Primary&nbsp;Email
										</label>
										<input
											id="email"
											name="email"
											defaultValue={auth?.data?.email}
											type="email"
											className="form-control mb-3"
											disabled
											placeholder="john.doe@demo.com"
										/>
										<List
											objects={auth?.data?.emails}
											handleIsPrimary={setPrimaryEmail}
											handleRemoveEmail={removeEmail}
										/>
										{/* <UpdateEmailsForm auth={auth} /> */}
									</div>
								</div>
								<div className="card mb-3">
									<div className="card-header">Edit&nbsp;Password</div>
									<div className="card-body">
										<UpdatePasswordForm auth={auth} />
									</div>
								</div>
								<div className="card">
									<div className="card-header">Enable&nbsp;Passkeys</div>
									<div className="card-body">
										<UpdatePasskeyForm auth={auth} />
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

export default UpdatePasswords;
