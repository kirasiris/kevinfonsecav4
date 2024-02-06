"use client";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import AdminSidebar from "@/components/admin/adminsidebar";
import MyTextArea from "@/components/global/mytextarea";
import AuthContext from "@/helpers/globalContext";

const UpdatePlaylist = () => {
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
		avatar: files?.selected?._id,
		text: `No description`,
		featured: false,
		category: undefined,
		commented: false,
		password: ``,
		onairstatus: `finished`,
		onairtype: `tv`,
		status: `draft`,
	});
	const {
		title,
		avatar,
		text,
		featured,
		category,
		commented,
		password,
		onairstatus,
		onairtype,
		status,
	} = playlistData;

	const [playlist, setPlaylist] = useState(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(false);

	const { id } = useParams();
	const playlistId = id;

	useEffect(() => {
		const fetchPlaylist = async () => {
			try {
				const res = await axios.get(`/playlists/${playlistId}`);
				setPlaylist(res?.data?.data);
				setPlaylistData({
					title: res?.data?.data?.title,
					avatar: res?.data?.data?.files?.avatar,
					text: res?.data?.data?.text,
					featured: res?.data?.data?.featured,
					category: res?.data?.data?.category,
					commented: res?.data?.data?.commented,
					// password: res?.data?.data?.password,
					onairstatus: res?.data?.data?.onairstatus,
					onairtype: res?.data?.data?.onairtype,
					status: res?.data?.data?.status,
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
		fetchPlaylist();
	}, [playlistId]);

	const upgradePlaylist = async (e) => {
		e.preventDefault();
		try {
			await axios.put(`/playlists/${playlist._id}`, {
				...playlistData,
				files: { avatar: files?.selected?._id },
			});
			toast.success(`Item updated`);
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
			avatar: files?.selected?._id,
			text: `No description`,
			featured: false,
			category: undefined,
			commented: false,
			password: ``,
			onairstatus: `finished`,
			onairtype: `tv`,
			status: `draft`,
		});
	};

	return loading || playlist === null || playlist === undefined ? (
		error ? (
			<>Not found</>
		) : (
			<>Loading...</>
		)
	) : (
		<form className="row" onSubmit={upgradePlaylist}>
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
				<label htmlFor="text" className="form-label">
					Text
				</label>
				<MyTextArea
					id="text"
					name="text"
					value={text}
					objectData={playlistData}
					setObjectData={setPlaylistData}
					onModel="Playlist"
					advancedTextEditor={true}
				/>
				<div className="row">
					<div className="col">
						<label htmlFor="onairstatus" className="form-label">
							On Air Status
						</label>
						<select
							id="onairstatus"
							name="onairstatus"
							value={onairstatus}
							onChange={(e) => {
								setObjectData({
									...objectData,
									onairstatus: e.target.value,
								});
							}}
							className="form-control"
						>
							<option value={`onair`}>On Air</option>
							<option value={`finished`}>Finished</option>
							<option value={`soon`}>Soon</option>
						</select>
					</div>
					<div className="col">
						<label htmlFor="onairtype" className="form-label">
							On Air Type
						</label>
						<select
							id="onairtype"
							name="onairtype"
							value={onairtype}
							onChange={(e) => {
								setObjectData({
									...objectData,
									onairtype: e.target.value,
								});
							}}
							className="form-control"
						>
							<option value={`tv`}>TV</option>
							<option value={`movie`}>Movie</option>
							<option value={`special`}>Special</option>
							<option value={`ova`}>Ova</option>
						</select>
					</div>
				</div>
			</div>
			<div className="col-lg-3">
				<AdminSidebar
					avatar={avatar}
					status={status}
					fullWidth={false}
					password={password}
					featured={featured}
					commented={commented}
					embedding={false}
					github={false}
					category={category._id ? category._id : category}
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

export default UpdatePlaylist;
