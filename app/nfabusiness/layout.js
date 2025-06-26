import "@/src/css/admin.css";
import AdminNFAMenu from "@/components/nfabusiness/nfabusinessmenu";
import { redirect } from "next/navigation";
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

	// Redirec if not founder
	auth?.data?.isOnline &&
		!auth?.data?.role?.includes("founder") &&
		redirect(`/dashboard`);

	return (
		<div className="container-fluid my-4">
			<div className="row">
				<AdminNFAMenu />
				<div className="col-lg-11">{children}</div>
			</div>
		</div>
	);
}
