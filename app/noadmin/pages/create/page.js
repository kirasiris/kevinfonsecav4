"use client";
import { fetchurl } from "@/helpers/setTokenOnServer";
import { useRouter } from "next/navigation";
import { useState, useEffect, useContext } from "react";
import { toast } from "react-toastify";
import AuthContext from "@/helpers/globalContext";
import AdminSidebar from "@/components/admin/adminsidebar";
import MyTextArea from "@/components/global/mytextarea";

const CreatePage = () => {
	const { auth } = useContext(AuthContext);
	const router = useRouter();

	// Redirect if not authenticated
	!auth.isAuthenticated && router.push("/auth/login");

	// Redirec if not founder
	auth.isAuthenticated &&
		!auth.user.role.includes("founder") &&
		router.push("/dashboard");

	const [pageData, setPageData] = useState({
		title: `Untitled`,
		text: `No description`,
		referrerpolicy: "strict-origin-when-cross-origin",
		rel: "no-referrer",
		target: "_self",
		commented: true,
		password: ``,
		status: `draft`,
	});
	const {
		title,
		text,
		referrerpolicy,
		rel,
		target,
		commented,
		password,
		status,
	} = pageData;

	const addPage = async (e) => {
		e.preventDefault();
		try {
			await fetchurl(`/pages`, "POST", "no-cache", pageData);
			toast.success(`Item created`);
			resetForm();
			router.push(`/noadmin/pages`);
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
		setPageData({
			title: `Untitled`,
			text: `No description`,
			referrerpolicy: "strict-origin-when-cross-origin",
			rel: "no-referrer",
			target: "_self",
			commented: true,
			password: ``,
			status: `draft`,
		});
	};

	return (
		<form className="row" onSubmit={addPage}>
			<div className="col">
				<label htmlFor="blog-title" className="form-label">
					Title
				</label>
				<input
					id="blog-title"
					name="title"
					value={title}
					onChange={(e) => {
						setPageData({
							...pageData,
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
					objectData={pageData}
					setObjectData={setPageData}
					onModel="Page"
					advancedTextEditor={true}
				/>
				<div className="row">
					<div className="col"></div>
				</div>
				<div className="row">
					<div className="col">
						<label htmlFor="referrerpolicy" className="form-label">
							Referrer Policy
						</label>
						<select
							id="referrerpolicy"
							name="referrerpolicy"
							value={referrerpolicy}
							onChange={(e) => {
								setPageData({
									...pageData,
									referrerpolicy: e.target.value,
								});
							}}
							className="form-control"
						>
							<option value={`no-referrer`}>No Referrer</option>
							<option value={`no-referrer-when-downgrade`}>
								No Referrer When Downgrade
							</option>
							<option value={`origin`}>Origin</option>
							<option value={`origin-when-cross-origin`}>
								Origin When Cross Origin
							</option>
							<option value={`same-origin`}>Same Origin</option>
							<option value={`strict-origin`}>Strict Origin</option>
							<option value={`strict-origin-when-cross-origin`}>
								String Origin When Cross Origin
							</option>
							<option value={`unsafe-url`}>Unsafe Url</option>
						</select>
					</div>
					<div className="col">
						<label htmlFor="rel" className="form-label">
							Rel
						</label>
						<select
							id="rel"
							name="rel"
							value={rel}
							onChange={(e) => {
								setPageData({
									...pageData,
									rel: e.target.value,
								});
							}}
							className="form-control"
						>
							<option value={`no-referrer`}>No Referrer</option>
						</select>
					</div>
					<div className="col">
						<label htmlFor="target" className="form-label">
							Target
						</label>
						<select
							id="target"
							name="target"
							value={target}
							onChange={(e) => {
								setPageData({
									...pageData,
									target: e.target.value,
								});
							}}
							className="form-control"
						>
							<option value={`_self`}>Self</option>
							<option value={`_blank`}>Blank</option>
							<option value={`_parent`}>Parent</option>
							<option value={`_top`}>Top</option>
							<option value={`_unfencedTop`}>Unfenced Top</option>
						</select>
					</div>
				</div>
			</div>
			<div className="col-lg-3">
				<AdminSidebar
					displayCategoryField={false}
					displayAvatar={false}
					avatar={""}
					status={status}
					fullWidth={false}
					password={password}
					featured={false}
					commented={commented}
					embedding={false}
					github_readme={""}
					category={undefined}
					categories={[]}
					objectData={pageData}
					setObjectData={setPageData}
					multipleFiles={false}
					onModel={"Page"}
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

export default CreatePage;
