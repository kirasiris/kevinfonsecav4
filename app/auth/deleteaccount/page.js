import { fetchurl } from "@/helpers/setTokenOnServer";
import { redirect } from "next/navigation";
import Sidebar from "@/layout/auth/sidebar";
import Globalcontent from "@/layout/content";
import FormButtons from "@/components/global/formbuttons";

async function getAuthenticatedUser() {
	const res = await fetchurl(`/auth/me`, "GET", "no-cache");
	return res;
}

const UpdateDeleteAccount = async ({ params, searchParams }) => {
	const auth = await getAuthenticatedUser();

	// Redirect if user is not logged in
	(auth?.error?.statusCode === 401 || !auth?.data?.isOnline) &&
		redirect(`/auth/login`);

	const deleteMyAccount = async (formData) => {
		"use server";
		const rawFormData = {
			email: formData.get("email"),
			token: formData.get("token"),
		};
		await fetchurl(`/auth/deleteaccount`, "POST", "no-cache", rawFormData);
		redirect(`/auth/login`);
	};

	return (
		<div className="container my-4">
			<div className="row">
				<Sidebar />
				<Globalcontent>
					<div className="card">
						<div className="card-header text-bg-danger text-uppercase">
							THIS&nbsp;CAN&nbsp;NOT&nbsp;BE&nbsp;UNDONE!
						</div>
						<div className="card-body">
							<form action={deleteMyAccount}>
								<label htmlFor="email" className="form-label">
									Please&nbsp;enter&nbsp;your&nbsp;email&nbsp;as&nbsp;shown&nbsp;in&nbsp;the&nbsp;placeholder!
								</label>
								<input
									id="email"
									name="email"
									type="email"
									className="form-control mb-3"
									placeholder={`${auth.data.email}`}
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
						<div className="card-footer text-bg-danger text-uppercase">
							If&nbsp;for&nbsp;some&nbsp;reason&nbsp;the&nbsp;email&nbsp;shown&nbsp;above&nbsp;does&nbsp;not&nbsp;match&nbsp;with&nbsp;yours,&nbsp;please&nbsp;close&nbsp;the&nbsp;session&nbsp;and&nbsp;exit&nbsp;this&nbsp;webpage
						</div>
					</div>
				</Globalcontent>
			</div>
		</div>
	);
};

export default UpdateDeleteAccount;
