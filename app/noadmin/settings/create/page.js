"use client";
import { fetchurl } from "@/helpers/setTokenOnServer";
import { useRouter } from "next/navigation";
import { useState, useContext } from "react";
import { toast } from "react-toastify";
import AuthContext from "@/helpers/globalContext";
import MyTextArea from "@/components/global/mytextarea";

const CreateSetting = () => {
	const { auth } = useContext(AuthContext);
	const router = useRouter();

	// Redirect if not authenticated
	!auth.isAuthenticated && router.push("/auth/login");

	// Redirec if not founder
	auth.isAuthenticated &&
		!auth.user.role.includes("founder") &&
		router.push("/dashboard");

	const [settingData, setSettingData] = useState({
		author: "Kevin Uriel Fonseca",
		author_email: "kebin1421@hotmail.com",
		site_url: "",
		home_url: "",
		favicon: "",
		logo: "",
		charset: "UTF-8",
		title: "Kevin Uriel Fonseca",
		text: "",
		showcase_image: "",
		maintenance: false,
		address: "",
		language: "en-US",
		facebook: "",
		twitter: "",
		youtube: "",
		instagram: "",
		google_api: "",
		first_ad: "",
		second_ad: "",
		third_ad: "",
		fourth_ad: "",
		script_head: "",
		script_footer: "",
	});
	const {
		author,
		author_email,
		site_url,
		home_url,
		favicon,
		logo,
		charset,
		title,
		text,
		showcase_image,
		maintenance,
		address,
		language,
		facebook,
		twitter,
		youtube,
		instagram,
		google_api,
		first_ad,
		second_ad,
		third_ad,
		fourth_ad,
		script_head,
		script_footer,
	} = settingData;

	const addSetting = async (e) => {
		e.preventDefault();
		try {
			await fetchurl(`/settings`, "POST", "no-cache", settingData);
			router.push(`/noadmin/settings`);
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
		setSettingData({
			author: "Kevin Uriel Fonseca",
			author_email: "kebin1421@hotmail.com",
			site_url: "",
			home_url: "",
			favicon: "",
			logo: "",
			charset: "UTF-8",
			title: "Kevin Uriel Fonseca",
			text: "",
			showcase_image: "",
			maintenance: false,
			address: "",
			language: "en-US",
			facebook: "",
			twitter: "",
			youtube: "",
			instagram: "",
			google_api: "",
			first_ad: "",
			second_ad: "",
			third_ad: "",
			fourth_ad: "",
			script_head: "",
			script_footer: "",
		});
	};

	return (
		<form className="row" onSubmit={addSetting}>
			<div className="col">
				<label htmlFor="blog-title" className="form-label">
					Title
				</label>
				<input
					id="blog-title"
					name="title"
					value={title}
					onChange={(e) => {
						setSettingData({
							...settingData,
							title: e.target.value,
						});
					}}
					type="text"
					className="form-control mb-3"
					placeholder=""
				/>
				<label htmlFor="showcase_image" className="form-label">
					Showcase Image
				</label>
				<input
					id="showcase_image"
					name="showcase_image"
					value={showcase_image}
					onChange={(e) => {
						setSettingData({
							...settingData,
							showcase_image: e.target.value,
						});
					}}
					type="text"
					className="form-control mb-3"
					placeholder=""
				/>
				<label htmlFor="blog-text multipurpose-textarea" className="form-label">
					Text
				</label>
				<MyTextArea
					id="blog-text multipurpose-textarea"
					name="text"
					value={text}
					objectData={settingData}
					setObjectData={setSettingData}
					onModel="Setting"
					advancedTextEditor={false}
				/>
				<div className="row">
					<div className="col">
						<label htmlFor="author" className="form-label">
							Author
						</label>
						<input
							id="author"
							name="author"
							value={author}
							onChange={(e) => {
								setSettingData({
									...settingData,
									author: e.target.value,
								});
							}}
							type="text"
							className="form-control mb-3"
							placeholder=""
						/>
					</div>
					<div className="col">
						<label htmlFor="author_email" className="form-label">
							Author Email
						</label>
						<input
							id="author_email"
							name="author_email"
							value={author_email}
							onChange={(e) => {
								setSettingData({
									...settingData,
									author_email: e.target.value,
								});
							}}
							type="text"
							className="form-control mb-3"
							placeholder=""
						/>
					</div>
				</div>
				<div className="row">
					<div className="col">
						<label htmlFor="site_url" className="form-label">
							Site Url
						</label>
						<input
							id="site_url"
							name="site_url"
							value={site_url}
							onChange={(e) => {
								setSettingData({
									...settingData,
									site_url: e.target.value,
								});
							}}
							type="text"
							className="form-control mb-3"
							placeholder=""
						/>
					</div>
					<div className="col">
						<label htmlFor="home_url" className="form-label">
							Home Url
						</label>
						<input
							id="home_url"
							name="home_url"
							value={home_url}
							onChange={(e) => {
								setSettingData({
									...settingData,
									home_url: e.target.value,
								});
							}}
							type="text"
							className="form-control mb-3"
							placeholder=""
						/>
					</div>
				</div>
				<div className="row">
					<div className="col">
						<label htmlFor="favicon" className="form-label">
							Favicon
						</label>
						<input
							id="favicon"
							name="favicon"
							value={favicon}
							onChange={(e) => {
								setSettingData({
									...settingData,
									favicon: e.target.value,
								});
							}}
							type="text"
							className="form-control mb-3"
							placeholder=""
						/>
					</div>
					<div className="col">
						<label htmlFor="logo" className="form-label">
							Logo
						</label>
						<input
							id="logo"
							name="logo"
							value={logo}
							onChange={(e) => {
								setSettingData({
									...settingData,
									logo: e.target.value,
								});
							}}
							type="text"
							className="form-control mb-3"
							placeholder=""
						/>
					</div>
					<div className="col">
						<label htmlFor="charset" className="form-label">
							Charset
						</label>
						<input
							id="charset"
							name="charset"
							value={charset}
							onChange={(e) => {
								setSettingData({
									...settingData,
									charset: e.target.value,
								});
							}}
							type="text"
							className="form-control mb-3"
							placeholder=""
						/>
					</div>
					<div className="col">
						<label htmlFor="maintenance" className="form-label">
							Maintenance Mode
						</label>
						<select
							id="maintenance"
							name="maintenance"
							value={maintenance}
							onChange={(e) => {
								setSettingData({
									...settingData,
									maintenance: e.target.value,
								});
							}}
							className="form-control"
						>
							<option value={true}>Yes</option>
							<option value={false}>No</option>
						</select>
					</div>
				</div>
				<label htmlFor="address" className="form-label">
					Address
				</label>
				<input
					id="address"
					name="address"
					value={address}
					onChange={(e) => {
						setSettingData({
							...settingData,
							address: e.target.value,
						});
					}}
					type="text"
					className="form-control mb-3"
					placeholder=""
				/>
				<label htmlFor="language" className="form-label">
					Language
				</label>
				<input
					id="language"
					name="language"
					value={language}
					onChange={(e) => {
						setSettingData({
							...settingData,
							language: e.target.value,
						});
					}}
					type="text"
					className="form-control mb-3"
					placeholder=""
				/>
				<div className="row">
					<div className="col">
						<label htmlFor="facebook" className="form-label">
							Facebook
						</label>
						<input
							id="facebook"
							name="facebook"
							value={facebook}
							onChange={(e) => {
								setSettingData({
									...settingData,
									facebook: e.target.value,
								});
							}}
							type="text"
							className="form-control mb-3"
							placeholder=""
						/>
					</div>
					<div className="col">
						<label htmlFor="twitter" className="form-label">
							Twitter
						</label>
						<input
							id="twitter"
							name="twitter"
							value={twitter}
							onChange={(e) => {
								setSettingData({
									...settingData,
									twitter: e.target.value,
								});
							}}
							type="text"
							className="form-control mb-3"
							placeholder=""
						/>
					</div>
					<div className="col">
						<label htmlFor="youtube" className="form-label">
							YouTube
						</label>
						<input
							id="youtube"
							name="youtube"
							value={youtube}
							onChange={(e) => {
								setSettingData({
									...settingData,
									youtube: e.target.value,
								});
							}}
							type="text"
							className="form-control mb-3"
							placeholder=""
						/>
					</div>
					<div className="col">
						<label htmlFor="instagram" className="form-label">
							Instagram
						</label>
						<input
							id="instagram"
							name="instagram"
							value={instagram}
							onChange={(e) => {
								setSettingData({
									...settingData,
									instagram: e.target.value,
								});
							}}
							type="text"
							className="form-control mb-3"
							placeholder=""
						/>
					</div>
				</div>
				<label htmlFor="google_api" className="form-label">
					Google API
				</label>
				<input
					id="google_api"
					name="google_api"
					value={google_api}
					onChange={(e) => {
						setSettingData({
							...settingData,
							google_api: e.target.value,
						});
					}}
					type="text"
					className="form-control mb-3"
					placeholder=""
				/>
				<div className="row">
					<h1>Ads</h1>
					<div className="col">
						<label htmlFor="first_ad" className="form-label">
							First
						</label>
						<MyTextArea
							id="first_ad"
							name="text"
							value={first_ad}
							objectData={settingData}
							setObjectData={setSettingData}
							onModel="Setting"
							advancedTextEditor={false}
						/>
					</div>
					<div className="col">
						<label htmlFor="second_ad" className="form-label">
							Second
						</label>
						<MyTextArea
							id="second_ad"
							name="text"
							value={second_ad}
							objectData={settingData}
							setObjectData={setSettingData}
							onModel="Setting"
							advancedTextEditor={false}
						/>
					</div>
					<div className="col">
						<label htmlFor="third_ad" className="form-label">
							Third
						</label>
						<MyTextArea
							id="third_ad"
							name="text"
							value={third_ad}
							objectData={settingData}
							setObjectData={setSettingData}
							onModel="Setting"
							advancedTextEditor={false}
						/>
					</div>
					<div className="col">
						<label htmlFor="fourth_ad" className="form-label">
							Fourth
						</label>
						<MyTextArea
							id="fourth_ad"
							name="text"
							value={fourth_ad}
							objectData={settingData}
							setObjectData={setSettingData}
							onModel="Setting"
							advancedTextEditor={false}
						/>
					</div>
				</div>
				<div className="row">
					<h1>Scripts</h1>
					<div className="col">
						<label htmlFor="script_head" className="form-label">
							Head
						</label>
						<MyTextArea
							id="script_head"
							name="text"
							value={script_head}
							objectData={settingData}
							setObjectData={setSettingData}
							onModel="Setting"
							advancedTextEditor={false}
						/>
					</div>
					<div className="col">
						<label htmlFor="script_footer" className="form-label">
							Footer
						</label>
						<MyTextArea
							id="script_footer"
							name="text"
							value={script_footer}
							objectData={settingData}
							setObjectData={setSettingData}
							onModel="Setting"
							advancedTextEditor={false}
						/>
					</div>
				</div>
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

export default CreateSetting;
