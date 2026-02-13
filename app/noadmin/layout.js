import { Suspense } from "react";
import { redirect } from "next/navigation";
import "@/src/css/admin.css";
import AdminMenu from "@/components/noadmin/adminmenu";
import Loading from "@/app/blog/loading";
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
				title={`${settings?.data?.title} - Management`}
				description={"Manage Website"}
				favicon={settings?.data?.favicon}
				postImage=""
				imageWidth=""
				imageHeight=""
				videoWidth=""
				videoHeight=""
				card="summary"
				robots=""
				category=""
				url={`/noadmin`}
				author=""
				createdAt=""
				updatedAt=""
				locales=""
				posType="page"
			/>
			<div className="container-fluid my-4">
				<div className="row">
					<AdminMenu />
					<div className="col-lg-11">{children}</div>
				</div>
			</div>
		</Suspense>
	);
}
