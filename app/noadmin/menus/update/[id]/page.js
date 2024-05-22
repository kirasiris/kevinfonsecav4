"use client";
import { fetchurl } from "@/helpers/setTokenOnServer";
import { useParams, useRouter } from "next/navigation";
import { useState, useEffect, useContext } from "react";
import { toast } from "react-toastify";
import AuthContext from "@/helpers/globalContext";
import AdminSidebar from "@/components/admin/adminsidebar";

const UpdateMenu = () => {
	const { auth, files } = useContext(AuthContext);
	const router = useRouter();

	// Redirect if not authenticated
	!auth.isAuthenticated && router.push("/auth/login");

	// Redirec if not founder
	auth.isAuthenticated &&
		!auth.user.role.includes("founder") &&
		router.push("/dashboard");

	const [menuData, setMenuData] = useState({
		title: `Untitled`,
		position: "top",
		status: `draft`,
	});
	const { title, position, status } = menuData;

	const [menu, setMenu] = useState(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(false);

	const { id } = useParams();
	const menuId = id;

	useEffect(() => {
		const fetchMenu = async () => {
			try {
				const res = await fetchurl(`/menus/${menuId}`, "GET", "no-cache");
				setMenu(res?.data);
				setMenuData({
					title: res?.data?.title,
					position: res?.data?.position,
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
		fetchMenu();
	}, [menuId]);

	const upgradeMenu = async (e) => {
		e.preventDefault();
		try {
			await fetchurl(`/menus/${menu._id}`, "PUT", "no-cache", {
				...menuData,
				files: { avatar: files?.selected?._id },
			});
			toast.success(`Item updated`);
			router.push(`/noadmin/menus`);
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
		setMenuData({
			title: `Untitled`,
			position: "top",
			status: `draft`,
		});
	};

	return loading || menu === null || menu === undefined ? (
		error ? (
			<>Not found</>
		) : (
			<>Loading...</>
		)
	) : (
		<form className="row" onSubmit={upgradeMenu}>
			<div className="col">
				<label htmlFor="menu-title" className="form-label">
					Title
				</label>
				<input
					id="menu-title"
					name="title"
					value={title}
					onChange={(e) => {
						setMenuData({
							...menuData,
							title: e.target.value,
						});
					}}
					type="text"
					className="form-control mb-3"
					placeholder=""
				/>
				<label htmlFor="position" className="form-label">
					Position
				</label>
				<select
					id="position"
					name="position"
					value={position}
					onChange={(e) => {
						setMenuData({
							...menuData,
							position: e.target.value,
						});
					}}
					className="form-control"
				>
					<option value={`top`}>Top</option>
					<option value={`bottom`}>Bottom</option>
				</select>
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
					github_readme={""}
					category={undefined}
					categories={[]}
					objectData={menuData}
					setObjectData={setMenuData}
					multipleFiles={false}
					onModel={"Menu"}
				/>
				<br />
				<button
					type="submit"
					className="btn btn-secondary btn-sm float-start"
					disabled={title.length > 0 ? !true : !false}
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

export default UpdateMenu;
