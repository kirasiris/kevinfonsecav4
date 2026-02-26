"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { fetchurl } from "@/helpers/setTokenOnServer";
import AdminSidebar from "@/components/noadmin/myfinaladminsidebar";
import MyTextArea from "@/components/global/myfinaltextarea";
import FormButtons from "@/components/global/formbuttons";

const UpdateMembershipForm = ({ token = {}, auth = {}, object = {} }) => {
	const router = useRouter();

	const [, setBtnText] = useState(`Submit`);

	const upgradeMembership = async (e) => {
		e.preventDefault();
		setBtnText("...");
		const form = e.target;
		const formData = new FormData(form);

		const rawFormData = {
			title: formData.get("title"),
			text: formData.get("text"),
			recurring: {
				interval: formData.get("interval"),
				interval_count: formData.get("interval_count"),
			},
			isFree: formData.get("isFree"),
			// price: formData.get("price"), // Price is not need on here as Stripe does not let you update prices
			active: formData.get("active"), // Needed for Stripe
			tax_behavior: formData.get("tax_behavior"),
			statement_descriptor: formData.get("statement_descriptor"),
			url: formData.get("url"),
			status: formData.get("status"),
			custom_membership: formData.get("custom_membership"),
			project: formData.get("project"),
			postType: formData.get("postType"),
			numberOfRequests: formData.get("numberOfRequests"),
		};

		const res = await fetchurl(
			`/noadmin/stripe/memberships/${object?.data?._id}`,
			"PUT",
			"no-cache",
			rawFormData,
		);

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
		toast.success(`Membership updated`, "bottom");
		router.push(`/nfabusiness/memberships`);
	};

	const resetForm = (e) => {
		e.target.closest("form").reset();
	};

	return (
		<form className="row" onSubmit={upgradeMembership}>
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
				<label htmlFor="text" className="form-label">
					Text
				</label>
				<MyTextArea
					auth={auth}
					token={token}
					id="text"
					name="text"
					defaultValue={object?.data?.text}
					onModel="Membership"
					advancedTextEditor={false}
					customPlaceholder="No description"
					charactersLimit={9999}
					isRequired={true}
				/>
				<div className="row">
					<div className="col">
						<label htmlFor="isFree" className="form-label">
							Is it free?
						</label>
						<select
							id="isFree"
							name="isFree"
							defaultValue={object?.data?.isFree.toString()}
							className="form-control mb-3"
						>
							<option value={true}>Yes</option>
							<option value={false}>No</option>
						</select>
					</div>
					<div className="col">
						<label htmlFor="price" className="form-label">
							Price
						</label>
						<input
							id="price"
							name="price"
							defaultValue={object?.data?.price?.inHumanFormat}
							type="text"
							className="form-control mb-3"
							placeholder="$10.00 or $10 or 10"
						/>
					</div>
					<div className="col">
						<label htmlFor="interval_count" className="form-label">
							Charge Every
						</label>
						<input
							id="interval_count"
							name="interval_count"
							defaultValue={object?.data?.interval_count}
							type="number"
							className="form-control mb-3"
							min="1"
							placeholder="1"
						/>
					</div>
					<div className="col">
						<label htmlFor="interval" className="form-label">
							Interval
						</label>
						<select
							id="interval"
							name="interval"
							defaultValue={object?.data?.recurring?.interval}
							className="form-control mb-3"
						>
							<option value={"day"}>Day</option>
							<option value={"week"}>Week</option>
							<option value={"month"}>Month</option>
							<option value={"year"}>Year</option>
						</select>
					</div>
				</div>
				<div className="row">
					<div className="col">
						<label htmlFor="tax_behavior" className="form-label">
							Tax Behavior (Include taxes on final price?)
						</label>
						<select
							id="tax_behavior"
							name="tax_behavior"
							defaultValue={object?.data?.tax_behavior}
							className="form-control mb-3"
						>
							<option value="exclusive">Exclusive</option>
							<option value="inclusive">Inclusive</option>
							<option value="unspecified">Unspecified</option>
						</select>
					</div>
					<div className="col">
						<label htmlFor="statement_descriptor" className="form-label">
							Statement Descriptor (22 characters. max)
						</label>
						<select
							id="statement_descriptor"
							name="statement_descriptor"
							defaultValue={object?.data?.statement_descriptor}
							className="form-control mb-3"
							placeholder="This is what will appear in the user's bank statement account"
						>
							<option value={"DAILY MEMBRSHP"}>
								DAILY ARMED CODE, LLC MEMBERSHIP
							</option>
							<option value={"BIWEEKLY MEMBRSHP"}>
								BI-WEEKLY ARMED CODE, LLC MEMBERSHIP
							</option>
							<option value={"MONTHLY MEMBRSHP"}>
								MONTHLY ARMED CODE, LLC MEMBERSHIP
							</option>
							<option value={"YEARLY MEMBRSHP"}>
								YEARLY ARMED CODE, LLC MEMBERSHIP
							</option>
						</select>
					</div>
				</div>
				<div className="row">
					<div className="col">
						<label htmlFor="url" className="form-label">
							Url of the Product Offered
						</label>
						<input
							id="url"
							name="url"
							defaultValue={object?.data?.url}
							type="text"
							className="form-control mb-3"
							required
							placeholder=""
						/>
					</div>
					<div className="col">
						<label htmlFor="active" className="form-label">
							Active on Stripe
						</label>
						<select
							id="active"
							name="active"
							defaultValue={object?.data?.active.toString()}
							className="form-control mb-3"
						>
							<option value={true}>Yes</option>
							<option value={false}>No</option>
						</select>
					</div>
					<div className="col">
						<label htmlFor="custom_membership" className="form-label">
							Custom Plan?
						</label>
						<select
							id="custom_membership"
							name="custom_membership"
							defaultValue={object?.data?.custom_membership.toString()}
							className="form-control mb-3"
						>
							<option value={true}>Yes</option>
							<option value={false}>No</option>
						</select>
					</div>
				</div>
				<div className="row">
					<div className="col">
						<label htmlFor="project" className="form-label">
							Project
						</label>
						<select
							id="project"
							name="project"
							defaultValue={object?.data?.project}
							className="form-control mb-3"
						>
							<option value={"all"}>All</option>
							<option value={"personal"}>Personal</option>
							<option value={"armedcodellc"}>Armed Code, LLC</option>
							<option value={`anonymous-secrets-app`}>Anonymous Secrets</option>
							<option value={`play-it-now-app`}>Play It Now</option>
						</select>
					</div>
					<div className="col">
						<label htmlFor="postType" className="form-label">
							Membership type
						</label>
						<select
							id="postType"
							name="postType"
							defaultValue={object?.data?.postType}
							className="form-control mb-3"
						>
							<option value={"regular"}>Regular</option>
							<option value={"api-usage"}>API Usage</option>
						</select>
					</div>
					<div className="col">
						<label htmlFor="numberOfRequests" className="form-label">
							Number of Requests (if membership type is API Usage)
						</label>
						<input
							id="numberOfRequests"
							name="numberOfRequests"
							defaultValue={object?.data?.numberOfRequests}
							type="number"
							className="form-control mb-3"
							placeholder="Please enter integers only (not rounded numbers)"
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
					commented={false}
					embedding={false}
					github_readme=""
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

export default UpdateMembershipForm;
