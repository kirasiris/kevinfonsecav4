"use client";
import { fetchurl } from "@/helpers/setTokenOnServer";
import Link from "next/link";
import { useContext, useState, useEffect } from "react";
import { toast } from "react-toastify";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { FaFileVideo } from "react-icons/fa";
import AuthContext from "@/helpers/globalContext";
import AdminMediaLibraryMenu from "@/components/admin/adminmediamenu";
import Single from "@/components/admin/files/single";
import UseDropzone from "@/components/global/dropzone";
import DeleteAllModal from "@/components/global/deleteallmodal";
import ClientLoadMorePagination from "@/layout/clientloadmorepagination";

const AdminMediaLibray = ({
	id = "single",
	name = "single",
	multipleFiles = true,
	onModel = "Blog",
}) => {
	const {
		auth,
		files,
		setFiles,
		totalPages,
		setTotalPages,
		currentResults,
		setCurrentResults,
		totalResults,
		setTotalResults,
	} = useContext(AuthContext);

	const router = useRouter();

	const uploader =
		auth !== "" && auth !== undefined ? `&user=${auth?.user?._id}` : "";

	const [showDropzone, setShowDropzone] = useState(false);
	const [page, setPage] = useState(1);
	const [limit] = useState(11);
	const [sortby] = useState(`-createdAt`);
	const [next, setNext] = useState(0);
	const [params, setParams] = useState(
		`?page=${page}&limit=${limit}&sort=${sortby}${uploader}`
	);
	const [loading, setLoading] = useState(true);

	const fetchMedia = async () => {
		try {
			const res = await fetchurl(`/files${params}`, "GET", "no-cache");
			setFiles({
				...files,
				media: [...files.media, ...res?.data],
			});
			setTotalPages(res?.pagination?.totalpages);
			setCurrentResults(res?.count);
			setTotalResults({ ...totalResults, files: res?.countAll });
			setPage(res?.pagination?.current);
			setNext(res?.pagination?.next?.page);
			setLoading(false);
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
	}, [router, params]);

	const handleDelete = async (id, publicId) => {
		try {
			await fetchurl(`/files/${id}`, "DELETE", "no-cache");
			await fetchurl(
				`/uploads/deleteobject?publicId=${publicId}`,
				"DELETE",
				"no-cache"
			);
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

	const handleTrashAll = async () => {
		try {
			await fetchurl(`/files/deleteall`, "PUT", "no-cache");
			toast.success("Contacts trashed");
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

	const handleDeleteAll = async () => {
		try {
			await fetchurl(`/files/deleteall/permanently`, "DELETE", "no-cache");
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

	const handleDeleteFromDom = (index) => {
		const newMedia = [...files.media];
		const newPreviews = [...files.previews];

		newPreviews.splice(index, 1);

		setFiles({
			media: newMedia,
			previews: newPreviews,
		});
	};

	return (
		<>
			<AdminMediaLibraryMenu
				allLink="/dashboard/files"
				imagesLink="/dashboard/files/images"
				documentsLink="/dashboard/files/documents"
				videosLink="/dashboard/files/videos"
				audioLink="/dashboard/files/audios"
			/>
			<div className="card rounded-0">
				<div className="card-header">
					<Link
						href={{
							pathname: "/dashboard/files",
							query: { page: 1, limit: 10 },
						}}
						passHref
						legacyBehavior
					>
						<a className="btn btn-link btn-sm float-start">
							Files - ({currentResults} / {totalResults.files})
						</a>
					</Link>
					<div className="btn-group float-end">
						<button
							className="btn btn-primary btn-sm"
							type="button"
							onClick={() => setShowDropzone(!showDropzone)}
						>
							Add new file
						</button>
						<DeleteAllModal action={handleDeleteAll} />
					</div>
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
							files.previews.map((file, index) => {
								const format = file.path.split(".")[1];
								return (
									<div key={index} className="col mb-3">
										<figure>
											{format === "png" && (
												<Image
													src={file.preview}
													className={`${index}`}
													alt={`${index} image preview`}
													width={`188`}
													height={`188`}
												/>
											)}
											{format === "mp4" && (
												<FaFileVideo style={{ fontSize: "188px" }} />
											)}
										</figure>
										<div className="btn-group">
											<button
												className="btn btn-danger btn-sm"
												onClick={() => handleDeleteFromDom(index)}
											>
												Delete
											</button>
										</div>
									</div>
								);
							})}
						{files?.media?.length > 0 ? (
							<>
								{files?.media.map((mediaFile) => (
									<Single
										key={mediaFile?._id}
										object={mediaFile}
										handleDelete={handleDelete}
										objects={files}
										setObjects={setFiles}
									/>
								))}
								<ClientLoadMorePagination
									limit={limit}
									next={
										next !== undefined &&
										next !== null &&
										next !== false &&
										next
									}
									sortby={sortby}
									setParams={setParams}
									router={router}
								/>
							</>
						) : (
							<div
								className={`alert alert-${
									loading ? "primary" : "danger"
								} rounded-0 m-0 border-0`}
							>
								{loading ? "Loading" : "Nothing found"}
							</div>
						)}
					</div>
				</div>
			</div>
		</>
	);
};

export default AdminMediaLibray;
