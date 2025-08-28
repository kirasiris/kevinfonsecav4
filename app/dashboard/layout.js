import { redirect } from "next/navigation";
import "@/src/css/admin.css";
import AdminMenu from "@/layout/dashboard/sidebar";
import { fetchurl } from "@/helpers/setTokenOnServer";

async function getAuthenticatedUser() {
	const res = await fetchurl(`/auth/me`, "GET", "no-cache");
	return res;
}

export default async function AdminLayout({ children }) {
	const auth = await getAuthenticatedUser();

	// Redirect if user is not logged in
	(auth?.error?.statusCode === 401 || !auth?.data?.isOnline) &&
		redirect(`/auth/login`);
	return (
		<div className="container-fluid my-4">
			<div className="row">
				<AdminMenu />
				<div className="col-lg-11">{children}</div>
			</div>
		</div>
	);
}
