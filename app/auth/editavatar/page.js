import { fetchurl } from "@/helpers/setTokenOnServer";
import { redirect } from "next/navigation";
import Sidebar from "@/layout/auth/sidebar";
import Globalcontent from "@/layout/content";
import Link from "next/link";
import Form from "./form";

async function getAuthenticatedUser() {
	const res = await fetchurl(`/auth/me`, "GET", "no-cache");
	return res;
}

const UpdateAvatar = async ({ params, searchParams }) => {
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
								<p className="m-1">Edit&nbsp;Avatar</p>
							</div>
							<div className="float-end">
								<div className="btn-group">
									<Link href="/auth/uploadpicture" passHref legacyBehavior>
										<a className="btn btn-secondary btn-sm">Take a picture</a>
									</Link>
									<Link href="/auth/editcover" passHref legacyBehavior>
										<a className="btn btn-secondary btn-sm">Update cover</a>
									</Link>
								</div>
							</div>
						</div>
						<Form auth={auth} />
					</div>
				</Globalcontent>
			</div>
		</div>
	);
};

export default UpdateAvatar;
