"use client";
import { fetchurl } from "@/helpers/setTokenOnServer";
import { useParams, useRouter } from "next/navigation";
import { useState, useEffect, useContext } from "react";
import { toast } from "react-toastify";
import AuthContext from "@/helpers/globalContext";
import AdminSidebar from "@/components/admin/adminsidebar";
import MyTextArea from "@/components/global/mytextarea";

const UpdateTheme = () => {
	const { auth, files } = useContext(AuthContext);
	const router = useRouter();

	// Redirect if not authenticated
	!auth.isAuthenticated && router.push("/auth/login");

	// Redirec if not founder
	auth.isAuthenticated &&
		!auth.user.role.includes("founder") &&
		router.push("/dashboard");

	const [categories, setCategories] = useState([]);

	const fetchCategories = async (params = "") => {
		try {
			const res = await fetchurl(`/categories${params}`, "GET", "no-cache");
			setCategories(res?.data);
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
		fetchCategories(`?categoryType=theme`);
	}, []);

	const [themeData, setThemeData] = useState({
		title: `Untitled`,
		avatar: files?.selected?._id,
		text: `No description`,
		featured: true,
		embedding: true,
		category: undefined,
		commented: true,
		password: ``,
		status: `draft`,
		fullWidth: false,
		github_readme: `#`,
	});

	const {
		title,
		avatar,
		text,
		featured,
		embedding,
		category,
		commented,
		password,
		status,
		fullWidth,
		github_readme,
	} = themeData;

	const [theme, setTheme] = useState(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(false);

	const { id } = useParams();
	const themeId = id;

	useEffect(() => {
		const fetchTheme = async () => {
			try {
				const res = await fetchurl(`/themes/${themeId}`, "GET", "no-cache");
				setTheme(res?.data);
				setThemeData({
					title: res?.data?.title,
					avatar: res?.data?.files?.avatar,
					text: res?.data?.text,
					featured: res?.data?.featured,
					embedding: res?.data?.embedding,
					category: res?.data?.category,
					commented: res?.data?.commented,
					// password: res?.data?.password,
					status: res?.data?.status,
					fullWidth: res?.data?.fullWidth,
					github_readme: res?.data?.github_readme,
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
		fetchTheme();
	}, [themeId]);

	const upgradeTheme = async (e) => {
		e.preventDefault();
		try {
			await fetchurl(`/themes/${theme._id}`, "PUT", "no-cache", {
				...themeData,
				files: { avatar: files?.selected?._id },
			});
			toast.success(`Item updated`);
			router.push(`/noadmin/themes`);
		} catch (err) {
			console.log(err);
			// const error = err.respgfonse.data.message;
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
		setThemeData({
			title: `Untitled`,
			avatar: files?.selected?._id,
			text: ``,
			featured: false,
			embedding: false,
			category: undefined,
			commented: false,
			password: ``,
			tags: [],
			status: `draft`,
			fullWidth: false,
			github_readme: ``,
		});
	};

	return loading || theme === null || theme === undefined ? (
		error ? (
			<>Not found</>
		) : (
			<>Loading... {console.log(error)}</>
		)
	) : (
		<form className="row" onSubmit={upgradeTheme}>
			<div className="col">
				<label htmlFor="blog-title" className="form-label">
					Title
				</label>
				<input
					id="blog-title"
					name="title"
					value={title}
					onChange={(e) => {
						setThemeData({
							...themeData,
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
					objectData={themeData}
					setObjectData={setThemeData}
					onModel="Blog"
					advancedTextEditor={true}
				/>
			</div>
			<div className="col-lg-3">
				<AdminSidebar
					avatar={avatar}
					status={status}
					fullWidth={fullWidth}
					password={password}
					featured={featured}
					commented={commented}
					embedding={embedding}
					github_readme={github_readme}
					category={category}
					categories={categories}
					objectData={themeData}
					setObjectData={setThemeData}
					multipleFiles={true}
					onModel={"Blog"}
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

export default UpdateTheme;
