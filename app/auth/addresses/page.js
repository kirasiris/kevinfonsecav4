import { Suspense } from "react";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import Link from "next/link";
import { fetchurl } from "@/helpers/setTokenOnServer";
import Sidebar from "@/layout/auth/sidebar";
import Globalcontent from "@/layout/content";
import Loading from "@/app/blog/loading";
import Head from "@/app/head";
import { getGlobalData } from "@/helpers/globalData";
import ErrorPage from "@/layout/errorpage";
import List from "@/components/auth/addresses/list";

async function getAddresses(params) {
	const res = await fetchurl(`/global/addresses${params}`, "GET", "no-cache");
	return res;
}

const AddressesPage = async ({ params, searchParams }) => {
	const { auth, settings } = await getGlobalData();

	// Redirect if user is not logged in
	(auth?.error?.statusCode === 401 || !auth?.data?.isOnline) &&
		redirect(`/auth/login`);

	const addresses = await getAddresses(`?user=${auth?.data?._id}`);

	const removeAddress = async (id) => {
		"use server";
		// const rawFormData = {}
		await fetchurl(
			`/protected/addresses/${id}/permanently`,
			"DELETE",
			"no-cache",
			{},
			undefined,
			false,
			false,
		);

		revalidatePath(`/auth/addresses`);
	};

	const setPrimaryAddress = async (id) => {
		"use server";
		// const rawFormData = {}
		await fetchurl(
			`/protected/addresses/${id}/primary`,
			"PUT",
			"no-cache",
			{},
			undefined,
			false,
			false,
		);

		redirect(`/auth/profile`);
	};

	return (
		<>
			<Head
				title={`${settings?.data?.title} - Account Addresses`}
				description={"Manage your addresses"}
				favicon={settings?.data?.favicon}
				postImage=""
				imageWidth=""
				imageHeight=""
				videoWidth=""
				videoHeight=""
				card="summary"
				robots=""
				category=""
				url={`/auth/addresses`}
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
											<div className="d-flex align-items-center my-2">
												Manage&nbsp;Addresses
											</div>
										</div>
										<div className="float-end my-1">
											<div className="btn-group">
												<Link
													href={{
														pathname: `/auth/addresses/create`,
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
										<label htmlFor="address" className="form-label">
											Primary&nbsp;Address
										</label>
										<input
											id="address"
											name="address"
											defaultValue={
												addresses?.data?.filter(
													(address) => address.isPrimary === true,
												)[0].address
											}
											type="text"
											className="form-control mb-3"
											disabled
											placeholder="John Doe"
										/>
										<List
											objects={addresses?.data}
											handleIsPrimary={setPrimaryAddress}
											handleRemoveAddress={removeAddress}
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

export default AddressesPage;
