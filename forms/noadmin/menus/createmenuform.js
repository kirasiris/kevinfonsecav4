"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { fetchurl } from "@/helpers/setTokenOnServer";
import AdminSidebar from "@/components/noadmin/myfinaladminsidebar";
import MyTextArea from "@/components/global/myfinaltextarea";
import FormButtons from "@/components/global/formbuttons";

const CreateMenuForm = ({}) => {
	const router = useRouter();

	const [, setBtnText] = useState(`Submit`);
	const [draft, setDraft] = useState({ html: null, users: [], hashtags: [] });

	const addMenu = async (e) => {
		e.preventDefault();
		setBtnText("...");
		const form = e.target;
		const formData = new FormData(form);

		const rawFormData = {
			title: formData.get("title"),
			text: formData.get("text"),
			// mentions: JSON.parse(formData.get("text_users") || "[]"),
			// hashtags: JSON.parse(formData.get("text_hashtags") || "[]"),
			position: formData.getAll("position"),
			status: formData.get("status"),
		};

		const res = await fetchurl(
			`/noadmin/menus`,
			"POST",
			"no-cache",
			rawFormData,
			undefined,
			false,
			false,
		);

		if (res.status === "error") {
			toast.error(res.message);
			setBtnText("Submit");
			return;
		}
		if (res.status === "fail") {
			toast.error(res.message);
			setBtnText("Submit");
			return;
		}
		toast.success(`Menu created`);
		router.push(`/noadmin/menus`);
	};

	return (
		<form className="row" onSubmit={addMenu}>
			<div className="col">
				<label htmlFor="title" className="form-label">
					Title
				</label>
				<input
					id="title"
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
					value={draft.html ?? undefined}
					onChange={setDraft}
					onModel="Menu"
					advancedTextEditor={false}
					customPlaceholder="No description"
					charactersLimit={99999}
					isRequired={true}
				/>
				{/* <p className="form-text mt-1 mb-3">
					{draft.html.replace(/<[^>]*>/g, "").length} characters
					{draft.users.length > 0 &&
						" · mentions: " +
							draft.users.map((u) => "@" + u.username).join(", ")}
					{draft.hashtags.length > 0 &&
						" · tags: " + draft.hashtags.map((t) => "#" + t).join(", ")}
				</p> */}
				<label htmlFor="position" className="form-label">
					Position
				</label>
				<select
					id="position"
					name="position"
					defaultValue="top"
					className="form-control"
					multiple
				>
					<option value={`top`}>Top</option>
					<option value={`bottom`}>Bottom</option>
				</select>
			</div>
			<div className="col-lg-3">
				<AdminSidebar
					displayCategoryField={false}
					displayAvatar={false}
					avatar={undefined}
					avatarFormat={""}
					status="draft"
					fullWidth={false}
					password={""}
					featured={false}
					commented={false}
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

export default CreateMenuForm;
