import { fetchurl } from "@/helpers/setTokenOnServer";
import { redirect } from "next/navigation";
import Sidebar from "@/layout/auth/sidebar";
import Globalcontent from "@/layout/content";
import FormButtons from "@/components/global/formbuttons";

async function getAuthenticatedUser() {
	const res = await fetchurl(`/auth/me`, "GET", "no-cache");
	return res;
}

const UpdatePasswords = async ({ params, searchParams }) => {
	const auth = await getAuthenticatedUser();

	// Redirect if user is not logged in
	(auth?.error?.statusCode === 401 || !auth?.data?.isOnline) &&
		redirect(`/auth/login`);

	const upgradePassword = async (formData) => {
		"use server";
		const rawFormData = {
			currentpassword: formData.get("currentpassword"),
			newpassword: formData.get("newpassword"),
			newpassword2: formData.get("newpassword2"),
			token: formData.get("token"),
		};
		await fetchurl(`/auth/updatepassword`, "PUT", "no-cache", {
			...rawFormData,
			website: "beFree",
		});
		redirect(`/auth/profile`);
	};

	return (
		<div className="container my-4">
			<div className="row">
				<Sidebar />
				<Globalcontent>
					<div className="card">
						<div className="card-header">Edit&nbsp;Password</div>
						<div className="card-body">
							<form action={upgradePassword}>
								<label htmlFor="currentpassword" className="form-label">
									Current&nbsp;Password
								</label>
								<input
									id="currentpassword"
									name="currentpassword"
									type="password"
									className="form-control mb-3"
								/>
								<label htmlFor="newpassword" className="form-label">
									New&nbsp;Password
								</label>
								<input
									id="newpassword"
									name="newpassword"
									type="password"
									className="form-control mb-3"
								/>
								<label htmlFor="newpassword2" className="form-label">
									Confirm&nbsp;Password
								</label>
								<input
									id="newpassword2"
									name="newpassword2"
									type="password"
									className="form-control mb-3"
								/>
								{auth.data.twoFactorTokenEnabled && (
									<div className="form-group">
										<label htmlFor="token" className="form-label">
											Token
										</label>
										<div className="input-group">
											<input
												id="token"
												name="token"
												type="text"
												className="form-control mb-3"
												placeholder="012 345"
												required
											/>
										</div>
									</div>
								)}
								<FormButtons />
							</form>
						</div>
					</div>
				</Globalcontent>
			</div>
		</div>
	);
};

export default UpdatePasswords;
