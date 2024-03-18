"use client";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useContext, useEffect, useState } from "react";
import Link from "next/link";
import { toast } from "react-toastify";
import Image from "next/image";
import { FaFileVideo } from "react-icons/fa";
import MyTextArea from "@/components/global/mytextarea";
import AuthContext from "@/helpers/globalContext";
import RecordAudioModal from "@/components/global/recordaudiomodal";
import Waveform from "@/layout/waveform";
import UseDropzone from "@/components/global/dropzone";

const CreatePost = () => {
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
		fetchUsers();
	}, []);

	const [postData, setPostData] = useState({
		title: "Untitled",
		text: "No description",
		postedto: undefined,
		postedfrom: undefined, // used when sharing post
		featured: false,
		embedding: false,
		commented: false,
		password: "",
		status: "draft",
		hidden: false,
		postType: "post",
		subType: "photos",
		premiumContent: false,
		address: "",
	});

	const {
		title,
		text,
		postedto,
		postedfrom,
		featured,
		embedding,
		commented,
		password,
		status,
		hidden,
		postType,
		subType,
		premiumContent,
		address,
	} = postData;

	const addPost = async (e) => {
		e.preventDefault();
		console.log(postData);
		console.log(files.uploaded);
		try {
			// await axios.post(`/posts`, {
			// 	...postData,
			// 	postType: "post",
			// 	// files: files.uploaded.map((file) => file._id)
			// });
			// router.push(`/noadmin/posts`);
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
			return { msg: err?.response?.statusText, status: err?.response?.status };
		}
	};

	const resetForm = () => {
		setPostData({
			title: "Untitled",
			text: "No description",
			postedto: undefined,
			postedfrom: undefined, // used when sharing post
			featured: false,
			embedding: false,
			commented: false,
			password: "",
			status: "draft",
			hidden: false,
			postType: "post",
			subType: "photos",
			premiumContent: false,
			address: "",
		});
	};

	const [moreOptions, setMoreOptions] = useState(false);

	const [showDropzone, setShowDropzone] = useState(true);

	return (
		<form className="card" onSubmit={addPost}>
			<div className="card-header">
				<div className="float-start">
					<Link
						href={{
							pathname: `/profile/${auth?.user?._id}/${auth?.user?.username}`,
							query: {
								page: 1,
								limit: 50,
								sort: `-createdAt`,
							},
						}}
						passHref
						legacyBehavior
					>
						<Image
							src="https://yt3.ggpht.com/ytc/AL5GRJUOhe9c1D67-yLQEkT2EqyRclI5V3EOTANZQXmt=s48-c-k-c0x00ffffff-no-rj"
							className="me-1"
							alt="lzlalala"
							width="48"
							height="48"
						/>
					</Link>
				</div>
				<Link
					href={{
						pathname: `/profile/${auth?.user?._id}/${auth?.user?.username}`,
						query: {
							page: 1,
							limit: 50,
							sort: `-createdAt`,
						},
					}}
					passHref
					legacyBehavior
				>
					<a className="position-absolute" style={{ left: "68px" }}>
						{auth.user?.username}
					</a>
				</Link>
				<p className="position-absolute" style={{ left: "68px", top: "30px" }}>
					{auth?.user?.name}
				</p>
				<div className="float-end">
					<select className="form-control">
						<option value="1">Only me</option>
						<option value="2">Everyone can see</option>
						<option value="3">People I follow</option>
						<option value="4">People following me</option>
						<option value="5">Anonymous</option>
					</select>
				</div>
			</div>
			<div className="card-body">
				<label htmlFor="blog-title" className="form-label">
					Title
				</label>
				<input
					id="blog-title"
					name="title"
					value={title}
					onChange={(e) => {
						setPostData({
							...postData,
							title: e.target.value,
						});
					}}
					type="text"
					className="form-control mb-3"
					placeholder=""
				/>

				<div className="row">
					<div className="col">
						<label htmlFor="postedto" className="form-label">
							Post to
						</label>
						<select
							id="postedto"
							name="postedto"
							value={postedto}
							onChange={(e) => {
								setPostData({
									...postData,
									postedto: e.target.value,
								});
							}}
							className="form-control mb-3"
						>
							{users
								.filter((excludedUser) => excludedUser._id !== auth.user._id)
								.map((user) => (
									<option key={user._id} value={user._id}>
										{user.username}
									</option>
								))}
						</select>
					</div>
					<div className="col">
						<label htmlFor="postedfrom" className="form-label">
							Originally from
						</label>
						<select
							id="postedfrom"
							name="postedfrom"
							value={postedfrom}
							onChange={(e) => {
								setPostData({
									...postData,
									postedfrom: e.target.value,
								});
							}}
							className="form-control mb-3"
						>
							{users.map((user) => (
								<option key={user._id} value={user._id}>
									{user.username}
								</option>
							))}
						</select>
					</div>
				</div>
				<MyTextArea
					id="text"
					name="text"
					value={text}
					objectData={postData}
					setObjectData={setPostData}
					onModel="Post"
					advancedTextEditor={false}
				/>
				<br />
				<UseDropzone
					id="files"
					name="files"
					multipleFiles={true}
					onModel="Post"
					showDropzone={showDropzone}
					setShowDropzone={setShowDropzone}
					keepShowing={true}
				/>
				{files.previews?.length > 0 && (
					<div
						className="row"
						style={{
							display: "flex",
							flexWrap: "nowrap",
							overflowX: "auto",
						}}
					>
						{files.previews.map((file, index) => {
							const format = file.path.split(".")[1];
							return (
								<div key={index} className="col-auto mb-3">
									{format === "png" && (
										<figure>
											<Image
												src={file.preview}
												className={`${index}`}
												alt={`${index} image preview`}
												width={`188`}
												height={`188`}
											/>
										</figure>
									)}
									{format === "mp4" && (
										<figure>
											<FaFileVideo style={{ fontSize: "188px" }} />
										</figure>
									)}
								</div>
							);
						})}
					</div>
				)}
				{/* <Tabs
					defaultActiveKey="photos"
					id="uncontrolled-tab-example"
					className="mb-3"
				>
					<Tab eventKey="audios" title="Audios">
						<RecordAudioModal
							auth={auth}
							objectData={postData}
							setObjectData={setPostData}
							onModel={"Post"}
						/>
						<Waveform
							src={
								postData.files &&
								postData.files.length > 0 &&
								postData.files.location.secure_location
							}
						/>
					</Tab>
					
					<Tab eventKey="maps" title="Maps">
						<label htmlFor="address" className="form-label">
							Address
						</label>
						<input
							id="address"
							name="address"
							value={address}
							onChange={(e) => {
								setPostData({
									...postData,
									address: subType === "maps" ? e.target.value : undefined,
								});
							}}
							type="text"
							className="form-control mb-3"
							placeholder=""
						/>
					</Tab>
				</Tabs> */}
				<div className="row">
					<div className="col">
						<label htmlFor="status" className="form-label">
							Status
						</label>
						<select
							id="status"
							name="status"
							value={status}
							onChange={(e) => {
								setPostData({
									...postData,
									status: e.target.value,
								});
							}}
							className="form-control"
						>
							<option value={`draft`}>Draft</option>
							<option value={`published`}>Published</option>
							<option value={`trash`}>Trash</option>
							<option value={`scheduled`}>Scheduled</option>
						</select>
					</div>
					<div className="col">
						<label htmlFor="password" className="form-label">
							Password
						</label>
						<input
							id="password"
							name="password"
							value={password}
							onChange={(e) => {
								setPostData({
									...postData,
									password: e.target.value,
								});
							}}
							type="password"
							className="form-control mb-3"
							placeholder="******"
						/>
					</div>
					<div className="col">
						<label htmlFor="featured" className="form-label">
							Featured
						</label>
						<select
							id="featured"
							name="featured"
							value={featured}
							onChange={(e) => {
								setPostData({
									...postData,
									featured: e.target.value,
								});
							}}
							className="form-control"
						>
							<option value={true}>Yes</option>
							<option value={false}>No</option>
						</select>
					</div>
					<div className="col">
						<label htmlFor="commented" className="form-label">
							Commented
						</label>
						<select
							id="commented"
							name="commented"
							value={commented}
							onChange={(e) => {
								setPostData({
									...postData,
									commented: e.target.value,
								});
							}}
							className="form-control"
						>
							<option value={true}>Yes</option>
							<option value={false}>No</option>
						</select>
					</div>
					<div className="col">
						<label htmlFor="embedding" className="form-label">
							Embedding
						</label>
						<select
							id="embedding"
							name="embedding"
							value={embedding}
							onChange={(e) => {
								setPostData({
									...postData,
									embedding: e.target.value,
								});
							}}
							className="form-control"
						>
							<option value={true}>Yes</option>
							<option value={false}>No</option>
						</select>
					</div>
					<div className="col">
						<label htmlFor="hidden" className="form-label">
							Hidden
						</label>
						<select
							id="hidden"
							name="hidden"
							value={hidden}
							onChange={(e) => {
								setPostData({
									...postData,
									hidden: e.target.value,
								});
							}}
							className="form-control"
						>
							<option value={true}>Yes</option>
							<option value={false}>No</option>
						</select>
					</div>
				</div>
				<div className="row">
					<div className="col">
						<label htmlFor="postType" className="form-label">
							Post Type
						</label>
						<select
							id="postType"
							name="postType"
							value={postType}
							onChange={(e) => {
								setPostData({
									...postData,
									postType: e.target.value,
								});
							}}
							className="form-control"
						>
							<option value={`post`}>Post</option>
							<option value={`story`}>Story</option>
						</select>
					</div>
					<div className="col">
						<label htmlFor="subType" className="form-label">
							Sub type
						</label>
						<select
							id="subType"
							name="subType"
							value={subType}
							onChange={(e) => {
								setPostData({
									...postData,
									subType: e.target.value,
								});
							}}
							className="form-control"
						>
							<option value={`text`}>Text</option>
							<option value={`photos`}>Photos</option>
							<option value={`videos`}>Videos</option>
							<option value={`audios`}>Audios</option>
							<option value={`files`}>Files</option>
							<option value={`maps`}>Maps</option>
						</select>
					</div>
					<div className="col">
						<label htmlFor="premiumContent" className="form-label">
							Premium Content
						</label>
						<select
							id="premiumContent"
							name="premiumContent"
							value={premiumContent}
							onChange={(e) => {
								setPostData({
									...postData,
									premiumContent: e.target.value,
								});
							}}
							className="form-control"
						>
							<option value={true}>Yes</option>
							<option value={false}>No</option>
						</select>
					</div>
				</div>
			</div>
			<div className="card-footer">
				<button
					type="submit"
					className="btn btn-secondary btn-sm float-start"
					disabled={title.length > 0 && text.length > 0 ? !true : !false}
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

export default CreatePost;
