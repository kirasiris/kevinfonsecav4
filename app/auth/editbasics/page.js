import { fetchurl } from "@/helpers/setTokenOnServer";
import { redirect } from "next/navigation";
import Sidebar from "@/layout/auth/sidebar";
import Globalcontent from "@/layout/content";
import FormButtons from "@/components/global/formbuttons";

async function getAuthenticatedUser() {
	const res = await fetchurl(`/auth/me`, "GET", "no-cache");
	return res;
}

const UpdateBasics = async ({ params, searchParams }) => {
	const auth = await getAuthenticatedUser();

	// Redirect if user is not logged in
	(auth?.error?.statusCode === 401 || !auth?.data?.isOnline) &&
		redirect(`/auth/login`);

	const upgradeBasic = async (formData) => {
		"use server";
		const rawFormData = {
			username: formData.get("username"),
			workstatus: formData.get("workstatus"),
			secondaryEmail: formData.get("secondaryEmail"),
			website: formData.get("website"),
			facebook: formData.get("facebook"),
			twitter: formData.get("twitter"),
			youtube: formData.get("youtube"),
			instagram: formData.get("instagram"),
			linkedin: formData.get("linkedin"),
			steamId: formData.get("steamId"),
			xboxId: formData.get("xboxId"),
		};
		await fetchurl(`/auth/updatebasics`, "PUT", "no-cache", rawFormData);
		redirect(`/auth/profile`);
	};

	return (
		<div className="container my-4">
			<div className="row">
				<Sidebar />
				<Globalcontent>
					<div className="card">
						<div className="card-header">Edit&nbsp;Basics</div>
						<div className="card-body">
							<form action={upgradeBasic}>
								<label htmlFor="username" className="form-label">
									Username
								</label>
								<input
									id="username"
									name="username"
									type="text"
									className="form-control mb-3"
									placeholder="john.doe"
									defaultValue={auth?.data?.username}
								/>
								<label htmlFor="email" className="form-label">
									Email
								</label>
								<input
									id="email"
									name="email"
									type="email"
									className="form-control mb-3"
									disabled
									placeholder="john.doe@demo.com"
									defaultValue={auth?.data?.email}
								/>
								<label htmlFor="secondaryEmail" className="form-label">
									Secondary&nbsp;Email
								</label>
								<input
									id="secondaryEmail"
									name="secondaryEmail"
									type="email"
									className="form-control mb-3"
									placeholder="john.doe2@demo.com"
									defaultValue={auth?.data?.secondaryEmail}
								/>
								<label htmlFor="workstatus" className="form-label">
									Work&nbsp;Status
								</label>
								<select
									id="workstatus"
									name="workstatus"
									className="form-control mb-3"
									defaultValue={auth?.data?.workstatus}
								>
									<option value="nini">Nini</option>
									<option value="student">Student</option>
									<option value="unemployed">Unemployed</option>
									<option value="employed">Employed</option>
								</select>
								<label htmlFor="website" className="form-label">
									Website
								</label>
								<input
									id="website"
									name="website"
									type="text"
									className="form-control mb-3"
									placeholder="https://demo.com"
									defaultValue={auth?.data?.website}
								/>
								<h6 className="display-6 text-center text-decoration-underline">
									Socials
								</h6>
								<div className="row">
									<div className="col">
										<label htmlFor="facebook" className="form-label">
											Facebook
										</label>
										<input
											id="facebook"
											name="facebook"
											type="text"
											className="form-control mb-3"
											placeholder="https://facebook.com"
											defaultValue={auth?.data?.social?.facebook}
										/>
									</div>
									<div className="col">
										<label htmlFor="twitter" className="form-label">
											Twitter
										</label>
										<input
											id="twitter"
											name="twitter"
											type="text"
											className="form-control mb-3"
											placeholder="https://x.com/john.doe"
											defaultValue={auth?.data?.social?.twitter}
										/>
									</div>
									<div className="col">
										<label htmlFor="youtube" className="form-label">
											YouTube
										</label>
										<input
											id="youtube"
											name="youtube"
											type="text"
											className="form-control mb-3"
											placeholder="https://youtube.com/channel/john.doe"
											defaultValue={auth?.data?.social?.youtube}
										/>
									</div>
								</div>
								<div className="row">
									<div className="col">
										<label htmlFor="instagram" className="form-label">
											Instagram
										</label>
										<input
											id="instagram"
											name="instagram"
											type="text"
											className="form-control mb-3"
											placeholder="https://instagram.com/john.doe"
											defaultValue={auth?.data?.social?.instagram}
										/>
									</div>
									<div className="col">
										<label htmlFor="linkedin" className="form-label">
											LinkedIn
										</label>
										<input
											id="linkedin"
											name="linkedin"
											type="text"
											className="form-control mb-3"
											placeholder="https://www.linkedin.com/in/john-doe-12345678a/"
											defaultValue={auth?.data?.social?.linkedin}
										/>
									</div>
								</div>
								<div className="row">
									<div className="col">
										<label htmlFor="steamId" className="form-label">
											Steam Id
										</label>
										<input
											id="steamId"
											name="steamId"
											type="text"
											className="form-control mb-3"
											placeholder="https://www.steam.com"
											defaultValue={auth?.data?.social?.steamId}
										/>
									</div>
									<div className="col">
										<label htmlFor="xboxId" className="form-label">
											Xbox Id
										</label>
										<input
											id="xboxId"
											name="xboxId"
											type="text"
											className="form-control mb-3"
											placeholder="https://account.xbox.com/en-us/Profile?csrf=ID"
											defaultValue={auth?.data?.social?.xboxId}
										/>
									</div>
								</div>
								<FormButtons />
							</form>
						</div>
					</div>
				</Globalcontent>
			</div>
		</div>
	);
};

export default UpdateBasics;
