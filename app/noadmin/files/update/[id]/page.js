"use client";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Image from "next/image";
import MyTextArea from "@/layout/mytextarea";

const UpdateFile = () => {
	const router = useRouter();

	const [fileData, setFileData] = useState({
		title: `Untitled`,
		caption: "",
		altText: "",
		text: "No description",
	});
	const { title, caption, altText, text } = fileData;

	const [file, setFile] = useState(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(false);

	const { id } = useParams();
	const fileId = id;

	useEffect(() => {
		const fetchFile = async () => {
			try {
				const res = await axios.get(`/files/${fileId}`);
				setFile(res?.data?.data);
				setFileData({
					title: res?.data?.data?.title,
					caption: res?.data?.data?.caption,
					altText: res?.data?.data?.altText,
					text: res?.data?.data?.text,
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
		fetchFile();
	}, [fileId]);

	const upgradeFile = async (e) => {
		e.preventDefault();
		try {
			await axios.put(`/files/${file._id}`, fileData);
			toast.success(`Item updated`);
			router.push(`/noadmin/files`);
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
		setFileData({
			title: `Untitled`,
			caption: "",
			altText: "",
			text: "No description",
		});
	};

	return loading || file === null || file === undefined ? (
		error ? (
			<>Not found</>
		) : (
			<>Loading...</>
		)
	) : (
		<form className="row" onSubmit={upgradeFile}>
			<div className="col">
				<Image
					src={file?.location?.secure_location}
					alt={file.title}
					width={`1200`}
					height={`900`}
				/>
			</div>
			<div className="col">
				<label htmlFor="file-title" className="form-label">
					Title
				</label>
				<input
					id="file-title"
					name="title"
					value={title}
					onChange={(e) => {
						setFileData({
							...fileData,
							title: e.target.value,
						});
					}}
					type="text"
					className="form-control mb-3"
					placeholder=""
				/>
				<label htmlFor="file-caption" className="form-label">
					Caption
				</label>
				<textarea
					id="file-caption"
					name="caption"
					onChange={(e) => {
						setFileData({
							...fileData,
							caption: e.target.value,
						});
					}}
					className="form-control"
					placeholder=""
				>
					{caption}
				</textarea>
				<label htmlFor="file-alt-text" className="form-label">
					Alt text
				</label>
				<input
					id="file-alt-text"
					name="altText"
					value={altText}
					onChange={(e) => {
						setFileData({
							...fileData,
							altText: e.target.value,
						});
					}}
					type="text"
					className="form-control mb-3"
					placeholder=""
				/>
				<label htmlFor="file-text multipurpose-textarea" className="form-label">
					Text
				</label>
				<MyTextArea
					id="file-text"
					name="text"
					value={text}
					objectData={fileData}
					setObjectData={setFileData}
				/>
				<label htmlFor="file-url" className="form-label">
					URL
				</label>
				<input
					id="file-url"
					name="url"
					value={file.location.secure_location}
					type="text"
					className="form-control mb-3"
					placeholder=""
					readOnly
				/>
				<div className="row gap-3">
					<div className="col">
						<label htmlFor="file-name" className="form-label">
							FILE NAME
						</label>
						<input
							id="file-name"
							name="file-name"
							value={file.location.filename}
							type="text"
							className="form-control"
							placeholder=""
							readOnly
						/>
						<label htmlFor="file-dimensions" className="form-label">
							DIMENSIONS
						</label>
						<input
							id="file-dimensions"
							name=""
							value={file.dimensions.width + "x" + file.dimensions.height}
							type="text"
							className="form-control"
							placeholder=""
							readOnly
						/>
					</div>
					<div className="col">
						<label htmlFor="file-type" className="form-label">
							FILE TYPE
						</label>
						<input
							id="file-type"
							name=""
							value={file.format.toUpperCase()}
							type="text"
							className="form-control"
							placeholder=""
							readOnly
						/>
						<label htmlFor="file-uploadedAt" className="form-label">
							UPLOAD DATE
						</label>
						<input
							id="file-uploadedAt"
							name=""
							value={file.createdAt}
							type="text"
							className="form-control"
							placeholder=""
							readOnly
						/>
					</div>
				</div>
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

export default UpdateFile;
