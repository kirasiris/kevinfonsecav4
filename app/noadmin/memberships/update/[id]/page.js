import {
	notFound,
	//  redirect
} from "next/navigation";
import {
	fetchurl,
	getAuthTokenOnServer,
	getUserOnServer,
} from "@/helpers/setTokenOnServer";
// import AdminSidebar from "@/components/noadmin/myfinaladminsidebar";
// import MyTextArea from "@/components/global/myfinaltextarea";
import OnboardingLink from "@/components/dashboard/onboardinglink";
// import FormButtons from "@/components/global/formbuttons";
import UpdateMembershipForm from "@/forms/noadmin/memberships/updatemembershipform";

async function getMembership(params) {
	const res = await fetchurl(
		`/extras/stripe/memberships${params}`,
		"GET",
		"no-cache"
	);
	if (!res.success) notFound();
	return res;
}

const UpdateMembership = async ({ params, searchParams }) => {
	const awtdParams = await params;
	const awtdSearchParams = await searchParams;
	const token = await getAuthTokenOnServer();
	const auth = await getUserOnServer();

	const membership = await getMembership(`/${awtdParams.id}`);

	// Redirect if not charges enabled
	!auth?.userStripeChargesEnabled && <OnboardingLink auth={auth} />;

	// const upgradeMembership = async (formData) => {
	// 	"use server";
	// 	const rawFormData = {
	// 		title: formData.get("title"),
	// 		text: formData.get("text"),
	// 		recurring: {
	// 			interval: formData.get("interval"),
	// 			interval_count: formData.get("interval_count"),
	// 		},
	// 		isFree: formData.get("isFree"),
	// 		// price: formData.get("price"), // Price is not need on here as Stripe does not let you update prices
	// 		active: formData.get("active"), // Needed for Stripe
	// 		tax_behavior: formData.get("tax_behavior"),
	// 		statement_descriptor: formData.get("statement_descriptor"),
	// 		url: formData.get("url"),
	// 		status: formData.get("status"),
	// 		custom_membership: formData.get("custom_membership"),
	// 		project: formData.get("project"),
	// 		postType: formData.get("postType"),
	// 		numberOfRequests: formData.get("numberOfRequests"),
	// 	};

	// 	await fetchurl(
	// 		`/extras/stripe/memberships/${awtdParams.id}`,
	// 		"PUT",
	// 		"no-cache",
	// 		rawFormData
	// 	);

	// 	redirect(`/noadmin/memberships`);
	// };

	return (
		<>
			<UpdateMembershipForm token={token} auth={auth} object={membership} />
			{/* <form className="row" action={upgradeMembership}>
				<div className="col">
					<label htmlFor="title" className="form-label">
						Title
					</label>
					<input
						id="title"
						name="title"
						defaultValue={membership?.data?.title}
						type="text"
						className="form-control mb-3"
						required
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
						defaultValue={membership?.data?.text}
						onModel="Membership"
						advancedTextEditor={false}
						customPlaceholder="No description"
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
								defaultValue={membership?.data?.isFree}
								className="form-control"
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
								defaultValue={membership?.data.price.inHumanFormat}
								type="text"
								className="form-control mb-3"
								placeholder="$10.00 or $10 or 10"
								disabled
							/>
						</div>
						<div className="col">
							<label htmlFor="interval_count" className="form-label">
								Charge Every
							</label>
							<input
								id="interval_count"
								name="interval_count"
								defaultValue={membership?.data?.recurring?.interval_count}
								min="1"
								type="number"
								className="form-control mb-3"
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
								defaultValue={membership?.data?.recurring?.interval}
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
								defaultValue={membership?.data?.tax_behavior}
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
								defaultValue={membership?.data?.statement_descriptor}
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
								defaultValue={membership?.data?.url}
								type="text"
								className="form-control mb-3"
								required
								placeholder=""
							/>
						</div>
						<div className="col">
							<label htmlFor="active" className="form-label">
								Active
							</label>
							<select
								id="active"
								name="active"
								defaultValue={membership?.data?.active.toString()}
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
								defaultValue={membership?.data?.custom_membership.toString()}
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
								defaultValue={membership?.data?.project}
								className="form-control mb-3"
							>
								<option value={"all"}>All</option>
								<option value={"personal"}>Personal</option>
								<option value={"armedcodellc"}>Armed Code, LLC</option>
								<option value={`anonymous-secrets-app`}>
									Anonymous Secrets
								</option>
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
								defaultValue={membership?.data?.postType}
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
								defaultValue={membership?.data?.numberOfRequests}
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
						avatarFormat={""}
						status={membership?.data?.status}
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
			</form> */}
		</>
	);
};

export default UpdateMembership;
