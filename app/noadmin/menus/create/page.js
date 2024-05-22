"use client";
import { fetchurl } from "@/helpers/setTokenOnServer";
import { useRouter } from "next/navigation";
import { useState, useContext } from "react";
import { toast } from "react-toastify";
import AuthContext from "@/helpers/globalContext";
import AdminSidebar from "@/components/admin/adminsidebar";

const CreateMenu = () => {
	const { auth } = useContext(AuthContext);
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

	const addMenu = async (e) => {
		e.preventDefault();
		try {
			await fetchurl(`/menus`, "POST", "no-cache", menuData);
			toast.success(`Item created`);
			resetForm();
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

	return (
		<form className="row" onSubmit={addMenu}>
			<div className="col">
				<label htmlFor="blog-title" className="form-label">
					Title
				</label>
				<input
					id="blog-title"
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

export default CreateMenu;
