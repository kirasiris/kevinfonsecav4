"use client";
import { useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import Sidebar from "@/layout/auth/sidebar";
import { fetchurl } from "@/helpers/setTokenOnServer";
import Globalcontent from "@/layout/content";
import AuthContext from "@/helpers/globalContext";
import MyTextArea from "@/components/global/mytextarea";

const UpdateAbout = ({ params, searchParams }) => {
	const { auth } = useContext(AuthContext);
	const router = useRouter();

	// Redirec if not authenticated
	!auth.isAuthenticated && router.push("/auth/login");

	const [profiles, setProfiles] = useState([]);

	const fetchUsers = async (params = "") => {
		try {
			const res = await fetchurl(`/users${params}`, "GET", "no-cache");
			setProfiles(res?.data);
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
				const res = await fetchurl(`/auth/me`, "GET", "no-cache");
				setProfile(res?.data);
				setAboutData({
					name: res.data.name,
					sex: res.data.sex,
					relationshipStatus: res.data.relationshipStatus,
					inRelationshipWith: res.data.inRelationshipWith,
					company: res.data.company,
					age: res.data.age,
					bio: res.data.bio,
					tags: res.data.tags,
				});
				setLoading(false);
			} catch (err) {
				console.log(err);
				setError(true);
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
		const res = await fetchurl(
			`/auth/updateabout`,
			"PUT",
			"no-cache",
			aboutData
		);
		router.push(`/auth/profile`);
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
						<div className="card-header">Edit&nbsp;About</div>
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
									placeholder={`${profile.name}`}
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
									placeholder={`${profile.sex}`}
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
													In&nbsp;Relationship&nbsp;With?
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
															(excludedUser) => excludedUser._id !== profile._id
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
									placeholder={`${profile.company}`}
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
									placeholder={`${profile.age}`}
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
									placeholder={`${profile.tags}`}
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
