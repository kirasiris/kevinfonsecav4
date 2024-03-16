import { redirect } from "next/navigation";
import { fetchurl } from "@/helpers/setTokenOnServer";
import Header from "@/layout/header";
// HERE GOES THE LIST OF WHATEVER

const DashboardIndex = async ({ params, searchParams }) => {
	async function getAuthenticatedUser() {
		const res = await fetchurl(`/auth/me`, "GET", "no-cache");
		return res.json();
	}

	const auth = await getAuthenticatedUser();

	// Redirect if user is not loggedIn
	(auth?.error?.statusCode === 401 || !auth?.data?.isOnline) &&
		redirect(`/auth/login?returnpage=/dashboard`);

	return (
		<>
			<Header
				title={`Welcome back,${auth.data.username}`}
				description="This is the place where you have full overview of everything you have done in the website!"
			/>
		</>
	);
};

export default DashboardIndex;
