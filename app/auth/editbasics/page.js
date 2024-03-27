"use client";
import { useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import Sidebar from "@/layout/auth/sidebar";
import { fetchurl } from "@/helpers/setTokenOnServer";
import Globalcontent from "@/layout/content";
import AuthContext from "@/helpers/globalContext";

const UpdateBasics = ({ params, searchParams }) => {
	const { auth } = useContext(AuthContext);
	const router = useRouter();

	// Redirec if not authenticated
	!auth.isAuthenticated && router.push("/auth/login");

	const [basicData, setBasicData] = useState({
		username: ``,
		workstatus: ``,
		secondaryEmail: ``,
		website: ``,
		facebook: ``,
		twitter: ``,
		youtube: ``,
		instagram: ``,
		linkedin: ``,
		steamId: ``,
		xboxId: ``,
	});

	const {
		username,
		workstatus,
		secondaryEmail,
		website,
		twitter,
		facebook,
		youtube,
		instagram,
		linkedin,
		steamId,
		xboxId,
	} = basicData;

	const [profile, setProfile] = useState(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(false);

	useEffect(() => {
		const fetchUser = async () => {
			try {
				const res = await fetchurl(`/auth/me`, "GET", "no-cache");
				setProfile(res?.data);
				setBasicData({
					username: res?.data?.username,
					workstatus: res?.data?.workstatus,
					secondaryEmail: res?.data?.secondaryEmail,
					website: res?.data?.website,
					facebook: res?.data?.social?.facebook,
					twitter: res?.data?.social?.twitter,
					youtube: res?.data?.social?.youtube,
					instagram: res?.data?.social?.instagram,
					linkedin: res?.data?.social?.linkedin,
					steamId: res?.data?.social?.steamId,
					xboxId: res?.data?.social?.xboxId,
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

	const upgradeBasic = async (e) => {
		e.preventDefault();
		await fetchurl(`/auth/updatebasics`, "PUT", "no-cache", basicData);
		router.push(`/auth/profile`);
	};

	const resetForm = () => {
		setBasicData({
			username: ``,
			workstatus: ``,
			secondaryEmail: ``,
			website: ``,
			facebook: ``,
			twitter: ``,
			youtube: ``,
			instagram: ``,
			linkedin: ``,
			steamId: ``,
			xboxId: ``,
		});
	};

	const [displaySocialInputs, toggleSocialInputs] = useState(false);

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
						<div className="card-header">Edit&nbsp;Basics</div>
						<div className="card-body">
							{JSON.stringify(basicData, 4, null)}
							<form onSubmit={upgradeBasic}>
								<label htmlFor="username" className="form-label">
									Username
								</label>
								<input
									id="username"
									name="username"
									value={username}
									onChange={(e) => {
										setBasicData({
											...basicData,
											username: e.target.value,
										});
									}}
									type="text"
									className="form-control mb-3"
									placeholder={`${profile.username}`}
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
								/>
								<label htmlFor="secondaryEmail" className="form-label">
									Secondary&nbsp;Email
								</label>
								<input
									id="secondaryEmail"
									name="secondaryEmail"
									value={secondaryEmail}
									onChange={(e) => {
										setBasicData({
											...basicData,
											secondaryEmail: e.target.value,
										});
									}}
									type="email"
									className="form-control mb-3"
									placeholder={`${profile.secondaryEmail}`}
								/>
								<label htmlFor="workstatus" className="form-label">
									Work&nbsp;Status
								</label>
								<input
									id="workstatus"
									name="workstatus"
									value={workstatus}
									onChange={(e) => {
										setBasicData({
											...basicData,
											workstatus: e.target.value,
										});
									}}
									type="text"
									className="form-control mb-3"
									placeholder={`${profile.workstatus}`}
								/>
								<label htmlFor="website" className="form-label">
									Website
								</label>
								<input
									id="website"
									name="website"
									value={website}
									onChange={(e) => {
										setBasicData({
											...basicData,
											website: e.target.value,
										});
									}}
									type="text"
									className="form-control mb-3"
									placeholder={`${profile.website}`}
								/>
								<button
									type="button"
									className="btn btn-secondary btn-sm w-100 mb-4"
									onClick={toggleSocialInputs(!displaySocialInputs)}
								>
									Add&nbsp;Social&nbsp;Network&nbsp;Links&nbsp;-&nbsp;Optional
								</button>
								{displaySocialInputs && <>Socials</>}
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

export default UpdateBasics;
