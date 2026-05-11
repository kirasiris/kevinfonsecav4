import { Suspense } from "react";
import { redirect } from "next/navigation";
import Link from "next/link";
import "@/src/css/admin.css";
import AdminMenu from "@/components/noadmin/adminmenu";
import Loading from "@/app/noadmin/loading";
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
			<header className="admin-header p-3 d-flex align-items-center gap-3">
				{/* Mobile menu button - visible on smaller screens */}
				<button
					className="btn btn-light d-lg-none"
					type="button"
					data-bs-toggle="offcanvas"
					data-bs-target="#mobileSidebar"
					aria-controls="mobileSidebar"
				>
					<i className="fa-solid fa-bars" />
				</button>
				<h5 className="mb-0">Dashboard</h5>
				<div className="ms-auto">
					<Link
						href={{
							pathname: process.env.NEXT_PUBLIC_WEBSITE_URL,
							query: {},
						}}
						className="btn btn-secondary btn-sm"
						target="_blank"
					>
						View Site
					</Link>
				</div>
			</header>
			<div className="d-flex">
				{/* Desktop Sidebar - visible on lg and up */}
				<aside className="admin-sidebar border-end d-none d-lg-flex flex-column">
					<AdminMenu auth={auth} settings={settings} />
				</aside>
				{/* Smaller Device Sidebar */}
				<div
					className="bg-dark text-bg-dark offcanvas offcanvas-start"
					tabIndex={-1}
					id="mobileSidebar"
					aria-labelledby="mobileSidebarLabel"
				>
					<div className="offcanvas-header border-bottom">
						<h5 className="text-white offcanvas-title" id="mobileSidebarLabel">
							Menu
						</h5>
						<button
							type="button"
							className="btn-close btn-close-white"
							data-bs-dismiss="offcanvas"
							aria-label="Close"
						/>
					</div>
					<div className="offcanvas-body p-0 d-flex flex-column">
						<AdminMenu auth={auth} settings={settings} />
					</div>
				</div>
				<div className="flex-grow-1 min-vh-100">
					<main className="p-3 p-md-4">
						<section className="py-1">{children}</section>
					</main>
				</div>
			</div>
		</Suspense>
	);
}
