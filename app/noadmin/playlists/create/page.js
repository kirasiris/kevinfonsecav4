"use client";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import AdminSidebar from "@/components/admin/adminsidebar";
import MyTextArea from "@/components/global/mytextarea";
import AuthContext from "@/helpers/globalContext";

const CreatePlaylist = () => {
	const { files } = useContext(AuthContext);

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
		fetchCategories(`?categoryType=playlist`);
	}, []);

	const [playlistData, setPlaylistData] = useState({
		title: `Untitled`,
		text: `No description`,
		featured: false,
		category: undefined,
		commented: false,
		password: ``,
		status: `draft`,
	});
	const { title, text, featured, category, commented, password, status } =
		playlistData;

	const addPlaylist = async (e) => {
		e.preventDefault();
		try {
			await axios.post(`/playlists`, {
				...playlistData,
				postType: "video",
				files: { avatar: files?.selected?._id },
			});
			toast.success(`Item created`);
			resetForm();
			router.push(`/noadmin/playlists`);
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
		setPlaylistData({
			title: `Untitled`,
			text: `No description`,
			featured: false,
			embedding: false,
			category: undefined,
			commented: false,
			password: ``,
			tags: [],
			status: `draft`,
			fullWidth: false,
		});
	};

	return (
		<form className="row" onSubmit={addPlaylist}>
			<div className="col">
				<label htmlFor="blog-title" className="form-label">
					Title
				</label>
				<input
					id="blog-title"
					name="title"
					value={title}
					onChange={(e) => {
						setPlaylistData({
							...playlistData,
							title: e.target.value,
						});
					}}
					type="text"
					className="form-control mb-3"
					placeholder=""
				/>
				<label
					htmlFor="playlist-text multipurpose-textarea"
					className="form-label"
				>
					Text
				</label>
				<MyTextArea
					id="playlist-text"
					name="text"
					value={text}
					objectData={playlistData}
					setObjectData={setPlaylistData}
					onModel="Playlist"
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
					embedding={false}
					github={false}
					category={category}
					categories={categories}
					objectData={playlistData}
					setObjectData={setPlaylistData}
					multipleFiles={false}
					onModel={"Playlist"}
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

export default CreatePlaylist;
