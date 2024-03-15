"use client";
import axios from "axios";
import { Suspense, useContext, useEffect, useState } from "react";
import { redirect, useRouter } from "next/navigation";
import { toast } from "react-toastify";
import Sidebar from "@/layout/auth/sidebar";
// import { fetchurl } from "@/helpers/setTokenOnServer";
import Globalcontent from "@/layout/content";
import Loading from "@/app/blog/loading";
import AuthContext from "@/helpers/globalContext";
import MyTextArea from "@/components/global/mytextarea";

// async function getAuthenticatedUser() {
// 	const res = await fetchurl(`http://localhost:5000/api/v1/auth/me`);
// 	return res.json();
// }

// async function getProfiles() {
// 	const res = await fetchurl(`http://localhost:5000/api/v1/users`);
// 	return res.json();
// }

const UpdateAbout = ({ params, searchParams }) => {
	// const auth = await getAuthenticatedUser();

	// // Redirect if user is not logged in
	// (auth?.error?.statusCode === 401 || !auth?.data?.isOnline) &&
	// 	redirect(`/auth/login`);

	// const getProfilesData = getProfiles(`?isEmailConfirmed=true`);

	// const [profiles] = await Promise.all([getProfilesData]);

	// async function upgradeAbout(formData) {
	// 	"use server";
	// 	const rawFormData = Object.fromEntries(formData);
	// 	const res = await fetch(`http://localhost:5000/api/v1/auth/updateabout`, {
	// 		method: "PUT",
	// 		headers: {
	// 			"Content-Type": "application/json",
	// 			Authorization: `${auth?.authorizationTokens.bearer}`,
	// 		},
	// 		body: JSON.stringify(rawFormData),
	// 	});
	// 	console.log(res);
	// 	// redirect(`/auth/profile`);
	// }

	const router = useRouter();

	const { auth } = useContext(AuthContext);

	// Redirect if user is not loggedIn
	console.log("Auth,", auth);
	// !auth.isAuthenticated && router.push(`/auth/login`);

	const [profiles, setProfiles] = useState([]);

	const fetchUsers = async (params = "") => {
		try {
			const res = await axios.get(`/users${params}`);
			setProfiles(res?.data?.data);
		} catch (err) {
			console.log(err);
			// const error = err.response.data.message;
			const error = err?.response?.data?.error?.errors;
			const errors = err?.response?.data?.errors;

			if (error) {
				// dispatch(setAlert(error, 'danger'));
				error &&
					Object.entries(error).map(([, value]) => toast.error(value.message));
			}

			if (errors) {
				errors.forEach((error) => toast.error(error.msg));
			}

			toast.error(err?.response?.statusText);
			return {
				msg: err?.response?.statusText,
				status: err?.response?.status,
			};
		}
	};

	useEffect(() => {
		fetchUsers(`?isEmailConfirmed=true`);
	}, []);

	const [aboutData, setAboutData] = useState({
		name: ``,
		sex: `Straight`,
		gender: "non-binary",
		relationshipStatus: ``,
		inRelationshipWith: ``,
		company: ``,
		age: ``,
		bio: ``,
		tags: ``,
	});

	const {
		name,
		sex,
		gender,
		relationshipStatus,
		inRelationshipWith,
		company,
		age,
		bio,
		tags,
	} = aboutData;

	const [profile, setProfile] = useState(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(false);

	useEffect(() => {
		const fetchUser = async () => {
			try {
				const res = await axios.get(`/users?_id=${auth?.user?._id}`);
				setProfile(res?.data?.data);
				setAboutData({
					name: res?.data?.data.name,
					sex: res?.data?.data.sex,
					relationshipStatus: res?.data?.data.relationshipStatus,
					inRelationshipWith: res?.data?.data.inRelationshipWith,
					company: res?.data?.data.company,
					age: res?.data?.data.age,
					bio: res?.data?.data.bio,
					tags: res?.data?.data.tags,
				});
				setLoading(false);
			} catch (err) {
				console.log(err);
				// const error = err.response.data.message;
				const error = err?.response?.data?.error?.errors;
				const errors = err?.response?.data?.errors;

				if (error) {
					// dispatch(setAlert(error, 'danger'));
					error &&
						Object.entries(error).map(([, value]) =>
							toast.error(value.message)
						);
				}

				if (errors) {
					errors.forEach((error) => toast.error(error.msg));
				}

				toast.error(err?.response?.statusText);
				return {
					msg: err?.response?.statusText,
					status: err?.response?.status,
				};
			}
		};
		fetchUser();
	}, [loading]);

	const upgradeAbout = async (e) => {
		e.preventDefault();
	};

	const resetForm = () => {
		setAboutData({
			name: ``,
			sex: `Straight`,
			gender: "non-binary",
			relationshipStatus: ``,
			inRelationshipWith: ``,
			company: ``,
			age: ``,
			bio: ``,
			tags: ``,
		});
	};

	return loading || profile === null || profile === undefined ? (
		error ? (
			<>Not found</>
		) : (
			<>Loading...</>
		)
	) : (
		<div className="container my-4">
			<div className="row">
				<Sidebar />
				<Globalcontent>
					<div className="card">
						<div className="card-header">Edit About</div>
						<div className="card-body">
							<form onSubmit={upgradeAbout}>
								<label htmlFor="name" className="form-label">
									Name
								</label>
								<input
									id="name"
									name="name"
									value={name}
									onChange={(e) => {
										setAboutData({
											...aboutData,
											name: e.target.value,
										});
									}}
									type="text"
									className="form-control mb-3"
									placeholder={`${auth.user.name}`}
								/>
								<label htmlFor="sex" className="form-label">
									Sex
								</label>
								<input
									id="sex"
									name="sex"
									value={sex}
									onChange={(e) => {
										setAboutData({
											...aboutData,
											sex: e.target.value,
										});
									}}
									type="text"
									className="form-control mb-3"
									placeholder={`${auth.user.sex}`}
								/>
								<label htmlFor="gender" className="form-label">
									Gender
								</label>
								<select
									id="gender"
									name="gender"
									value={gender}
									onChange={(e) => {
										setAboutData({
											...aboutData,
											gender: e.target.value,
										});
									}}
									className="form-control mb-3"
								>
									<option value={`non-binary`}>Non binary</option>
									<option value={`intersex`}>Intersex</option>
									<option value={`gender-variance`}>Gender variance</option>
									<option value={`male`}>Male</option>
									<option value={`butch`}>Butch</option>
									<option value={`transgender`}>Transgender</option>
									<option value={`agender`}>Agender</option>
									<option value={`pangender`}>Pangender</option>
									<option value={`demigender`}>Demigender</option>
									<option value={`female`}>Cis woman</option>
									<option value={`cisgender`}>Cis gender</option>
									<option value={`bigender`}>Bi gender</option>
									<option value={`androgyne`}>Androgyne</option>
									<option value={`trigender`}>Trigender</option>
									<option value={`neutral`}>Neutral</option>
								</select>
								<div className="row">
									<div className="col">
										<label htmlFor="relationshipStatus" className="form-label">
											Relationship Status
										</label>
										<select
											id="relationshipStatus"
											name="relationshipStatus"
											value={relationshipStatus}
											onChange={(e) => {
												setAboutData({
													...aboutData,
													relationshipStatus: e.target.value,
												});
											}}
											className="form-control mb-3"
										>
											<option value={`single`}>Single</option>
											<option value={`taken`}>Taken</option>
											<option value={`complicated`}>Complicated</option>
											<option value={`widowed`}>Widowed</option>
											<option value={`divorced`}>Divorced</option>
										</select>
									</div>
									{relationshipStatus !== "" &&
										relationshipStatus !== "single" &&
										relationshipStatus !== "widowed" &&
										relationshipStatus !== "divorced" &&
										relationshipStatus !== undefined &&
										relationshipStatus !== null &&
										profiles.length >= 1 && (
											<div className="col">
												<label
													htmlFor="inRelationshipWith"
													className="form-label"
												>
													In Relationship With?
												</label>
												<select
													id="inRelationshipWith"
													name="inRelationshipWith"
													value={inRelationshipWith}
													onChange={(e) => {
														setAboutData({
															...aboutData,
															inRelationshipWith: e.target.value,
														});
													}}
													className="form-control"
												>
													{profiles
														.filter(
															(excludedUser) =>
																excludedUser._id !== auth?.user?._id
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
									value={company}
									onChange={(e) => {
										setAboutData({
											...aboutData,
											company: e.target.value,
										});
									}}
									type="text"
									className="form-control mb-3"
									placeholder={`${auth.user.company}`}
								/>
								<label htmlFor="age" className="form-label">
									Age
								</label>
								<input
									id="age"
									name="age"
									value={age}
									onChange={(e) => {
										const inputValue = e.target.value;
										if (
											/^\d+$/.test(inputValue) &&
											parseInt(inputValue) >= 18
										) {
											setAboutData({
												...aboutData,
												age: inputValue,
											});
										}
									}}
									type="number"
									className="form-control mb-3"
									min={18}
									max={99}
									placeholder={`${auth.user.age}`}
								/>
								<label htmlFor="bio" className="form-label">
									Bio
								</label>
								<MyTextArea
									id="text"
									name="text"
									value={bio}
									objectData={aboutData}
									setObjectData={setAboutData}
									onModel="User"
									advancedTextEditor={false}
								/>
								<label htmlFor="skills" className="form-label">
									Skills
								</label>
								<input
									id="skills"
									name="skills"
									value={tags}
									onChange={(e) => {
										setAboutData({
											...aboutData,
											tags: e.target.value,
										});
									}}
									type="text"
									className="form-control mb-3"
									placeholder={`${auth.user.tags}`}
								/>
								<button
									type="submit"
									className="btn btn-secondary btn-sm float-start"
								>
									Submit
								</button>
								<button
									type="button"
									className="btn btn-secondary btn-sm float-end"
									onClick={resetForm}
								>
									Reset
								</button>
							</form>
						</div>
					</div>
				</Globalcontent>
			</div>
		</div>
	);
};

export default UpdateAbout;
