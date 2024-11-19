import {
	fetchurl,
	getAuthTokenOnServer,
	getUserOnServer,
} from "@/helpers/setTokenOnServer";
import { notFound, redirect } from "next/navigation";
import AdminSidebar from "@/components/admin/myfinaladminsidebar";
import MyTextArea from "@/components/global/myfinaltextarea";
import OnboardingLink from "@/components/dashboard/onboardinglink";
import FormButtons from "@/components/global/formbuttons";

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

	const upgradeMembership = async (formData) => {
		"use server";
		const rawFormData = {
			title: formData.get("title"),
			text: formData.get("text"),
			active: formData.get("active"),
			// features: formData.get("features"),
			shippable: formData.get("shippable"),
			statement_descriptor: formData.get("statement_descriptor"),
			unit_label: "digital-good",
			url: formData.get("url"),
			livemode: formData.get("livemode"),
			status: formData.get("status"),
		};

		await fetchurl(
			`/extras/stripe/memberships/${awtdParams.id}`,
			"PUT",
			"no-cache",
			{
				...rawFormData,
				default_price_data: {
					currency: formData.get("currency"),
					recurring: {
						interval: formData.get("interval"),
						interval_count: formData.get("interval_count"),
					},
					tax_behavior: formData.get("tax_behavior"),
					unit_amount: formData.get("unit_amount"),
				},
				package_dimensions: {
					width: formData.get("width"),
					height: formData.get("height"),
					length: formData.get("length"),
					weight: formData.get("weight"),
				},
			}
		);
		redirect(`/noadmin/memberships`);
	};

	return (
		<form className="row" action={upgradeMembership}>
			<div className="col">
				<label htmlFor="blog-title" className="form-label">
					Title
				</label>
				<input
					id="blog-title"
					name="title"
					defaultValue={membership?.data?.title}
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
					onModel="Membership"
					advancedTextEditor={false}
					customPlaceholder="No description"
					defaultValue={membership?.data?.text}
				/>
				<div className="row">
					<div className="col">
						<label htmlFor="currency" className="form-label">
							Currency
						</label>
						<input
							id="currency"
							name="currency"
							defaultValue={membership?.data?.default_price_data?.currency}
							type="text"
							className="form-control mb-3"
							placeholder=""
						/>
					</div>
					<div className="col">
						<label htmlFor="unit_amount" className="form-label">
							Price (in cents)
						</label>
						<input
							id="unit_amount"
							name="unit_amount"
							defaultValue={membership?.data?.default_price_data?.unit_amount}
							min={1}
							type="number"
							className="form-control mb-3"
							placeholder="How much?"
						/>
					</div>
				</div>
				<div className="row">
					<label htmlFor="interval" className="form-label">
						Charge Every
					</label>
					<div className="col">
						<input
							id="interval_count"
							name="interval_count"
							defaultValue={
								membership?.data?.default_price_data?.recurring?.interval_count
							}
							min={1}
							type="number"
							className="form-control mb-3"
							placeholder="1"
						/>
					</div>
					<div className="col">
						<select
							id="interval"
							name="interval"
							defaultValue={
								membership?.data?.default_price_data?.recurring?.interval
							}
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
						<label htmlFor="width" className="form-label">
							Width (In inches)
						</label>
						<input
							id="width"
							name="width"
							defaultValue={membership?.data?.package_dimensions?.width}
							min={0}
							type="number"
							className="form-control mb-3"
							placeholder="In inches"
						/>
					</div>
					<div className="col">
						<label htmlFor="height" className="form-label">
							Height
						</label>
						<input
							id="height"
							name="height"
							defaultValue={membership?.data?.package_dimensions?.height}
							min={0}
							type="number"
							className="form-control mb-3"
							placeholder="In inches"
						/>
					</div>
					<div className="col">
						<label htmlFor="length" className="form-label">
							Length (in inches)
						</label>
						<input
							id="length"
							name="length"
							defaultValue={membership?.data?.package_dimensions?.length}
							min={0}
							type="number"
							className="form-control mb-3"
							placeholder="In inches"
						/>
					</div>
					<div className="col">
						<label htmlFor="weight" className="form-label">
							Weight (in ounces)
						</label>
						<input
							id="weight"
							name="weight"
							defaultValue={membership?.data?.package_dimensions?.weight}
							min={0}
							type="number"
							className="form-control mb-3"
							placeholder="In ounces"
						/>
					</div>
				</div>
				<div className="row">
					<div className="col">
						<label htmlFor="shippable" className="form-label">
							Shipabble
						</label>
						<select
							id="shippable"
							name="shippable"
							defaultValue={membership?.data?.shippable}
							className="form-control mb-3"
						>
							<option value={true}>Yes</option>
							<option value={false}>No</option>
						</select>
						<label htmlFor="tax_behavior" className="form-label">
							Tax Beahavior
						</label>
						<select
							id="tax_behavior"
							name="tax_behavior"
							defaultValue={membership?.data?.default_price_data?.tax_behavior}
							className="form-control mb-3"
						>
							<option value={"exclusive"}>Exclusive</option>
							<option value={"inclusive"}>Inclusive</option>
							<option value={"unspecified"}>Unspecified</option>
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
							<option value={"DAILY BFR MEMBRSHP"}>
								DAILY BEFREE MEMBERSHIP
							</option>
							<option value={"BIWEEKLY BFR MEMBRSHP"}>
								BI-WEEKLY BEFREE MEMBERSHIP
							</option>
							<option value={"MONTHLY BFR MEMBRSHP"}>
								MONTHLY BEFREE MEMBERSHIP
							</option>
							<option value={"YEARLY BFR MEMBRSHP"}>
								YEARLY BEFREE MEMBERSHIP
							</option>
						</select>
						<label htmlFor="unit_label" className="form-label">
							Unit Label
						</label>
						<input
							id="unit_label"
							name="unit_label"
							defaultValue={membership?.data?.unit_label}
							type="text"
							className="form-control mb-3"
							placeholder="Category of the product or service offered"
							disabled
						/>
					</div>
				</div>
				<div className="row">
					<div className="col">
						<label htmlFor="url" className="form-label">
							Url of the Product or Service Offered
						</label>
						<input
							id="url"
							name="url"
							defaultValue={membership?.data?.url}
							type="text"
							className="form-control mb-3"
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
							defaultValue={membership?.data?.active}
							className="form-control mb-3"
						>
							<option value={true}>Yes</option>
							<option value={false}>No</option>
						</select>
					</div>
					<div className="col">
						<label htmlFor="livemode" className="form-label">
							Live Mode
						</label>
						<select
							id="livemode"
							name="livemode"
							defaultValue={membership?.data?.livemode}
							className="form-control mb-3"
						>
							<option value={true}>Yes</option>
							<option value={false}>No</option>
						</select>
					</div>
				</div>
			</div>
			<div className="col-lg-3">
				<AdminSidebar
					displayCategoryField={false}
					displayAvatar={false}
					avatar={""}
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
					multipleFiles={false}
					onModel={"Membership"}
					files={[]}
					auth={auth}
					token={token}
				/>
				<br />
				<FormButtons />
			</div>
		</form>
	);
};

export default UpdateMembership;
