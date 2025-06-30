import { redirect } from "next/navigation";
import Link from "next/link";
import { fetchurl } from "@/helpers/setTokenOnServer";
import Sidebar from "@/layout/auth/sidebar";
import Globalcontent from "@/layout/content";
import UpdateCoverForm from "@/forms/auth/updatecoverform";

async function getAuthenticatedUser() {
	const res = await fetchurl(`/auth/me`, "GET", "no-cache");
	return res;
}

const UpdateCover = async ({ params, searchParams }) => {
	const auth = await getAuthenticatedUser();

	// Redirect if user is not logged in
	(auth?.error?.statusCode === 401 || !auth?.data?.isOnline) &&
		redirect(`/auth/login`);

	return (
		<div className="container my-4">
			<div className="row">
				<Sidebar />
				<Globalcontent>
					<div className="card">
						<div className="card-header">
							<div className="float-start">
								<p className="m-1">Edit&nbsp;Cover</p>
							</div>
							<div className="float-end">
								<div className="btn-group">
									<Link
										href="/auth/uploadpicture"
										className="btn btn-secondary btn-sm"
									>
										Take a picture
									</Link>
									<Link
										href="/auth/editavatar"
										className="btn btn-secondary btn-sm"
									>
										Update avatar
									</Link>
								</div>
							</div>
						</div>
						<UpdateCoverForm auth={auth} />
					</div>
				</Globalcontent>
			</div>
		</div>
	);
};

export default UpdateCover;
