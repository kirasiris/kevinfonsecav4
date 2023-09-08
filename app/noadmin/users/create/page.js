"use client";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import AdminSidebar from "@/components/admin/adminsidebar";
import MyTextArea from "@/components/global/mytextarea";
import AuthContext from "@/helpers/globalContext";

const CreateUser = () => {
	const { auth, files } = useContext(AuthContext);

	const router = useRouter();

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
		fetchUsers();
	}, []);

	const [userData, setUserData] = useState({
		username: ``,
		name: "",
		email: "",
		secondaryEmail: "",
		phoneNumber: "012-345-6789",
		password: "",
		isEmailConfirmed: false,
		role: "subscriber",
		sex: "straight",
		gender: "non-binary",
		age: "18",
		relationshipStatus: "single",
		inRelationshipWith: "",
		company: "",
		website: "",
		workstatus: ``,
		bio: "",
		twitter: "",
		facebook: "",
		youtube: "",
		instagram: "",
		linkedin: "",
		steamId: "",
		xboxId: "",
		fromBlogNotification: "",
		fromPostNotification: "",
		fromVideoNotification: "",
		fromMediaNotification: "",
		fromProducerNotification: "",
		fromJobNotification: "",
		fromCommentNotification: "",
		fromBlogNewsNotification: "",
		fromProducerNewsNotification: "",
		fromUserNewsNotification: "",
		fromBlogComments: "",
		fromPostComments: "",
		fromVideoComments: "",
		fromMediaComments: "",
		fromProducerComments: "",
		fromJobComments: "",
		fromCommentComments: "",
	});
	const {
		username,
		name,
		email,
		secondaryEmail,
		phoneNumber,
		password,
		isEmailConfirmed,
		role,
		sex,
		gender,
		age,
		relationshipStatus,
		inRelationshipWith,
		company,
		website,
		workstatus,
		bio,
		twitter,
		facebook,
		youtube,
		instagram,
		linkedin,
		steamId,
		xboxId,
		fromBlogNotification,
		fromPostNotification,
		fromVideoNotification,
		fromMediaNotification,
		fromProducerNotification,
		fromJobNotification,
		fromCommentNotification,
		fromBlogNewsNotification,
		fromProducerNewsNotification,
		fromUserNewsNotification,
		fromBlogComments,
		fromPostComments,
		fromVideoComments,
		fromMediaComments,
		fromProducerComments,
		fromJobComments,
		fromCommentComments,
	} = userData;

	const addUser = async (e) => {
		e.preventDefault();
		try {
			await axios.post(`/users`, userData);
			toast.success(`Item created`);
			resetForm();
			router.push(`/noadmin/users`);
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
			name: "",
			email: "",
			secondaryEmail: "",
			phoneNumber: "",
			password: "",
			isEmailConfirmed: true,
			role: "",
			sex: "",
			gender: "",
			age: "",
			relationshipStatus: "",
			inRelationshipWith: undefined,
			company: "",
			website: "",
			workstatus: ``,
			bio: "",
			twitter: "",
			facebook: "",
			youtube: "",
			instagram: "",
			linkedin: "",
			steamId: "",
			xboxId: "",
			fromBlogNotification: "",
			fromPostNotification: "",
			fromVideoNotification: "",
			fromMediaNotification: "",
			fromProducerNotification: "",
			fromJobNotification: "",
			fromCommentNotification: "",
			fromBlogNewsNotification: "",
			fromProducerNewsNotification: "",
			fromUserNewsNotification: "",
			fromBlogComments: "",
			fromPostComments: "",
			fromVideoComments: "",
			fromMediaComments: "",
			fromProducerComments: "",
			fromJobComments: "",
			fromCommentComments: "",
		});
	};

	return (
		<form className="row" onSubmit={addUser}>
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
				<label htmlFor="isEmailConfirmed" className="form-label">
					Confirm Email?
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
				<label htmlFor="role" className="form-label">
					Role
				</label>
				<select
					id="role"
					name="role"
					value={role}
					onChange={(e) => {
						setUserData({
							...userData,
							role: e.target.value,
						});
					}}
					className="form-control"
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
				<label htmlFor="age" className="form-label">
					Age
				</label>
				<input
					id="age"
					name="age"
					value={age}
					onChange={(e) => {
						setUserData({
							...userData,
							age: e.target.value,
						});
					}}
					type="number"
					className="form-control mb-3"
					placeholder="18"
					min={18}
					max={99}
				/>
				<label htmlFor="relationshipStatus" className="form-label">
					Relationship status
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
						.filter((excludedUser) => excludedUser._id !== auth.user._id)
						.map((user) => (
							<option key={user._id} value={user._id}>
								{user.username}
							</option>
						))}
				</select>
				{/* <label htmlFor="blog-text multipurpose-textarea" className="form-label">
					Text
				</label>
				<MyTextArea
					id="blog-text"
					name="text"
					value={text}
					objectData={userData}
					setObjectData={setUserData}
				/> */}
			</div>
			<div className="col-lg-3">
				{/* <AdminSidebar
					avatar={files?.selected?._id}
					status={status}
					fullWidth={fullWidth}
					password={password}
					featured={featured}
					commented={commented}
					embedding={embedding}
					github={false}
					category={category}
					categories={categories}
					objectData={userData}
					setObjectData={setUserData}
					multipleFiles={false}
					onModel={"Blog"}
				/> */}
				<br />
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
			</div>
		</form>
	);
};

export default CreateUser;
