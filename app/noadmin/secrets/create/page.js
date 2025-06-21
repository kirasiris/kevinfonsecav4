import { redirect } from "next/navigation";
import { fetchurl } from "@/helpers/setTokenOnServer";
import MyTextArea from "@/components/global/myfinaltextarea";
import FormButtons from "@/components/global/formbuttons";

const CreateSecret = async ({ params, searchParams }) => {
	const addSecret = async (formData) => {
		"use server";
		const rawFormData = {
			title: formData.get("title"),
			text: formData.get("text"),
			password: formData.get("password"),
			age: formData.get("age"),
			sex: formData.get("sex"),
			state: formData.get("state"),
			nsfw: formData.get("nsfw"),
			commented: formData.get("commented"),
			deletable: formData.get("deletable"),
		};

		await fetchurl(`/noadmin/secrets`, "POST", "no-cache", {
			...rawFormData,
			status: "published",
		});
		redirect(`/noadmin/secrets`);
	};

	return (
		<form className="row" action={addSecret}>
			<div className="col">
				<label htmlFor="blog-title" className="form-label">
					Title
				</label>
				<input
					id="blog-title"
					name="title"
					defaultValue="Untitled"
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
					defaultValue="No description..."
					onModel="Secret"
					advancedTextEditor={false}
					customPlaceholder="No description"
				/>
				<label htmlFor="password" className="form-label">
					Password
				</label>
				<input
					id="password"
					name="password"
					type="password"
					className="form-control mb-3"
					placeholder="******"
				/>
				<div className="row">
					<div className="col">
						<label htmlFor="age" className="form-label">
							Age
						</label>
						<input
							id="age"
							name="age"
							type="number"
							className="form-control mb-3"
							min={13}
							max={100}
							placeholder="Enter age"
						/>
					</div>
					<div className="col">
						<label htmlFor="sex" className="form-label">
							Sex
						</label>
						<select id="sex" name="sex" className="form-control mb-3">
							<option value={`male`}>Male</option>
							<option value={`female`}>Female</option>
							<option value={`non-binary`}>Non-binary</option>
						</select>
					</div>
					<div className="col">
						<label htmlFor="state" className="form-label">
							State
						</label>
						<select id="state" name="state" className="form-control mb-3">
							<option value={`AL`}>Alabama</option>
							<option value={`AK`}>Alaska</option>
							<option value={`AZ`}>Arizona</option>
							<option value={`AR`}>Arkansas</option>
							<option value={`CA`}>California</option>
							<option value={`CO`}>Colorado</option>
							<option value={`CT`}>Connecticut</option>
							<option value={`DE`}>Delaware</option>
							<option value={`FL`}>Florida</option>
							<option value={`GA`}>Georgia</option>
							<option value={`HI`}>Hawaii</option>
							<option value={`ID`}>Idaho</option>
							<option value={`IL`}>Illinois</option>
							<option value={`IN`}>Indiana</option>
							<option value={`IA`}>Iowa</option>
							<option value={`KS`}>Kansas</option>
							<option value={`KY`}>Kentucky</option>
							<option value={`LA`}>Louisiana</option>
							<option value={`ME`}>Maine</option>
							<option value={`MD`}>Maryland</option>
							<option value={`MA`}>Massachusetts</option>
							<option value={`MI`}>Michigan</option>
							<option value={`MN`}>Minnesota</option>
							<option value={`MS`}>Mississippi</option>
							<option value={`MO`}>Missouri</option>
							<option value={`MT`}>Montana</option>
							<option value={`NE`}>Nebraska</option>
							<option value={`NV`}>Nevada</option>
							<option value={`NH`}>New Hampshire</option>
							<option value={`NJ`}>New Jersey</option>
							<option value={`NM`}>New Mexico</option>
							<option value={`NY`}>New York</option>
							<option value={`NC`}>North Carolina</option>
							<option value={`ND`}>North Dakota</option>
							<option value={`OH`}>Ohio</option>
							<option value={`OK`}>Oklahoma</option>
							<option value={`OR`}>Oregon</option>
							<option value={`PA`}>Pennsylvania</option>
							<option value={`RI`}>Rhode Island</option>
							<option value={`SC`}>South Carolina</option>
							<option value={`SD`}>South Dakota</option>
							<option value={`TN`}>Tennessee</option>
							<option value={`TX`}>Texas</option>
							<option value={`UT`}>Utah</option>
							<option value={`VT`}>Vermont</option>
							<option value={`VA`}>Virginia</option>
							<option value={`WA`}>Washington</option>
							<option value={`WV`}>West Virginia</option>
							<option value={`WI`}>Wisconsin</option>
							<option value={`WY`}>Wyoming</option>
							<option value={`DC`}>District of Columbia</option>
							<option value={`AS`}>American Samoa</option>
							<option value={`GU`}>Guam</option>
							<option value={`MP`}>Northern Mariana Islands</option>
							<option value={`PR`}>Puerto Rico</option>
							<option value={`JA-UM`}>Johnston Atoll Island</option>
							<option value={`MI-UM`}>Midway Island</option>
							<option value={`WI-UM`}>Wake Island</option>
							<option value={`VI`}>Virgin Islands, U.S.</option>
						</select>
					</div>
				</div>
				<div className="row">
					<div className="col">
						<label htmlFor="nsfw" className="form-label">
							NSFW
						</label>
						<select id="nsfw" name="nsfw" className="form-control mb-3">
							<option value={true}>Yes</option>
							<option value={false}>No</option>
						</select>
					</div>
					<div className="col">
						<label htmlFor="commented" className="form-label">
							Commented
						</label>
						<select
							id="commented"
							name="commented"
							className="form-control mb-3"
						>
							<option value={true}>Yes</option>
							<option value={false}>No</option>
						</select>
					</div>
					<div className="col">
						<label htmlFor="deletable" className="form-label">
							Deletable
						</label>
						<select
							id="deletable"
							name="deletable"
							className="form-control mb-3"
						>
							<option value={true}>Yes</option>
							<option value={false}>No</option>
						</select>
					</div>
				</div>
				<br />
				<FormButtons />
			</div>
		</form>
	);
};

export default CreateSecret;
