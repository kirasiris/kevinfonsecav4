"use client";
import { fetchurl } from "@/helpers/setTokenOnServer";
import { useParams, useRouter } from "next/navigation";
import { useState, useEffect, useContext } from "react";
import { toast } from "react-toastify";
import AuthContext from "@/helpers/globalContext";
import AdminSidebar from "@/components/admin/adminsidebar";
import MyTextArea from "@/components/global/mytextarea";
import LiveCode from "@/components/admin/snippets/livecode";

const UpdateSnippet = () => {
	const { auth } = useContext(AuthContext);
	const router = useRouter();

	// Redirect if not authenticated
	!auth.isAuthenticated && router.push("/auth/login");

	// Redirec if not founder
	auth.isAuthenticated &&
		!auth.user.role.includes("founder") &&
		router.push("/dashboard");

	const [snippetData, setSnippetData] = useState({
		title: `Untitled`,
		text: `No description`,
		html: "<h1>Title</h1>",
		css: "body {}",
		csslinks: [
			"https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css",
		],
		js: "console.log('This example contains external urls from Bootstrap!');",
		jslinks: [
			"https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js",
		],
		featured: true,
		commented: true,
		status: `draft`,
	});

	const {
		title,
		text,
		html,
		css,
		csslinks,
		js,
		jslinks,
		featured,
		commented,
		status,
	} = snippetData;

	const [snippet, setSnippet] = useState(null);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(false);

	const { id } = useParams();
	const snippetId = id;

	useEffect(() => {
		const fetchSnippet = async () => {
			try {
				const res = await fetchurl(`/snippets/${snippetId}`, "GET", "no-cache");
				setSnippet(res?.data);
				setSnippetData({
					title: res?.data?.title,
					text: res?.data?.text,
					html: res?.data?.code?.html,
					css: res?.data?.code?.css,
					csslinks: res?.data?.csslinks,
					js: res?.data?.code?.javascript,
					jslinks: res?.data?.jslinks,
					featured: res?.data?.featured,
					commented: res?.data?.commented,
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
		fetchSnippet();
	}, [snippetId]);

	const upgradeSnippet = async (e) => {
		e.preventDefault();
		try {
			const res = await fetchurl(
				`/snippets/${snippet._id}`,
				"PUT",
				"no-cache",
				snippetData
			);
			toast.success(`Item updated`);
			resetForm();
			router.push(`/noadmin/snippets`);
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
		setSnippetData({
			title: `Untitled`,
			text: `No description`,
			html: "<h1>Title</h1>",
			css: "body {}",
			csslinks: [
				"https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css",
			],
			js: "console.log('This example contains external urls from Bootstrap!');",
			jslinks: [
				"https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js",
			],
			featured: true,
			commented: true,
			status: `draft`,
		});
	};

	return loading || snippet === null || snippet === undefined ? (
		error ? (
			<>Not found</>
		) : (
			<>Loading</>
		)
	) : (
		<form onSubmit={upgradeSnippet}>
			<div className="row">
				<div className="col">
					<label htmlFor="blog-title" className="form-label">
						Title
					</label>
					<input
						id="blog-title"
						name="title"
						value={title}
						onChange={(e) => {
							setSnippetData({
								...snippetData,
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
						objectData={snippetData}
						setObjectData={setSnippetData}
						onModel="Snippet"
						advancedTextEditor={false}
					/>
				</div>
				<div className="col-lg-2">
					<AdminSidebar
						displayCategoryField={false}
						displayAvatar={false}
						avatar={""}
						status={status}
						fullWidth={false}
						password={""}
						featured={featured}
						commented={commented}
						embedding={false}
						github_readme={""}
						category={undefined}
						categories={[]}
						objectData={snippetData}
						setObjectData={setSnippetData}
						multipleFiles={false}
						onModel={"Snippet"}
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
				<div className="mt-3 mb-3" />
				<div className="col-lg-12">
					<LiveCode
						objectData={snippetData}
						setObjectData={setSnippetData}
						hasId={true}
					/>
				</div>
			</div>
		</form>
	);
};

export default UpdateSnippet;
