"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { fetchurl } from "@/helpers/setTokenOnServer";
import AdminSidebar from "@/components/noadmin/myfinaladminsidebar";
import MyTextArea from "@/components/global/myfinaltextarea";
import FormButtons from "@/components/global/formbuttons";

const toId = (value) => {
	if (!value) {
		return "";
	}
	if (typeof value === "string" || typeof value === "number") {
		return String(value);
	}
	return String(value._id || value.id || "");
};

const toMention = (value) =>
	typeof value === "string" || typeof value === "number"
		? { id: String(value), username: "" }
		: { id: toId(value), username: value?.username || "" };

const UpdatePageForm = ({
	token = {},
	auth = {},
	object = {},
	params = {},
}) => {
	const router = useRouter();

	const [btnText, setBtnText] = useState(`Submit`);

	const savedFiles = Array.isArray(object?.data?.files?.extras)
		? object?.data?.files.extras
		: [];

	const updatePage = async (e) => {
		e.preventDefault();
		setBtnText(`Processing...`);
		const form = e.target;
		const formData = new FormData(form);

		const text = formData.get("text") || "";
		const mentions = JSON.parse(formData.get("text_users") || "[]");
		const tags = JSON.parse(formData.get("text_hashtags") || "[]");
		const extras = JSON.parse(formData.get("text_files") || "[]");

		const bodyUnchanged = text === (object?.data?.text || "");

		const rawFormData = {
			title: formData.get("title"),
			url: formData.get("url"),
			text: formData.get("text"),
			mentions:
				bodyUnchanged && !mentions.length
					? (object?.data?.mentions || []).map(toMention)
					: mentions,
			tags: bodyUnchanged && !tags.length ? object?.data?.tags || [] : tags,
			referrerpolicy: formData.get("referrerpolicy"),
			rel: formData.get("rel"),
			target: formData.get("target"),
			orderingNumber: formData.get("orderingNumber"),
			files: {
				extras:
					bodyUnchanged && !extras.length
						? savedFiles.map(toId).filter(Boolean)
						: extras,
			},
			commented: formData.get("commented"),
			password: formData.get("password"),
			status: formData.get("status"),
		};

		const res = await fetchurl(
			`/noadmin/pages/${params.id}`,
			"PUT",
			"no-cache",
			rawFormData,
			undefined,
			false,
			false,
		);

		if (res.status === "error") {
			toast.error(res.message);
			setBtnText(btnText);
			return;
		}
		if (res.status === "fail") {
			toast.error(res.message);
			setBtnText(btnText);
			return;
		}
		toast.success(`Menu page updated`);
		router.push(`/noadmin/menus/read/${object?.data?.resourceId?._id}`);
	};

	return (
		<form key={object?.data?._id} className="row" onSubmit={updatePage}>
			<div className="col">
				<label htmlFor="title" className="form-label">
					Title
				</label>
				<input
					id="title"
					name="title"
					defaultValue={object?.data?.title}
					type="text"
					className="form-control mb-3"
					placeholder=""
				/>
				<label htmlFor="url" className="form-label">
					Url
				</label>
				<input
					id="url"
					name="url"
					defaultValue={object?.data?.url}
					type="text"
					className="form-control mb-3"
					placeholder=""
				/>
				<label htmlFor="text" className="form-label">
					Text
				</label>
				<MyTextArea
					auth={auth}
					token={token}
					id="text"
					name="text"
					defaultValue={object?.data?.text}
					defaultFiles={savedFiles}
					onModel="Page"
					advancedTextEditor={true}
					customPlaceholder="No description"
					charactersLimit={99999}
					isRequired={true}
				/>
				<div className="row">
					<div className="col">
						<label htmlFor="referrerpolicy" className="form-label">
							Referrer Policy
						</label>
						<select
							id="referrerpolicy"
							name="referrerpolicy"
							defaultValue={object?.data?.referrerpolicy}
							className="form-select"
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
							defaultValue={object?.data?.rel}
							className="form-select"
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
							defaultValue={object?.data?.target}
							className="form-select"
						>
							<option value={`_self`}>Self</option>
							<option value={`_blank`}>Blank</option>
							<option value={`_parent`}>Parent</option>
							<option value={`_top`}>Top</option>
							<option value={`_unfencedTop`}>Unfenced Top</option>
						</select>
					</div>
					<div className="col">
						<label htmlFor="orderingNumber" className="form-label">
							Ordering Number
						</label>
						<input
							id="orderingNumber"
							name="orderingNumber"
							defaultValue={object?.data?.orderingNumber}
							min={1}
							max={99}
							type="number"
							className="form-control mb-3"
							placeholder=""
						/>
					</div>
				</div>
			</div>
			<div className="col-lg-3">
				<AdminSidebar
					displayCategoryField={false}
					displayAvatar={false}
					avatar={undefined}
					avatarFormat={"image"}
					status={object?.data?.status}
					fullWidth={false}
					password={""}
					featured={false}
					commented={object?.data?.commented.toString()}
					embedding={false}
					category={undefined}
					categories={[]}
					multiple_categories={false}
				/>
				<br />
				<FormButtons />
			</div>
		</form>
	);
};

export default UpdatePageForm;
