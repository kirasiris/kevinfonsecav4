"use client";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import AdminSidebar from "@/components/admin/adminsidebar";
import MyTextArea from "@/components/global/mytextarea";
import AuthContext from "@/helpers/globalContext";

const CreateShortUrl = () => {
	const { auth, files } = useContext(AuthContext);
	const router = useRouter();

	// Redirect if not authenticated
	!auth.isAuthenticated && router.push("/auth/login");

	// Redirec if not founder
	auth.isAuthenticated &&
		!auth.user.role.includes("founder") &&
		router.push("/dashboard");

	const [shotUrlData, setShortUrlsData] = useState({
		title: "Untitled",
		longUrl: "",
		text: "No description",
	});
	const { title, longUrl, text } = shotUrlData;

	const params = auth?.user?._id ? `?user=${auth?.user?._id}` : ``;
	console.log(params);

	const addShortUrl = async (e) => {
		e.preventDefault();
		try {
			await axios.post(`/extras/shorturls/shorten${params}`, shotUrlData);
			toast.success(`Item created`);
			router.push(`/noadmin/shorturls`);
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
		setShortUrlsData({
			title: "Untitled",
			longUrl: "",
			text: "No description",
		});
	};

	return (
		<form className="row" onSubmit={addShortUrl}>
			<div className="col">
				<label htmlFor="blog-title" className="form-label">
					Title
				</label>
				<input
					id="blog-title"
					name="title"
					value={title}
					onChange={(e) => {
						setShortUrlsData({
							...shotUrlData,
							title: e.target.value,
						});
					}}
					type="text"
					className="form-control mb-3"
					placeholder=""
				/>
				<label htmlFor="longUrl" className="form-label">
					Long Url
				</label>
				<input
					id="longUrl"
					name="longUrl"
					value={longUrl}
					onChange={(e) => {
						setShortUrlsData({
							...shotUrlData,
							longUrl: e.target.value,
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
					objectData={shotUrlData}
					setObjectData={setShortUrlsData}
					onModel="Shorturl"
					advancedTextEditor={true}
				/>
			</div>
			<div className="col-lg-3">
				{/* <AdminSidebar
					avatar={files?.selected?._id}
					status={status}
					fullWidth={fullWidth}
					password={password}
					featured={featured}
					commented={commented}
					embedding={embedding}
					github={false}
					category={category}
					categories={categories}
					objectData={shotUrlData}
					setObjectData={setShortUrlsData}
					multipleFiles={false}
					onModel={"Shorturl"}
				/> */}
				<br />
				<button
					type="submit"
					className="btn btn-secondary btn-sm float-start"
					disabled={longUrl.length > 0 && text.length > 0 ? !true : !false}
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

export default CreateShortUrl;
