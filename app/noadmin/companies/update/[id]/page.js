"use client";
import { fetchurl } from "@/helpers/setTokenOnServer";
import { useParams, useRouter } from "next/navigation";
import { useState, useEffect, useContext } from "react";
import { toast } from "react-toastify";
import AuthContext from "@/helpers/globalContext";
import AdminSidebar from "@/components/admin/adminsidebar";
import MyTextArea from "@/components/global/mytextarea";

const UpdateCompany = () => {
	const { auth, files } = useContext(AuthContext);
	const router = useRouter();

	// Redirect if not authenticated
	!auth.isAuthenticated && router.push("/auth/login");

	// Redirec if not founder
	auth.isAuthenticated &&
		!auth.user.role.includes("founder") &&
		router.push("/dashboard");

	const [companyData, setCompanyData] = useState({
		title: `Untitled`,
		avatar: files?.selected?._id,
		text: `No description`,
		address: ``,
		password: ``,
		status: `draft`,
	});
	const { title, avatar, text, address, password, status } = companyData;

	const [company, setCompany] = useState(null);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(false);

	const { id } = useParams();
	const companyId = id;

	useEffect(() => {
		const fetchCompany = async () => {
			try {
				const res = await fetchurl(
					`/companies/${companyId}`,
					"GET",
					"no-cache"
				);
				setCompany(res?.data);
				setCompanyData({
					title: res?.data?.title,
					avatar: res?.data?.files?.avatar,
					text: res?.data?.text,
					address: res?.data?.address,
					// password: res?.data?.password,
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
		fetchCompany();
	}, [companyId]);

	const upgradeCompany = async (e) => {
		e.preventDefault();
		try {
			await fetchurl(`/companies/${company._id}`, "PUT", "no-cache", {
				...companyData,
				files: { avatar: files?.selected?._id },
			});
			router.push(`/noadmin/companies`);
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
		setCompanyData({
			title: `Untitled`,
			avatar: files?.selected?._id,
			text: `No description`,
			address: ``,
			password: ``,
			status: `draft`,
		});
	};

	return loading || company === null || company === undefined ? (
		error ? (
			<>Not found</>
		) : (
			<>Loading</>
		)
	) : (
		<form className="row" onSubmit={upgradeCompany}>
			<div className="col">
				<label htmlFor="blog-title" className="form-label">
					Title
				</label>
				<input
					id="blog-title"
					name="title"
					value={title}
					onChange={(e) => {
						setCompanyData({
							...companyData,
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
					objectData={companyData}
					setObjectData={setCompanyData}
					onModel="Course"
					advancedTextEditor={false}
				/>
				<label htmlFor="address" className="form-label">
					Address
				</label>
				<input
					id="address"
					name="address"
					value={address}
					onChange={(e) => {
						setCompanyData({
							...companyData,
							address: e.target.value,
						});
					}}
					type="text"
					className="form-control mb-3"
					placeholder=""
				/>
			</div>
			<div className="col-lg-3">
				<AdminSidebar
					displayCategoryField={false}
					displayAvatar={true}
					avatar={avatar}
					status={status}
					fullWidth={false}
					password={password}
					featured={false}
					commented={false}
					embedding={false}
					github_readme={""}
					category={undefined}
					categories={[]}
					objectData={companyData}
					setObjectData={setCompanyData}
					multipleFiles={false}
					onModel={"Company"}
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

export default UpdateCompany;
