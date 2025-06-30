import { redirect } from "next/navigation";
import Link from "next/link";
import { fetchurl } from "@/helpers/setTokenOnServer";
import Sidebar from "@/layout/auth/sidebar";
import Globalcontent from "@/layout/content";
import UploadPictureForm from "@/forms/auth/uploadpictureform";

async function getAuthenticatedUser() {
	const res = await fetchurl(`/auth/me`, "GET", "no-cache");
	return res;
}

const UploadPicture = async ({ params, searchParams }) => {
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
								<p className="m-1">Take&nbsp;a&nbsp;Picture</p>
							</div>
							<div className="float-end">
								<div className="btn-group">
									<Link
										href="/auth/editavatar"
										className="btn btn-secondary btn-sm"
									>
										Update avatar
									</Link>
									<Link
										href="/auth/editcover"
										className="btn btn-secondary btn-sm"
									>
										Update cover
									</Link>
								</div>
							</div>
						</div>
						<UploadPictureForm auth={auth} />
					</div>
				</Globalcontent>
			</div>
		</div>
	);
};

export default UploadPicture;
