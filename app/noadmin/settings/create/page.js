import { fetchurl } from "@/helpers/setTokenOnServer";
import { redirect } from "next/navigation";
import MyTextArea from "@/components/global/myfinaltextarea";
import FormButtons from "@/components/global/formbuttons";

const CreateSetting = async ({ params, searchParams }) => {
	const addSetting = async (formData) => {
		"use server";
		const rawFormData = {
			author: formData.get("author"),
			author_email: formData.get("author_email"),
			site_url: formData.get("site_url"),
			home_url: formData.get("home_url"),
			favicon: formData.get("favicon"),
			logo: formData.get("logo"),
			charset: formData.get("charset"),
			title: formData.get("title"),
			text: formData.get("text"),
			showcase_image: formData.get("showcase_image"),
			maintenance: formData.get("maintenance"),
			address: formData.get("address"),
			language: formData.get("language"),
			google_api: formData.get("google_api"),
		};
		await fetchurl(`/settings`, "POST", "no-cache", {
			...rawFormData,
			calendar: {
				availableDays: formData.getAll("available_days"),
				timeRange: {
					start: formData.get("start_range"),
					end: formData.get("end_range"),
				},
			},
			social: {
				facebook: formData.get("facebook"),
				twitter: formData.get("twitter"),
				youtube: formData.get("youtube"),
				instagram: formData.get("instagram"),
			},
			ads: {
				first: formData.get("first_ad"),
				second: formData.get("second_ad"),
				third: formData.get("third_ad"),
				fourth: formData.get("fourth_ad"),
			},
			scripts: {
				head: formData.get("script_head"),
				footer: formData.get("script_footer"),
			},
		});
		redirect(`/noadmin/settings`);
	};

	return (
		<form className="row" action={addSetting}>
			<div className="col">
				<label htmlFor="blog-title" className="form-label">
					Title
				</label>
				<input
					id="blog-title"
					name="title"
					defaultValue=""
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
					defaultValue=""
					type="text"
					className="form-control mb-3"
					placeholder=""
				/>
				<label htmlFor="text" className="form-label">
					Text
				</label>
				<MyTextArea
					auth={undefined}
					token={undefined}
					id="text"
					name="text"
					onModel="Setting"
					advancedTextEditor={false}
					customPlaceholder="No description"
					defaultValue="No description..."
				/>
				<div className="row">
					<div className="col">
						<label htmlFor="author" className="form-label">
							Author
						</label>
						<input
							id="author"
							name="author"
							defaultValue="Kevin Uriel Fonseca"
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
							defaultValue="kebin1421@hotmail.com"
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
							defaultValue="/"
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
							defaultValue="/"
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
							defaultValue=""
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
							defaultValue=""
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
							defaultValue="UTF-8"
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
							defaultValue={false}
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
					defaultValue=""
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
					defaultValue="en-US"
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
							defaultValue=""
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
							defaultValue=""
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
							defaultValue=""
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
							defaultValue=""
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
					defaultValue=""
					type="text"
					className="form-control mb-3"
					placeholder=""
				/>
				<div className="row">
					<h1>Calendar</h1>
					<div className="col">
						<label htmlFor="available_days" className="form-label">
							Available Days
						</label>
						<select
							id="available_days"
							name="available_days"
							defaultValue=""
							className="form-control"
							multiple
						>
							<option value={`0`}>Sunday</option>
							<option value={`1`}>Monday</option>
							<option value={`2`}>Tuesday</option>
							<option value={`3`}>Wednesday</option>
							<option value={`4`}>Thursday</option>
							<option value={`5`}>Friday</option>
							<option value={`6`}>Saturday</option>
						</select>
					</div>
					<div className="col">
						<label htmlFor="start_range" className="form-label">
							Start Range
						</label>
						<input
							id="start_range"
							name="start_range"
							defaultValue=""
							type="text"
							className="form-control mb-3"
							placeholder="00:00"
						/>
						<label htmlFor="end_range" className="form-label">
							End Range
						</label>
						<input
							id="end_range"
							name="end_range"
							defaultValue=""
							type="text"
							className="form-control mb-3"
							placeholder="23:59"
						/>
					</div>
				</div>
				<div className="row">
					<h1>Ads</h1>
					<div className="col">
						<label htmlFor="first_ad" className="form-label">
							First
						</label>
						<MyTextArea
							auth={undefined}
							token={undefined}
							id="first_ad"
							name="first_ad"
							onModel="Setting"
							advancedTextEditor={false}
							customPlaceholder=""
							defaultValue=""
						/>
					</div>
					<div className="col">
						<label htmlFor="second_ad" className="form-label">
							Second
						</label>
						<MyTextArea
							auth={undefined}
							token={undefined}
							id="second_ad"
							name="second_ad"
							onModel="Setting"
							advancedTextEditor={false}
							customPlaceholder=""
							defaultValue=""
						/>
					</div>
					<div className="col">
						<label htmlFor="third_ad" className="form-label">
							Third
						</label>
						<MyTextArea
							auth={undefined}
							token={undefined}
							id="third_ad"
							name="third_ad"
							onModel="Setting"
							advancedTextEditor={false}
							customPlaceholder=""
							defaultValue=""
						/>
					</div>
					<div className="col">
						<label htmlFor="fourth_ad" className="form-label">
							Fourth
						</label>
						<MyTextArea
							auth={undefined}
							token={undefined}
							id="fourth_ad"
							name="fourth_ad"
							onModel="Setting"
							advancedTextEditor={false}
							customPlaceholder=""
							defaultValue=""
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
							auth={undefined}
							token={undefined}
							id="script_head"
							name="script_head"
							onModel="Setting"
							advancedTextEditor={false}
							customPlaceholder="Paste some JS code here"
							defaultValue=""
						/>
					</div>
					<div className="col">
						<label htmlFor="script_footer" className="form-label">
							Footer
						</label>
						<MyTextArea
							auth={undefined}
							token={undefined}
							id="script_footer"
							name="script_footer"
							onModel="Setting"
							advancedTextEditor={false}
							customPlaceholder="Paste some JS code here"
							defaultValue=""
						/>
					</div>
				</div>
				<br />
				<FormButtons />
			</div>
		</form>
	);
};

export default CreateSetting;
