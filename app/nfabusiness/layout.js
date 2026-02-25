import { Suspense } from "react";
import { redirect } from "next/navigation";
import "@/src/css/admin.css";
import NFAMenu from "@/components/nfabusiness/nfamenu";
import Loading from "@/app/nfabusiness/loading";
import Head from "@/app/head";
import { getGlobalData } from "@/helpers/globalData";

export default async function AdminLayout({ children }) {
	const { auth, settings } = await getGlobalData();

	// Redirect if user is not logged in
	(auth?.error?.statusCode === 401 || !auth?.data?.isOnline) &&
		redirect(`/auth/login`);

	// Redirec if not founder
	auth?.data?.isOnline &&
		!auth?.data?.role?.includes("founder") &&
		redirect(`/dashboard`);

	return (
		<Suspense fallback={<Loading />}>
			<Head
				title={`${settings?.data?.title} - NFA Business`}
				description={"Manage business"}
				favicon={settings?.data?.favicon}
				postImage=""
				imageWidth=""
				imageHeight=""
				videoWidth=""
				videoHeight=""
				card="summary"
				robots=""
				category=""
				url={`/nfabusiness`}
				author=""
				createdAt=""
				updatedAt=""
				locales=""
				posType="page"
			/>
			<div className="container-fluid my-4">
				<div className="row">
					<NFAMenu />
					<div className="col-lg-11">{children}</div>
				</div>
			</div>
		</Suspense>
	);
}
