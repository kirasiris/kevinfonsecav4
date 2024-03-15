import { Suspense } from "react";
import { redirect } from "next/navigation";
import Sidebar from "@/layout/auth/sidebar";
import { fetchurl } from "@/helpers/setTokenOnServer";
import Globalcontent from "@/layout/content";
import Loading from "@/app/blog/loading";

async function getAuthenticatedUser() {
	const res = await fetchurl(`http://localhost:5000/api/v1/auth/me`);
	return res.json();
}

const AuthIndex = async ({ params, searchParams }) => {
	const auth = await getAuthenticatedUser();

	// Redirect if user is not logged in
	(auth?.error?.statusCode === 401 || !auth?.data?.isOnline) &&
		redirect(`/auth/login`);

	return (
		<Suspense fallback={<Loading />}>
			<div className="container my-4">
				<div className="row">
					<Sidebar />
					<Globalcontent>
						<div className="card">
							<div className="card-header">
								Welcome&nbsp;back,&nbsp;{auth.data.username}
							</div>
							<div className="card-body">
								<pre>
									<code>{JSON.stringify(auth.data, null, 4)}</code>
								</pre>
							</div>
						</div>
					</Globalcontent>
				</div>
			</div>
		</Suspense>
	);
};

export default AuthIndex;
