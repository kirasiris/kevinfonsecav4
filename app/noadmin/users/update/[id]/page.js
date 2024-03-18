"use client";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import Image from "next/image";
import { Modal } from "react-bootstrap";
import AdminMediaLibray from "@/components/admin/adminmedialibray";
import MyTextArea from "@/components/global/mytextarea";
import AuthContext from "@/helpers/globalContext";

const UpdateUser = () => {
	const { auth, files, setFiles } = useContext(AuthContext);
	const router = useRouter();

	// Redirec if not founder
	auth.isAuthenticated &&
		!auth.user.role.includes("founder") &&
		router.push("/dashboard");

	const [users, setUsers] = useState([]);

	const fetchUsers = async (params = "") => {
		try {
			const res = await axios.get(`/users${params}`);
			setUsers(res?.data?.data);
		} catch (err) {
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

	const [userData, setUserData] = useState({
		username: ``,
		avatar: files?.selected?._id,
		name: "",
		email: "",
		secondaryEmail: "",
		phoneNumber: "012-345-6789",
		password: "",
		password2: "",
		isEmailConfirmed: true,
		role: ["subscriber"],
		sex: "Straight",
		gender: "non-binary",
		age: "18",
		relationshipStatus: "single",
		inRelationshipWith: undefined,
		company: "",
		workstatus: ["nini"],
		bio: "No biography",
		website: "",
		twitter: "",
		facebook: "",
		youtube: "",
		instagram: "",
		linkedin: "",
		steamId: "",
		xboxId: "",
	});
	const {
		username,
		avatar,
		name,
		email,
		secondaryEmail,
		phoneNumber,
		password,
		password2,
		isEmailConfirmed,
		role,
		sex,
		gender,
		age,
		relationshipStatus,
		inRelationshipWith,
		company,
		workstatus,
		bio,
		website,
		twitter,
		facebook,
		youtube,
		instagram,
		linkedin,
		steamId,
		xboxId,
	} = userData;

	const [user, setUser] = useState(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(false);

	const { id } = useParams();
	const userId = id;

	useEffect(() => {
		const fetchUser = async () => {
			try {
				const res = await axios.get(`/users/${userId}`);
				setUser(res?.data?.data);
				setUserData({
					username: res?.data?.data?.username,
					avatar: res?.data?.data?.files?.avatar,
					name: res?.data?.data?.name,
					email: res?.data?.data?.email,
					secondaryEmail: res?.data?.data?.secondaryEmail,
					phoneNumber: res?.data?.data?.phoneNumber,
					password: res?.data?.data?.password,
					password2: res?.data?.data?.password,
					isEmailConfirmed: res?.data?.data?.isEmailConfirmed,
					role: res?.data?.data?.role,
					sex: res?.data?.data?.sex,
					gender: res?.data?.data?.gender,
					age: res?.data?.data?.age,
					relationshipStatus: res?.data?.data?.relationshipStatus,
					inRelationshipWith: res?.data?.data?.inRelationshipWith,
					company: res?.data?.data?.company,
					workstatus: res?.data?.data?.workstatus,
					bio: res?.data?.data?.bio,
					website: res?.data?.data?.website,
					twitter: res?.data?.data?.social?.twitter,
					facebook: res?.data?.data?.social?.facebook,
					youtube: res?.data?.data?.social?.youtube,
					instagram: res?.data?.data?.social?.instagram,
					linkedin: res?.data?.data?.social?.linkedin,
					steamId: res?.data?.data?.social?.steamId,
					xboxId: res?.data?.data?.social?.xboxId,
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
	}, [userId]);

	const upgradeUser = async (e) => {
		e.preventDefault();
		try {
			await axios.put(`/users/${user._id}`, {
				...userData,
				files: { avatar: files?.selected?._id },
			});
			toast.success(`Item updated`);
			// router.push(`/noadmin/users`);
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
			return { msg: err?.response?.statusText, status: err?.response?.status };
		}
	};

	const resetForm = () => {
		setUserData({
			username: ``,
			avatar: files?.selected?._id,
			name: "",
			email: "",
			secondaryEmail: "",
			phoneNumber: "012-345-6789",
			password: "",
			password2: "",
			isEmailConfirmed: true,
			role: ["subscriber"],
			sex: "Straight",
			gender: "non-binary",
			age: "18",
			relationshipStatus: "single",
			inRelationshipWith: undefined,
			company: "",
			workstatus: ["nini"],
			bio: "No biography",
			website: "",
			twitter: "",
			facebook: "",
			youtube: "",
			instagram: "",
			linkedin: "",
			steamId: "",
			xboxId: "",
		});
	};

	return loading || user === null || user === undefined ? (
		error ? (
			<>Not found</>
		) : (
			<>Loading... {console.log(error)}</>
		)
	) : (
		<>
			<form onSubmit={upgradeUser}>
				<div className="row">
					<div className="col-lg-3">
						<div className="d-grid gap-2">
							<button
								type="button"
								className="btn btn-secondary btn-sm btn-block"
								onClick={() => setFiles({ ...files, showMediaModal: true })}
							>
								Featured Image
							</button>
							<Image
								src={
									files?.selected?.location?.secure_location ||
									avatar?.location?.secure_location ||
									"https://static.vecteezy.com/system/resources/previews/005/337/799/original/icon-image-not-found-free-vector.jpg"
								}
								alt="xD"
								width="558"
								height="558"
								style={{ maxWidth: "100%", maxHeight: "1920px" }}
								onClick={() => setFiles({ ...files, showMediaModal: true })}
								priority={true}
							/>
						</div>
					</div>
					<div className="col">
						<div className="col">
							<label htmlFor="username" className="form-label">
								Username
							</label>
							<input
								id="username"
								name="username"
								value={username}
								onChange={(e) => {
									setUserData({
										...userData,
										username: e.target.value,
									});
								}}
								type="text"
								className="form-control mb-3"
								placeholder="john.doe"
							/>
						</div>
						<div className="col">
							<label htmlFor="name" className="form-label">
								Name
							</label>
							<input
								id="name"
								name="name"
								value={name}
								onChange={(e) => {
									setUserData({
										...userData,
										name: e.target.value,
									});
								}}
								type="text"
								className="form-control mb-3"
								placeholder="John Doe"
							/>
						</div>
						<div className="row">
							<div className="col">
								<label htmlFor="email" className="form-label">
									Email
								</label>
								<input
									id="email"
									name="email"
									value={email}
									onChange={(e) => {
										setUserData({
											...userData,
											email: e.target.value,
										});
									}}
									type="email"
									className="form-control mb-3"
									placeholder="john@doe.com"
								/>
							</div>
							<div className="col">
								<label htmlFor="secondaryEmail" className="form-label">
									Secondary Email
								</label>
								<input
									id="secondaryEmail"
									name="secondaryEmail"
									value={secondaryEmail}
									onChange={(e) => {
										setUserData({
											...userData,
											secondaryEmail: e.target.value,
										});
									}}
									type="email"
									className="form-control mb-3"
									placeholder="john@doe.com"
								/>
							</div>
						</div>
						<label htmlFor="phoneNumber" className="form-label">
							Phone Number
						</label>
						<input
							id="phoneNumber"
							name="phoneNumber"
							value={phoneNumber}
							onChange={(e) => {
								setUserData({
									...userData,
									phoneNumber: e.target.value,
								});
							}}
							type="tel"
							className="form-control mb-3"
							placeholder="012-345-6789"
						/>
						<div className="row">
							<div className="col">
								<label htmlFor="password" className="form-label">
									Password
								</label>
								<input
									id="password"
									name="password"
									value={password}
									onChange={(e) => {
										setUserData({
											...userData,
											password: e.target.value,
										});
									}}
									type="password"
									className="form-control mb-3"
									placeholder="******"
								/>
							</div>
							<div className="col">
								<label htmlFor="password2" className="form-label">
									Confirm Password?
								</label>
								<input
									id="password2"
									name="password2"
									value={password2}
									onChange={(e) => {
										setUserData({
											...userData,
											password2: e.target.value,
										});
									}}
									type="password"
									className="form-control mb-3"
									placeholder="******"
								/>
							</div>
						</div>
						<label htmlFor="isEmailConfirmed" className="form-label">
							Activate Account?
						</label>
						<select
							id="isEmailConfirmed"
							name="isEmailConfirmed"
							value={isEmailConfirmed}
							onChange={(e) => {
								setUserData({
									...userData,
									isEmailConfirmed: e.target.value,
								});
							}}
							className="form-control"
						>
							<option value={true}>Yes</option>
							<option value={false}>No</option>
						</select>
					</div>
					<div className="row">
						<div className="col">
							<label htmlFor="role" className="form-label">
								Role
							</label>
							<select
								id="role"
								name="role"
								value={role}
								onChange={(e) => {
									const selectedOptions = Array.from(
										e.target.selectedOptions
									).map((option) => option.value);
									setUserData({
										...userData,
										role: selectedOptions,
									});
								}}
								className="form-control"
								multiple
							>
								<option value={`founder`}>Founder</option>
								<option value={`editor`}>Editor</option>
								<option value={`author`}>Author</option>
								<option value={`contributor`}>Contributor</option>
								<option value={`subscriber`}>Subscriber</option>
								<option value={`banned`}>Banned</option>
								<option value={`suspended`}>Suspended</option>
								<option value={`realtor`}>Realtor</option>
								<option value={`renter`}>Renter</option>
								<option value={`house-seller`}>House Seller</option>
								<option value={`car-owner`}>Car Owner</option>
								<option value={`teacher`}>Teacher</option>
								<option value={`student`}>Student</option>
								<option value={`producer`}>Producer</option>
							</select>
						</div>
						<div className="col">
							<label htmlFor="sex" className="form-label">
								Sex
							</label>
							<input
								id="sex"
								name="sex"
								value={sex}
								onChange={(e) => {
									setUserData({
										...userData,
										sex: e.target.value,
									});
								}}
								type="text"
								className="form-control mb-3"
								placeholder="Straight"
							/>
						</div>
						<div className="col">
							<label htmlFor="gender" className="form-label">
								Gender
							</label>
							<select
								id="gender"
								name="gender"
								value={gender}
								onChange={(e) => {
									setUserData({
										...userData,
										gender: e.target.value,
									});
								}}
								className="form-control"
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
						</div>
					</div>
					<div className="row">
						<div className="col">
							<label htmlFor="age" className="form-label">
								Age
							</label>
							<input
								id="age"
								name="age"
								value={age}
								onChange={(e) => {
									const inputValue = e.target.value;
									if (/^\d+$/.test(inputValue) && parseInt(inputValue) >= 18) {
										setUserData({
											...userData,
											age: inputValue,
										});
									}
								}}
								type="number"
								className="form-control mb-3"
								placeholder="18"
								min={18}
								max={99}
							/>
						</div>
					</div>
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
									setUserData({
										...userData,
										relationshipStatus: e.target.value,
									});
								}}
								className="form-control"
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
							relationshipStatus !== null && (
								<div className="col">
									<label htmlFor="inRelationshipWith" className="form-label">
										In Relationship With?
									</label>
									<select
										id="inRelationshipWith"
										name="inRelationshipWith"
										value={inRelationshipWith}
										onChange={(e) => {
											setUserData({
												...userData,
												inRelationshipWith: e.target.value,
											});
										}}
										className="form-control"
									>
										{users
											.filter(
												(excludedUser) => excludedUser._id !== auth.user._id
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
					<div className="row">
						<div className="col">
							<label htmlFor="company" className="form-label">
								Company
							</label>
							<input
								id="company"
								name="company"
								value={company}
								onChange={(e) => {
									setUserData({
										...userData,
										company: e.target.value,
									});
								}}
								type="text"
								className="form-control mb-3"
								placeholder="beFree"
							/>
						</div>
						<div className="col">
							<label htmlFor="workstatus" className="form-label">
								Work Status
							</label>
							<select
								id="workstatus"
								name="workstatus"
								value={workstatus}
								onChange={(e) => {
									setUserData({
										...userData,
										workstatus: e.target.value,
									});
								}}
								className="form-control"
							>
								<option value={`nini`}>Nini</option>
								<option value={`actor`}>Actor</option>
								<option value={`actress`}>Actress</option>
								<option value={`unemployed`}>Unemployed</option>
							</select>
						</div>
					</div>
					<div className="row">
						<div className="col">
							<label htmlFor="text" className="form-label">
								Biography
							</label>
							<MyTextArea
								id="text"
								name="text"
								value={bio}
								objectData={userData}
								setObjectData={setUserData}
								onModel="User"
								advancedTextEditor={false}
							/>
						</div>
					</div>
					<div className="row">
						<div className="col">
							<label htmlFor="website" className="form-label">
								Website
							</label>
							<input
								id="website"
								name="website"
								value={website}
								onChange={(e) => {
									setUserData({
										...userData,
										website: e.target.value,
									});
								}}
								type="text"
								className="form-control mb-3"
								placeholder="https://demo.com/"
							/>
						</div>
						<div className="col">
							<label htmlFor="twitter" className="form-label">
								Twitter
							</label>
							<input
								id="twitter"
								name="twitter"
								value={twitter}
								onChange={(e) => {
									setUserData({
										...userData,
										twitter: e.target.value,
									});
								}}
								type="text"
								className="form-control mb-3"
								placeholder="https://demo.com/"
							/>
						</div>
						<div className="col">
							<label htmlFor="facebook" className="form-label">
								Facebook
							</label>
							<input
								id="facebook"
								name="facebook"
								value={facebook}
								onChange={(e) => {
									setUserData({
										...userData,
										facebook: e.target.value,
									});
								}}
								type="text"
								className="form-control mb-3"
								placeholder="https://demo.com/"
							/>
						</div>
						<div className="col">
							<label htmlFor="youtube" className="form-label">
								YouTube
							</label>
							<input
								id="youtube"
								name="youtube"
								value={youtube}
								onChange={(e) => {
									setUserData({
										...userData,
										youtube: e.target.value,
									});
								}}
								type="text"
								className="form-control mb-3"
								placeholder="https://demo.com/"
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
								value={instagram}
								onChange={(e) => {
									setUserData({
										...userData,
										instagram: e.target.value,
									});
								}}
								type="text"
								className="form-control mb-3"
								placeholder="https://demo.com/"
							/>
						</div>
						<div className="col">
							<label htmlFor="linkedin" className="form-label">
								Linkedin
							</label>
							<input
								id="linkedin"
								name="linkedin"
								value={linkedin}
								onChange={(e) => {
									setUserData({
										...userData,
										linkedin: e.target.value,
									});
								}}
								type="text"
								className="form-control mb-3"
								placeholder="https://demo.com/"
							/>
						</div>
						<div className="col">
							<label htmlFor="steamId" className="form-label">
								Steam Id
							</label>
							<input
								id="steamId"
								name="steamId"
								value={steamId}
								onChange={(e) => {
									setUserData({
										...userData,
										steamId: e.target.value,
									});
								}}
								type="text"
								className="form-control mb-3"
								placeholder="https://demo.com/"
							/>
						</div>
						<div className="col">
							<label htmlFor="xboxId" className="form-label">
								Xbox Id
							</label>
							<input
								id="xboxId"
								name="xboxId"
								value={xboxId}
								onChange={(e) => {
									setUserData({
										...userData,
										xboxId: e.target.value,
									});
								}}
								type="text"
								className="form-control mb-3"
								placeholder="https://demo.com/"
							/>
						</div>
					</div>
				</div>
				<button
					type="submit"
					className="btn btn-secondary btn-sm float-start"
					disabled={username.length > 0 && email.length > 0 ? !true : !false}
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
			{/* HERE GOES THE MODAL TO OPEN GALLERY */}
			<Modal
				show={files.showMediaModal}
				onHide={() => {
					setFiles({ ...files, showMediaModal: false });
				}}
				backdrop={true}
				animation={true}
				fullscreen={true}
			>
				<Modal.Header closeButton>
					<Modal.Title>Media Library</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<AdminMediaLibray multipleFiles={false} onModel={"User"} />
				</Modal.Body>
				<Modal.Footer>
					<button
						className="btn btn-secondary btn-sm"
						onClick={() => {
							setFiles({ ...files, showMediaModal: false });
						}}
					>
						Close
					</button>
					<button
						className="btn btn-primary btn-sm"
						type="submit"
						onClick={() => {
							setFiles({ ...files, showMediaModal: false });
						}}
					>
						Submit
					</button>
				</Modal.Footer>
			</Modal>
		</>
	);
};

export default UpdateUser;
