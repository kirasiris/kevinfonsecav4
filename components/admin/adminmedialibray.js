"use client";
import axios from "axios";
import { useContext, useState, useEffect } from "react";
import { toast } from "react-toastify";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ButtonGroup, Dropdown } from "react-bootstrap";
import AuthContext from "@/helpers/globalContext";
import AdminMediaLibraryMenu from "./adminmediamenu";

import Single from "@/components/admin/files/single";
import UseDropzone from "@/components/global/dropzone";

const AdminMediaLibray = ({
	id = "single",
	name = "single",
	multipleFiles = true,
	onModel = "Blog",
}) => {
	const { files, setFiles } = useContext(AuthContext);

	const router = useRouter();

	const [showDropzone, setShowDropzone] = useState(false);

	const [params] = useState(`?page=1&sort=-createdAt`);

	const fetchMedia = async () => {
		try {
			const res = await axios.get(`/files${params}`);
			setFiles((prev) => ({ ...prev, media: res?.data?.data }));
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
		fetchMedia();
	}, [router]);

	const handleDelete = async (id, publicId) => {
		try {
			await axios.delete(`/files/${id}`);
			await axios.delete(`/uploads/deleteObject?publicId=${publicId}`);
			toast.success("File deleted");
			setFiles({
				...files,
				media: files.media.filter((image) => image._id !== id),
				selected: null,
			});

			// fetchMedia();
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

	const handleDeleteAll = async () => {
		try {
			await axios.delete(`/files/deleteall`);
			toast.success("Files deleted");
			fetchMedia();
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

	return (
		<>
			<AdminMediaLibraryMenu
				allLink="/noadmin/files"
				imagesLink="/noadmin/files/images"
				documentsLink="/noadmin/files/documents"
				videosLink="/noadmin/files/videos"
				audioLink="/noadmin/files/audios"
			/>

			<div className="card rounded-0">
				<div className="card-header">
					<Dropdown as={ButtonGroup} size="sm" title="Add new">
						<button
							className="btn btn-danger btn-sm float-start"
							type="button"
							onClick={() => setShowDropzone(!showDropzone)}
						>
							Add new
						</button>
						<Dropdown.Toggle split variant="danger" id="dropdown-split-basic" />
						<Dropdown.Menu>
							<Dropdown.Item href="#/action-1">Add via URL</Dropdown.Item>
							<Dropdown.Item href="#/action-2">Another action</Dropdown.Item>
							<Dropdown.Item href="#/action-3">Something else</Dropdown.Item>
						</Dropdown.Menu>
					</Dropdown>
				</div>
				<div className="card-body">
					<UseDropzone
						id={id}
						name={name}
						multipleFiles={multipleFiles}
						onModel={onModel}
						showDropzone={showDropzone}
						setShowDropzone={setShowDropzone}
					/>
					<div className="row">
						{files.previews?.length > 0 &&
							files.previews.map((file, index) => (
								<Image
									key={index}
									src={file.preview}
									className={`${index} col mb-4`}
									alt={`${index} image preview`}
									width={`188`}
									height={`188`}
								/>
							))}
						{files?.media?.length > 0 &&
							files?.media.map((mediaFile) => (
								<Single
									key={mediaFile?._id}
									object={mediaFile}
									handleDelete={handleDelete}
									objects={files}
									setObjects={setFiles}
								/>
							))}
					</div>
				</div>
			</div>
		</>
	);
};

export default AdminMediaLibray;
