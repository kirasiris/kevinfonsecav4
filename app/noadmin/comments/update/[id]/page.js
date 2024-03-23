"use client";
import { fetchurl } from "@/helpers/setTokenOnServer";
import { useParams, useRouter } from "next/navigation";
import { useState, useEffect, useContext } from "react";
import { toast } from "react-toastify";
import AuthContext from "@/helpers/globalContext";
import AdminSidebar from "@/components/admin/adminsidebar";
import MyTextArea from "@/components/global/mytextarea";

const UpdateComment = () => {
	const { auth } = useContext(AuthContext);
	const router = useRouter();

	// Redirect if not authenticated
	!auth.isAuthenticated && router.push("/auth/login");

	// Redirec if not founder
	auth.isAuthenticated &&
		!auth.user.role.includes("founder") &&
		router.push("/dashboard");

	const [commentData, setCommentData] = useState({
		title: `Untitled`,
		text: `No description`,
		status: `draft`,
	});
	const { title, text, status } = commentData;

	const [comment, setComment] = useState(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(false);

	const { id } = useParams();
	const commentId = id;

	useEffect(() => {
		const fetchComment = async () => {
			try {
				const res = await fetchurl(`/comments/${commentId}`, "GET", "no-cache");
				setComment(res?.data);
				setCommentData({
					title: res?.data?.title,
					text: res?.data?.text,
					status: res?.data?.status,
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
		fetchComment();
	}, [commentId]);

	const upgradeComment = async (e) => {
		e.preventDefault();
		try {
			await fetchurl(
				`/comments/${comment._id}`,
				"PUT",
				"no-cache",
				commentData
			);
			toast.success(`Item updated`);
			router.push(`/noadmin/comments`);
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
		setCommentData({
			title: `Untitled`,
			text: `No description`,
			status: `draft`,
		});
	};

	return loading || comment === null || comment === undefined ? (
		error ? (
			<>Not found</>
		) : (
			<>Loading...</>
		)
	) : (
		<form className="row" onSubmit={upgradeComment}>
			<div className="col">
				<label htmlFor="comment-title" className="form-label">
					Title
				</label>
				<input
					id="comment-title"
					name="title"
					value={title}
					onChange={(e) => {
						setCommentData({
							...commentData,
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
					objectData={commentData}
					setObjectData={setCommentData}
					onModel="Comment"
					advancedTextEditor={false}
				/>
			</div>
			<div className="col-lg-3">
				<AdminSidebar
					displayCategoryField={false}
					displayAvatar={false}
					avatar={""}
					status={status}
					fullWidth={false}
					password={""}
					featured={false}
					commented={false}
					embedding={false}
					github={false}
					github_readme=""
					category={undefined}
					categories={[]}
					objectData={commentData}
					setObjectData={setCommentData}
					multipleFiles={false}
					onModel={"Comment"}
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

export default UpdateComment;
