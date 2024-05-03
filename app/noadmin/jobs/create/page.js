"use client";
import { fetchurl } from "@/helpers/setTokenOnServer";
import { useRouter } from "next/navigation";
import { useState, useEffect, useContext } from "react";
import { toast } from "react-toastify";
import AuthContext from "@/helpers/globalContext";
import AdminSidebar from "@/components/admin/adminsidebar";
import MyTextArea from "@/components/global/mytextarea";

const CreateJob = () => {
	const { auth, files } = useContext(AuthContext);
	const router = useRouter();

	// Redirect if not authenticated
	!auth.isAuthenticated && router.push("/auth/login");

	// Redirec if not founder
	auth.isAuthenticated &&
		!auth.user.role.includes("founder") &&
		router.push("/dashboard");

	const [jobData, setJobData] = useState({
		title: `Untitled`,
		text: `No description`,
		featured: true,
		positionFilled: false,
		experience_level: "graduate",
		job_type: "full-time",
		provides_training: true,
		security_clearance: false,
		commented: true,
		password: ``,
		status: `draft`,
	});
	const {
		title,
		text,
		featured,
		positionFilled,
		experience_level,
		job_type,
		provides_training,
		security_clearance,
		commented,
		password,
		status,
	} = jobData;

	const addJob = async (e) => {
		e.preventDefault();
		try {
			await fetchurl(`/jobs`, "POST", "no-cache", {
				...jobData,
				// files: { avatar: files?.selected?._id },
			});
			toast.success(`Item created`);
			resetForm();
			router.push(`/noadmin/jobs`);
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
		setJobData({
			title: `Untitled`,
			text: `No description`,
			featured: true,
			positionFilled: false,
			experience_level: "graduate",
			job_type: "full-time",
			provides_training: true,
			security_clearance: false,
			commented: true,
			password: ``,
			status: `draft`,
		});
	};

	return (
		<form className="row" onSubmit={addJob}>
			<div className="col">
				<label htmlFor="blog-title" className="form-label">
					Title
				</label>
				<input
					id="blog-title"
					name="title"
					value={title}
					onChange={(e) => {
						setJobData({
							...jobData,
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
					objectData={jobData}
					setObjectData={setJobData}
					onModel="Job"
					advancedTextEditor={true}
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
					featured={featured}
					commented={commented}
					embedding={false}
					github_readme={""}
					category={undefined}
					categories={[]}
					objectData={jobData}
					setObjectData={setJobData}
					multipleFiles={false}
					onModel={"Job"}
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

export default CreateJob;
