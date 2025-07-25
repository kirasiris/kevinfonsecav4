// "use client";
// import { fetchurl } from "@/helpers/setTokenOnServer";
// import { useRouter } from "next/navigation";
// import { useState, useEffect, useContext } from "react";
// import { toast } from "react-toastify";
// import AdminSidebar from "@/components/admin/myfinaladminsidebar";
// import MyTextArea from "@/components/global/myfinaltextarea";

import { redirect } from "next/navigation";
import MyTextArea from "@/components/global/myfinaltextarea";
import {
	fetchurl,
	getAuthTokenOnServer,
	getUserOnServer,
} from "@/helpers/setTokenOnServer";

async function getPlaylists(params) {
	const res = await fetchurl(`/global/playlists${params}`, "GET", "no-cache");
	return res;
}

async function getCategories(params) {
	const res = await fetchurl(`/global/categories${params}`, "GET", "no-cache");
	return res;
}

const CreateVideo = async ({ params, searchParams }) => {
	const token = await getAuthTokenOnServer();
	const auth = await getUserOnServer();

	const playlists = await getPlaylists(`?page=1&limit=100&sort=-createdAt`);
	const categories = await getCategories(`?categoryType=blog`);

	const addVideo = async (formData) => {
		"use server";
		const rawFormData = {};

		await fetchurl(`/noadmin/videos`, "POST", "no-cache", {
			...rawFormData,
		});
		redirect(`/noadmin/videos`);
	};

	return (
		<form className="row" action={addVideo}>
			<div className="col">
				<label htmlFor="title" className="form-label">
					Title
				</label>
				<input
					id="title"
					name="title"
					defaultValue="Untitled"
					type="text"
					className="form-control mb-3"
					placeholder=""
				/>
				<label htmlFor="text" className="form-label">
					Text
				</label>
				<MyTextArea
					auth={auth}
					token={token}
					id="text"
					name="text"
					defaultValue="No description..."
					onModel="Video"
					advancedTextEditor={true}
					customPlaceholder="No description"
				/>
				{playlists?.length > 0 && (
					<>
						<label htmlFor="resourceId" className="form-label">
							Playlist
						</label>
						<select
							id="resourceId"
							name="resourceId"
							defaultValue=""
							className="form-control"
						>
							{playlists.map((playlist) => (
								<option key={playlist._id} value={playlist._id}>
									{playlist.title} - {playlist.onairtype.toUpperCase()}
								</option>
							))}
						</select>
					</>
				)}
				<label htmlFor="address" className="form-label">
					Address
				</label>
				<input
					id="address"
					name="address"
					defaultValue=""
					type="text"
					className="form-control mb-3"
					placeholder=""
				/>
				<div className="row">
					<div className="col">
						<label htmlFor="language" className="form-label">
							Language
						</label>
						<select
							id="language"
							name="language"
							defaultValue="english"
							className="form-control"
						>
							<option value="english">English</option>
							<option value="mandarin">Mandarin</option>
							<option value="hindi">Hindi</option>
							<option value="spanish">Spanish</option>
							<option value="french">French</option>
							<option value="arabic">Arabic</option>
							<option value="bengali">Bengali</option>
							<option value="russian">Russian</option>
							<option value="portuguese">Portuguese</option>
							<option value="indonesian">Indonesian</option>
						</select>
					</div>
					<div className="col">
						<label htmlFor="captionCert" className="form-label">
							Caption Certificate
						</label>
						<select
							id="captionCert"
							name="captionCert"
							defaultValue="1"
							className="form-control"
						>
							<option value="0">None</option>
							<option value="1">
								This content has never aired on television in the U.S.
							</option>
							<option value="2">
								This content has only aired on television in the U.S. without
								captions
							</option>
							<option value="3">
								This content has not aired on U.S. television with captions
								since September 30, 2012.
							</option>
							<option value="4">
								This content does not consist of full-length video programming.
							</option>
							<option value="5">
								This content does not fall within a category of online
								programming that requires captions under FCC regulations (47
								C.F.R. § 79).
							</option>
							<option value="6">
								The FCC and/or U.S. Congress has granted an exemption from
								captioning requirements for this content.
							</option>
						</select>
					</div>
					<div className="col">
						<label htmlFor="recordingDate" className="form-label">
							Recording Date
						</label>
					</div>
					<div className="col">
						<label htmlFor="license" className="form-label">
							License
						</label>
						<select
							id="license"
							name="license"
							defaultValue="0"
							className="form-control"
						>
							<option value="0">Standard beFree license</option>
							<option value="1">Creative Commons - Attribution</option>
						</select>
					</div>
				</div>
			</div>
			<div className="col"></div>
		</form>
	);

	// const { auth, files } = useContext(AuthContext);
	// const router = useRouter();
	// // Redirect if not authenticated
	// !auth.isAuthenticated && router.push("/auth/login");
	// // Redirec if not founder
	// auth.isAuthenticated &&
	// 	!auth.user.role.includes("founder") &&
	// 	router.push("/dashboard");
	// const [categories, setCategories] = useState([]);
	// const [playlists, setPlaylists] = useState([]);
	// const fetchCategories = async (params = "") => {
	// 	try {
	// 		const res = await fetchurl(`/categories${params}`, "GET", "no-cache");
	// 		setCategories(res?.data);
	// 	} catch (err) {
	// 		// const error = err.response.data.message;
	// 		const error = err?.response?.data?.error?.errors;
	// 		const errors = err?.response?.data?.errors;
	// 		if (error) {
	// 			// dispatch(setAlert(error, 'danger'));
	// 			error &&
	// 				Object.entries(error).map(([, value]) => toast.error(value.message));
	// 		}
	// 		if (errors) {
	// 			errors.forEach((error) => toast.error(error.msg));
	// 		}
	// 		toast.error(err?.response?.statusText);
	// 		return {
	// 			msg: err?.response?.statusText,
	// 			status: err?.response?.status,
	// 		};
	// 	}
	// };
	// useEffect(() => {
	// 	fetchCategories(`?categoryType=video`);
	// }, []);
	// const fetchPlaylists = async (params = "") => {
	// 	try {
	// 		const res = await fetchurl(`/playlists${params}`, "GET", "no-cache");
	// 		setPlaylists(res?.data);
	// 	} catch (err) {
	// 		// const error = err.response.data.message;
	// 		const error = err?.response?.data?.error?.errors;
	// 		const errors = err?.response?.data?.errors;
	// 		if (error) {
	// 			// dispatch(setAlert(error, 'danger'));
	// 			error &&
	// 				Object.entries(error).map(([, value]) => toast.error(value.message));
	// 		}
	// 		if (errors) {
	// 			errors.forEach((error) => toast.error(error.msg));
	// 		}
	// 		toast.error(err?.response?.statusText);
	// 		return {
	// 			msg: err?.response?.statusText,
	// 			status: err?.response?.status,
	// 		};
	// 	}
	// };
	// useEffect(() => {
	// 	fetchPlaylists(`?page=1&limit=10&sort=-createdAt`);
	// }, []);
	// const [videoData, setVideoData] = useState({
	// 	resourceId: undefined,
	// 	title: `Untitled`,
	// 	avatar: files?.selected?._id,
	// 	text: `No description`,
	// 	featured: true,
	// 	commented: true,
	// 	embedding: true,
	// 	category: undefined,
	// 	password: ``,
	// 	status: `draft`,
	// 	cast: [auth?.user?._id],
	// 	language: "english",
	// 	captionCert: 1,
	// 	recordingDate: new Date(),
	// 	address: ``,
	// 	license: 0,
	// });
	// const {
	// 	resourceId,
	// 	title,
	// 	avatar,
	// 	text,
	// 	featured,
	// 	commented,
	// 	embedding,
	// 	category,
	// 	password,
	// 	status,
	// 	cast,
	// 	language,
	// 	captionCert,
	// 	recordingDate,
	// 	address,
	// 	license,
	// } = videoData;
	// const addVideo = async (e) => {
	// 	e.preventDefault();
	// 	try {
	// 		await fetchurl(`/videos`, "POST", "no-cache", {
	// 			...videoData,
	// 			files: { avatar: files?.selected?._id },
	// 			onModel: "Playlist",
	// 		});
	// 		router.push(`/noadmin/videos`);
	// 	} catch (err) {
	// 		console.log(err);
	// 		// const error = err.response.data.message;
	// 		const error = err?.response?.data?.error?.errors;
	// 		const errors = err?.response?.data?.errors;
	// 		if (error) {
	// 			// dispatch(setAlert(error, 'danger'));
	// 			error &&
	// 				Object.entries(error).map(([, value]) => toast.error(value.message));
	// 		}
	// 		if (errors) {
	// 			errors.forEach((error) => toast.error(error.msg));
	// 		}
	// 		toast.error(err?.response?.statusText);
	// 		return { msg: err?.response?.statusText, status: err?.response?.status };
	// 	}
	// };
	// const resetForm = () => {
	// 	setVideoData({
	// 		resourceId: undefined,
	// 		title: `Untitled`,
	// 		avatar: files?.selected?._id,
	// 		text: `No description`,
	// 		featured: true,
	// 		commented: true,
	// 		embedding: true,
	// 		category: undefined,
	// 		password: ``,
	// 		status: `draft`,
	// 		cast: [auth?.user?._id],
	// 		language: "english",
	// 		captionCert: 1,
	// 		recordingDate: new Date(),
	// 		address: ``,
	// 		license: 0,
	// 	});
	// };
	// return (
	// 	<form className="row" onSubmit={addVideo}>
	// 		<div className="col">
	// 			<div className="row">
	// 				<div className="col">
	// 					<label htmlFor="recordingDate" className="form-label">
	// 						Recording Date
	// 					</label>
	// 					<Calendar
	// 						onChange={(e) => {
	// 							setVideoData({
	// 								...videoData,
	// 								recordingDate: e,
	// 							});
	// 						}}
	// 						value={recordingDate}
	// 					/>
	// 				</div>
	// 			</div>
	// 		</div>
	// 		<div className="col-lg-3">
	// 			<AdminSidebar
	// 				displayCategoryField={true}
	// 				displayAvatar={true}
	// 				avatar={files?.selected?._id}
	// 				status={status}
	// 				fullWidth={false}
	// 				password={password}
	// 				featured={featured}
	// 				commented={commented}
	// 				embedding={embedding}
	// 				github_readme={""}
	// 				category={category}
	// 				categories={categories}
	//				multiple_categories={false}
	// 				objectData={videoData}
	// 				setObjectData={setVideoData}
	// 				multipleFiles={false}
	// 				onModel={"Video"}
	// 			/>
	// 			<br />
	// 			<button
	// 				type="submit"
	// 				className="btn btn-secondary btn-sm float-start"
	// 				disabled={title.length > 0 && text.length > 0 ? !true : !false}
	// 			>
	// 				Submit
	// 			</button>
	// 			<button
	// 				type="button"
	// 				className="btn btn-secondary btn-sm float-end"
	// 				onClick={resetForm}
	// 			>
	// 				Reset
	// 			</button>
	// 		</div>
	// 	</form>
	// );
};

export default CreateVideo;
