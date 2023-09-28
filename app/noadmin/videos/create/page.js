"use client";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import AdminSidebar from "@/components/admin/adminsidebar";
import MyTextArea from "@/components/global/mytextarea";
import AuthContext from "@/helpers/globalContext";

const CreateVideo = () => {
	const { auth, files } = useContext(AuthContext);

	const router = useRouter();

	const [categories, setCategories] = useState([]);

	const fetchCategories = async (params = "") => {
		try {
			const res = await axios.get(`/categories${params}`);
			setCategories(res?.data?.data);
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
		fetchCategories(`?categoryType=video`);
	}, []);

	const [videoData, setVideoData] = useState({
		title: `Untitled`,
		avatar: files?.selected?._id,
		text: `No description`,
		featured: false,
		commented: false,
		embedding: false,
		category: undefined,
		password: ``,
		status: `draft`,
		cast: [auth?.user?._id],
		video_url: ``,
		free_preview: ``,
		language: "english",
		captionCert: undefined,
		recordingDate: ``,
		address: ``,
		license: undefined,
	});
	const {
		title,
		avatar,
		text,
		featured,
		commented,
		embedding,
		category,
		password,
		status,
		cast,
		video_url,
		free_preview,
		language,
		captionCert,
		recordingDate,
		address,
		license,
	} = videoData;

	const addVideo = async (e) => {
		e.preventDefault();
		try {
			await axios.post(`/videos`, {
				...videoData,
				files: { avatar: files?.selected?._id },
			});
			toast.success(`Item created`);
			resetForm();
			router.push(`/noadmin/videos`);
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
		setVideoData({
			title: `Untitled`,
			avatar: files?.selected?._id,
			text: `No description`,
			featured: false,
			commented: false,
			embedding: false,
			category: undefined,
			password: ``,
			status: `draft`,
			cast: [auth?.user?._id],
			video_url: ``,
			free_preview: ``,
			language: "english",
			captionCert: undefined,
			recordingDate: ``,
			address: ``,
			license: undefined,
		});
	};

	return (
		<form className="row" onSubmit={addVideo}>
			<div className="col">
				<label htmlFor="blog-title" className="form-label">
					Title
				</label>
				<input
					id="blog-title"
					name="title"
					value={title}
					onChange={(e) => {
						setVideoData({
							...videoData,
							title: e.target.value,
						});
					}}
					type="text"
					className="form-control mb-3"
					placeholder=""
				/>
				<label
					htmlFor="video-text multipurpose-textarea"
					className="form-label"
				>
					Text
				</label>
				<MyTextArea
					id="video-text"
					name="text"
					value={text}
					objectData={videoData}
					setObjectData={setVideoData}
					onModel="video"
					advancedTextEditor={true}
				/>
			</div>
			<div className="col-lg-3">
				<AdminSidebar
					avatar={files?.selected?._id}
					status={status}
					fullWidth={false}
					password={password}
					featured={featured}
					commented={commented}
					embedding={embedding}
					github={false}
					category={category}
					categories={categories}
					objectData={videoData}
					setObjectData={setVideoData}
					multipleFiles={false}
					onModel={"Video"}
				/>
				<br />
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

export default CreateVideo;
