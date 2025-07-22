"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { fetchurl } from "@/helpers/setTokenOnServer";
import AdminSidebar from "@/components/noadmin/myfinaladminsidebar";
import MyTextArea from "@/components/global/myfinaltextarea";
import FormButtons from "@/components/global/formbuttons";

const CreatePageForm = ({ params = {} }) => {
	const router = useRouter();

	const [btnText, setBtnText] = useState(`Submit`);

	const addPage = async (e) => {
		e.preventDefault();
		setBtnText("...");
		const form = e.target;
		const formData = new FormData(form);

		const rawFormData = {
			title: formData.get("title"),
			url: formData.get("url"),
			text: formData.get("text"),
			referrerpolicy: formData.get("referrerpolicy"),
			rel: formData.get("rel"),
			target: formData.get("target"),
			orderingNumber: formData.get("orderingNumber"),
			commented: formData.get("commented"),
			password: formData.get("password"),
			status: formData.get("status"),
		};

		const res = await fetchurl(`/noadmin/pages`, "POST", "no-cache", {
			...rawFormData,
			resourceId: params.id,
		});

		if (res.status === "error") {
			toast.error(res.message, "bottom");
			setBtnText("Submit");
			return;
		}
		if (res.status === "fail") {
			toast.error(res.message, "bottom");
			setBtnText("Submit");
			return;
		}
		toast.success(`Menu page created`, "bottom");
		router.push(`/noadmin/menus/read/${params.id}`);
	};

	const resetForm = (e) => {
		e.target.closest("form").reset();
	};

	return (
		<form className="row" onSubmit={addPage}>
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
				<label htmlFor="url" className="form-label">
					Url
				</label>
				<input
					id="url"
					name="url"
					defaultValue="#"
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
					onModel="Page"
					advancedTextEditor={true}
					customPlaceholder="No description"
					defaultValue="No description..."
				/>
				<div className="row">
					<div className="col">
						<label htmlFor="referrerpolicy" className="form-label">
							Referrer Policy
						</label>
						<select
							id="referrerpolicy"
							name="referrerpolicy"
							defaultValue="strict-origin-when-cross-origin"
							className="form-control"
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
							defaultValue="no-referrer"
							className="form-control"
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
							defaultValue="_blank"
							className="form-control"
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
							defaultValue="1"
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
					avatarFormat={""}
					status={"draft"}
					fullWidth={false}
					password={""}
					featured={false}
					commented={true}
					embedding={false}
					github_readme={""}
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

export default CreatePageForm;
