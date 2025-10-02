"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { fetchurl } from "@/helpers/setTokenOnServer";
import MyTextArea from "@/components/global/myfinaltextarea";
import FormButtons from "@/components/global/formbuttons";

const UpdateUserForm = ({ auth = {}, object = {}, objects = [] }) => {
	const router = useRouter();

	const [btnText, setBtnText] = useState(`Submit`);

	const upgradeUser = async (e) => {
		e.preventDefault();
		setBtnText("...");
		const form = e.target;
		const formData = new FormData(form);

		const rawFormData = {
			username: formData.get("username"),
			name: formData.get("name"),
			email: formData.get("email"),
			secondaryEmail: formData.get("secondaryEmail"),
			phoneNumber: formData.get("phoneNumber"),
			password: formData.get("password"),
			password2: formData.get("password2"),
			isEmailConfirmed: formData.get("isEmailConfirmed"),
			role: formData.getAll("role"),
			sex: formData.get("sex"),
			gender: formData.get("gender"),
			age: formData.get("age"),
			relationshipStatus: formData.get("relationshipStatus"),
			inRelationshipWith: formData.get("inRelationshipWith"),
			company: formData.get("company"),
			workstatus: formData.get("workstatus"),
			text: formData.get("text"),
			website: formData.get("website"),
			// files: { avatar: formData.get("file") || undefined },
			social: {
				twitter: formData.get("twitter"),
				facebook: formData.get("facebook"),
				youtube: formData.get("youtube"),
				instagram: formData.get("instagram"),
				linkedin: formData.get("linkedin"),
				steamId: formData.get("steamId"),
				xboxId: formData.get("xboxId"),
				indeed: formData.get("indeed"),
			},
			registeredFrom: process.env.NEXT_PUBLIC_NO_REPLY_EMAIL,
		};

		const res = await fetchurl(
			`/noadmin/users/${object?.data?._id}`,
			"PUT",
			"no-cache",
			rawFormData
		);

		if (res.status === "error") {
			toast.error(res.message, "bottom");
			setBtnText("Submit");
			return;
		}
		if (res.status === "fail") {
			toast.error(res.message, "bottom");
			setBtnText("Submit");
			return;
		}
		toast.success(`User updated`, "bottom");
		router.push(`/noadmin/users`);
	};

	const resetForm = (e) => {
		e.target.closest("form").reset();
	};

	return (
		<form onSubmit={upgradeUser}>
			<div className="col">
				<div className="col">
					<label htmlFor="username" className="form-label">
						Username
					</label>
					<input
						id="username"
						name="username"
						defaultValue={object?.data?.username}
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
						defaultValue={object?.data?.name}
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
							defaultValue={object?.data?.email}
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
							defaultValue={object?.data?.secondaryEmail}
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
					defaultValue={object?.data?.phoneNumber}
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
							defaultValue=""
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
							defaultValue=""
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
					defaultValue={object?.data?.isEmailConfirmed.toString()}
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
						defaultValue={object?.data?.role}
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
						defaultValue={object?.data?.sex}
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
						defaultValue={object?.data?.gender}
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
						defaultValue={object?.data?.age}
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
						defaultValue={object?.data?.relationshipStatus}
						className="form-control"
					>
						<option value={`single`}>Single</option>
						<option value={`taken`}>Taken</option>
						<option value={`complicated`}>Complicated</option>
						<option value={`widowed`}>Widowed</option>
						<option value={`divorced`}>Divorced</option>
					</select>
				</div>
				<div className="col">
					<label htmlFor="inRelationshipWith" className="form-label">
						In Relationship With?
					</label>
					<select
						id="inRelationshipWith"
						name="inRelationshipWith"
						defaultValue={object?.data?.inRelationshipWith}
						className="form-control"
					>
						{objects.data
							.filter((excludedUser) => excludedUser._id !== auth?.id)
							.map((user) => (
								<option key={user._id} value={user._id}>
									{user.username}
								</option>
							))}
					</select>
				</div>
			</div>
			<div className="row">
				<div className="col">
					<label htmlFor="company" className="form-label">
						Company
					</label>
					<input
						id="company"
						name="company"
						defaultValue={object?.data?.company}
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
						defaultValue={object?.data?.workstatus}
						className="form-control"
					>
						<option value={`nini`}>Nini</option>
						<option value={`student`}>Student</option>
						<option value={`unemployed`}>Unemployed</option>
						<option value={`employed`}>Employed</option>
					</select>
				</div>
			</div>
			<div className="row">
				<div className="col">
					<label htmlFor="text" className="form-label">
						Biography
					</label>
					<MyTextArea
						auth={undefined}
						token={undefined}
						id="text"
						name="text"
						defaultValue={object?.data?.bio}
						onModel="User"
						advancedTextEditor={false}
						customPlaceholder="No description"
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
						defaultValue={object?.data?.website}
						type="text"
						className="form-control mb-3"
						placeholder="https://demo.com"
					/>
				</div>
				<div className="col">
					<label htmlFor="facebook" className="form-label">
						Facebook
					</label>
					<input
						id="facebook"
						name="facebook"
						defaultValue={object?.data?.social?.facebook}
						type="text"
						className="form-control mb-3"
						placeholder="https://facebook.com"
					/>
				</div>
				<div className="col">
					<label htmlFor="twitter" className="form-label">
						Twitter
					</label>
					<input
						id="twitter"
						name="twitter"
						defaultValue={object?.data?.social?.twitter}
						type="text"
						className="form-control mb-3"
						placeholder="https://x.com/john.doe"
					/>
				</div>
				<div className="col">
					<label htmlFor="youtube" className="form-label">
						YouTube
					</label>
					<input
						id="youtube"
						name="youtube"
						defaultValue={object?.data?.social?.youtube}
						type="text"
						className="form-control mb-3"
						placeholder="https://youtube.com/channel/john.doe"
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
						defaultValue={object?.data?.social?.instagram}
						type="text"
						className="form-control mb-3"
						placeholder="https://instagram.com/john.doe"
					/>
				</div>
				<div className="col">
					<label htmlFor="linkedin" className="form-label">
						Linkedin
					</label>
					<input
						id="linkedin"
						name="linkedin"
						defaultValue={object?.data?.social?.linkedin}
						type="text"
						className="form-control mb-3"
						placeholder="https://www.linkedin.com/in/john-doe-12345678a/"
					/>
				</div>
				<div className="col">
					<label htmlFor="steamId" className="form-label">
						Steam Id
					</label>
					<input
						id="steamId"
						name="steamId"
						defaultValue={object?.data?.social?.steamId}
						type="text"
						className="form-control mb-3"
						placeholder="https://www.steam.com"
					/>
				</div>
				<div className="col">
					<label htmlFor="xboxId" className="form-label">
						Xbox Id
					</label>
					<input
						id="xboxId"
						name="xboxId"
						defaultValue={object?.data?.social?.xboxId}
						type="text"
						className="form-control mb-3"
						placeholder="https://account.xbox.com/en-us/Profile?csrf=ID"
					/>
				</div>
				<div className="col-lg-12">
					<label htmlFor="indeed" className="form-label">
						Indeed Resume Link
					</label>
					<input
						id="indeed"
						name="indeed"
						defaultValue={object?.data?.social?.indeed}
						type="text"
						className="form-control mb-3"
						placeholder="https://profile.indeed.com/p/USERNAME-RESUMEID"
					/>
				</div>
			</div>
			<br />
			<FormButtons />
		</form>
	);
};

export default UpdateUserForm;
