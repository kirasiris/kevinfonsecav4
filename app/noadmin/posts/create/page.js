"use client";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useContext, useEffect, useState } from "react";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import Link from "next/link";
import { toast } from "react-toastify";
import MyTextArea from "@/components/global/mytextarea";
import AuthContext from "@/helpers/globalContext";
import RecordAudioModal from "@/components/global/recordaudiomodal";
import Waveform from "@/layout/waveform";
import UseDropzone from "@/components/global/dropzone";

const CreatePost = () => {
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

	const [postData, setPostData] = useState({
		title: "Untitled",
		text: "No description",
		postedto: undefined,
		postedfrom: undefined, // used when sharing post
		files: [],
		featured: false,
		embedding: false,
		commented: false,
		password: "",
		status: "draft",
		hidden: false,
		postType: "post",
		subType: "text",
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
		try {
			await axios.post(`/posts`, {
				...postData,
				postType: "post",
				// files:
			});
			toast.success(`Item created`);
			// resetForm();
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
			files: [],
			featured: false,
			embedding: false,
			commented: false,
			password: "",
			status: "draft",
			hidden: false,
			postType: "post",
			subType: "text",
			premiumContent: false,
			address: "",
		});
	};

	const [moreOptions, setMoreOptions] = useState(false);

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
						<img
							src="https://yt3.ggpht.com/ytc/AL5GRJUOhe9c1D67-yLQEkT2EqyRclI5V3EOTANZQXmt=s48-c-k-c0x00ffffff-no-rj"
							className="me-1"
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
					{auth.user?.username}
				</Link>
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
							className="form-control"
						>
							<option selected>Choose an option</option>
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
							className="form-control"
						>
							<option selected>Choose an option</option>
							{users.map((user) => (
								<option key={user._id} value={user._id}>
									{user.username}
								</option>
							))}
						</select>
					</div>
				</div>
				<br />
				<Tabs
					defaultActiveKey="text"
					id="uncontrolled-tab-example"
					className="mb-3"
				>
					<Tab eventKey="text" title="Text">
						<MyTextArea
							id="text"
							name="text"
							value={text}
							objectData={postData}
							setObjectData={setPostData}
							onModel="Post"
							advancedTextEditor={false}
						/>
					</Tab>
					<Tab eventKey="photos" title="Photos">
						<UseDropzone
							id="files"
							name="files"
							multipleFiles={true}
							onModel="Post"
						/>
					</Tab>
					<Tab eventKey="videos" title="Videos">
						<UseDropzone
							id="files"
							name="files"
							multipleFiles={false}
							onModel="Post"
						/>
					</Tab>
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
					<Tab eventKey="files" title="Files">
						<UseDropzone
							id="files"
							name="files"
							multipleFiles={false}
							onModel="Post"
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
				</Tabs>
				<br />
				<div className="d-grid">
					<button
						type="button"
						onClick={() => setMoreOptions(!moreOptions)}
						className="btn btn-secondary btn-block"
					>
						Add to your post
					</button>
				</div>
				{moreOptions && (
					<>
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
					</>
				)}
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