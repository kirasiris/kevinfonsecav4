import { fetchurl } from "@/helpers/setTokenOnServer";
import { redirect } from "next/navigation";
import Sidebar from "@/layout/auth/sidebar";
import Globalcontent from "@/layout/content";
import MyTextArea from "@/components/global/myfinaltextarea";
import FormButtons from "@/components/global/formbuttons";

async function getAuthenticatedUser() {
	const res = await fetchurl(`/auth/me`, "GET", "no-cache");
	return res;
}

async function getProfiles(params) {
	const res = await fetchurl(`/users${params}`, "GET", "no-cache");
	return res;
}

const UpdateAbout = async ({ params, searchParams }) => {
	const auth = await getAuthenticatedUser();

	// Redirect if user is not logged in
	(auth?.error?.statusCode === 401 || !auth?.data?.isOnline) &&
		redirect(`/auth/login`);

	const getProfilesData = getProfiles(`?isEmailConfirmed=true`);

	const [profiles] = await Promise.all([getProfilesData]);

	const upgradeAbout = async (formData) => {
		"use server";
		const rawFormData = {
			name: formData.get("name"),
			sex: formData.get("sex"),
			gender: formData.get("gender"),
			relationshipStatus: formData.get("relationshipStatus"),
			inRelationshipWith: formData.get("inRelationshipWith"),
			company: formData.get("company"),
			age: formData.get("age"),
			text: formData.get("text"),
			tags: formData.get("tags"),
		};
		await fetchurl(`/auth/updateabout`, "PUT", "no-cache", rawFormData);
		redirect(`/auth/profile`);
	};

	return (
		<div className="container my-4">
			<div className="row">
				<Sidebar />
				<Globalcontent>
					<div className="card">
						<div className="card-header">Edit&nbsp;About</div>
						<div className="card-body">
							<form action={upgradeAbout}>
								<label htmlFor="name" className="form-label">
									Name
								</label>
								<input
									id="name"
									name="name"
									type="text"
									className="form-control mb-3"
									required
									placeholder="John Doe"
									defaultValue={auth?.data?.name}
								/>
								<label htmlFor="sex" className="form-label">
									Sex
								</label>
								<input
									id="sex"
									name="sex"
									type="text"
									className="form-control mb-3"
									placeholder="male"
									defaultValue={auth?.data?.sex}
								/>
								<label htmlFor="gender" className="form-label">
									Gender
								</label>
								<select
									id="gender"
									name="gender"
									className="form-control mb-3"
									defaultValue={auth?.data?.gender}
								>
									<option value={`non-binary`}>Non&nbsp;binary</option>
									<option value={`intersex`}>Intersex</option>
									<option value={`gender-variance`}>
										Gender&nbsp;variance
									</option>
									<option value={`male`}>Male</option>
									<option value={`butch`}>Butch</option>
									<option value={`transgender`}>Transgender</option>
									<option value={`agender`}>Agender</option>
									<option value={`pangender`}>Pangender</option>
									<option value={`demigender`}>Demigender</option>
									<option value={`female`}>Cis&nbsp;woman</option>
									<option value={`cisgender`}>Cis&nbsp;gender</option>
									<option value={`bigender`}>Bi&nbsp;gender</option>
									<option value={`androgyne`}>Androgyne</option>
									<option value={`trigender`}>Trigender</option>
									<option value={`neutral`}>Neutral</option>
								</select>
								<div className="row">
									<div className="col">
										<label htmlFor="relationshipStatus" className="form-label">
											Relationship&nbsp;Status
										</label>
										<select
											id="relationshipStatus"
											name="relationshipStatus"
											className="form-control mb-3"
											defaultValue={auth?.data?.relationshipStatus}
										>
											<option value={`single`}>Single</option>
											<option value={`taken`}>Taken</option>
											<option value={`complicated`}>Complicated</option>
											<option value={`widowed`}>Widowed</option>
											<option value={`divorced`}>Divorced</option>
										</select>
									</div>
									{auth.data.relationshipStatus !== "" &&
										auth.data.relationshipStatus !== "single" &&
										auth.data.relationshipStatus !== "widowed" &&
										auth.data.relationshipStatus !== "divorced" &&
										auth.data.relationshipStatus !== undefined &&
										auth.data.relationshipStatus !== null &&
										profiles.length >= 1 && (
											<div className="col">
												<label
													htmlFor="inRelationshipWith"
													className="form-label"
												>
													In&nbsp;Relationship&nbsp;With?
												</label>
												<select
													id="inRelationshipWith"
													name="inRelationshipWith"
													className="form-control"
													defaultValue={auth?.data?.inRelationshipWith}
												>
													{profiles
														.filter(
															(excludedUser) =>
																excludedUser._id !== auth.data._id
														)
														.map((user) => (
															<option key={user._id} value={user._id}>
																{user.username}
															</option>
														))}
												</select>
											</div>
										)}
								</div>
								<label htmlFor="company" className="form-label">
									Company
								</label>
								<input
									id="company"
									name="company"
									type="text"
									className="form-control mb-3"
									placeholder="John Doe's Business"
									defaultValue={auth?.data?.company}
								/>
								<label htmlFor="age" className="form-label">
									Age
								</label>
								<input
									id="age"
									name="age"
									type="number"
									className="form-control mb-3"
									min={18}
									max={99}
									placeholder="18"
									defaultValue={auth?.data?.age}
								/>
								<label htmlFor="bio" className="form-label">
									Bio
								</label>
								<MyTextArea
									auth={undefined}
									token={undefined}
									id="text"
									name="text"
									onModel="User"
									advancedTextEditor={false}
									customPlaceholder="Lets get to know you!"
									defaultValue={auth?.data?.bio}
								/>
								<label htmlFor="tags" className="form-label">
									Skills
								</label>
								<input
									id="tags"
									name="tags"
									type="text"
									className="form-control mb-3"
									required
									placeholder="html, css, javascript, php, etc"
									defaultValue={auth?.data?.tags}
								/>
								<FormButtons />
							</form>
						</div>
					</div>
				</Globalcontent>
			</div>
		</div>
	);
};

export default UpdateAbout;
