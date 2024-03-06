"use client";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import AdminSidebar from "@/components/admin/adminsidebar";
import MyTextArea from "@/components/global/mytextarea";
import AuthContext from "@/helpers/globalContext";

const UpdateMembership = () => {
	const { files } = useContext(AuthContext);

	const router = useRouter();

	const [membershipData, setMembershipData] = useState({
		title: `Untitled`,
		text: `No description`,
		active: false,
		currency: "usd",
		interval: "month",
		interval_count: 1,
		tax_behavior: "unspecified",
		unit_amount: 0,
		features: [],
		width: 0,
		height: 0,
		length: 0,
		weight: 0,
		shippable: false,
		statement_descriptor: "BIWEEKLY BFR MEMBRSHP",
		unit_label: "digital-good",
		url: "",
		livemode: false,
		status: `draft`,
	});
	const {
		title,
		text,
		active,
		currency,
		interval,
		interval_count,
		tax_behavior,
		unit_amount,
		features,
		width,
		height,
		length,
		weight,
		shippable,
		statement_descriptor,
		unit_label,
		url,
		livemode,
		status,
	} = membershipData;

	const [membership, setMembership] = useState(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(false);

	const { id } = useParams();
	const membershipId = id;

	useEffect(() => {
		const fetchMembership = async () => {
			try {
				const res = await axios.get(
					`/extras/stripe/memberships/${membershipId}`
				);
				setMembership(res?.data?.data);
				setMembershipData({
					title: res?.data?.data?.title,
					text: res?.data?.data?.text,
					active: res?.data?.data?.active,
					currency: res?.data?.data?.default_price_data?.currency,
					interval: res?.data?.data?.default_price_data?.recurring?.interval,
					interval_count:
						res?.data?.data?.default_price_data?.recurring?.interval_count,
					tax_behavior: res?.data?.data?.default_price_data?.tax_behavior,
					unit_amount: res?.data?.data?.default_price_data?.unit_amount,
					features: res?.data?.data?.features,
					width: res?.data?.data?.package_dimensions?.width,
					height: res?.data?.data?.package_dimensions?.height,
					length: res?.data?.data?.package_dimensions?.length,
					weight: res?.data?.data?.package_dimensions?.weight,
					shippable: res?.data?.data?.shippable,
					statement_descriptor: res?.data?.data?.statement_descriptor,
					unit_label: res?.data?.data?.unit_label,
					url: res?.data?.data?.url,
					livemode: res?.data?.data?.livemode,
					status: res?.data?.data?.status,
				});
				setLoading(false);
			} catch (err) {
				console.log(err);
				// const error = err.response.data.message;
				const error = err?.response?.data?.error?.errors;
				const errors = err?.response?.data?.errors;

				if (error) {
					// dispatch(setAlert(error, 'danger'));
					error &&
						Object.entries(error).map(([, value]) =>
							toast.error(value.message)
						);
				}

				if (errors) {
					errors.forEach((error) => toast.error(error.msg));
				}

				toast.error(err?.response?.statusText);
				return {
					msg: err?.response?.statusText,
					status: err?.response?.status,
				};
			}
		};
		fetchMembership();
	}, [membershipId]);

	const upgradeMembership = async (e) => {
		e.preventDefault();
		try {
			await axios.put(`/extras/stripe/memberships/${membership._id}`, {
				...membershipData,
				// files: { avatar: files?.selected?._id },
				default_price_data: {
					currency: currency,
					recurring: {
						interval: interval,
						interval_count: interval_count,
					},
					tax_behavior: tax_behavior,
					unit_amount: unit_amount,
				},
				package_dimensions: {
					width: width,
					height: height,
					length: length,
					weight: weight,
				},
			});
			toast.success(`Item created`);
			router.push(`/noadmin/memberships`);
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
		setMembershipData({
			title: `Untitled`,
			text: `No description`,
			active: false,
			currency: "usd",
			interval: "month",
			interval_count: 1,
			tax_behavior: "unspecified",
			unit_amount: 0,
			features: [],
			width: 0,
			height: 0,
			length: 0,
			weight: 0,
			shippable: false,
			statement_descriptor: "BIWEEKLY BFR MEMBRSHP",
			unit_label: "digital-good",
			url: "",
			livemode: false,
			status: `draft`,
		});
	};

	return loading || membership === null || membership === undefined ? (
		error ? (
			<>Not found</>
		) : (
			<>Loading...</>
		)
	) : (
		<form className="row" onSubmit={upgradeMembership}>
			<div className="col">
				<label htmlFor="blog-title" className="form-label">
					Title
				</label>
				<input
					id="blog-title"
					name="title"
					value={title}
					onChange={(e) => {
						setMembershipData({
							...membershipData,
							title: e.target.value,
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
					objectData={membershipData}
					setObjectData={setMembershipData}
					onModel="Membership"
					advancedTextEditor={false}
				/>
				<div className="row">
					<div className="col">
						<label htmlFor="currency" className="form-label">
							Currency
						</label>
						<input
							id="currency"
							name="currency"
							value={currency}
							onChange={(e) => {
								setMembershipData({
									...membershipData,
									currency: e.target.value,
								});
							}}
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
							value={unit_amount}
							onChange={(e) => {
								const inputValue = e.target.value;
								if (/^\d+$/.test(inputValue) && parseInt(inputValue) >= 0) {
									setMembershipData({
										...membershipData,
										unit_amount: inputValue,
									});
								}
							}}
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
							value={interval_count}
							onChange={(e) => {
								const inputValue = e.target.value;
								if (/^\d+$/.test(inputValue) && parseInt(inputValue) >= 1) {
									setMembershipData({
										...membershipData,
										interval_count: inputValue,
									});
								}
							}}
							type="number"
							className="form-control mb-3"
							placeholder="1"
						/>
					</div>
					<div className="col">
						<select
							id="interval"
							name="interval"
							value={interval}
							onChange={(e) => {
								setMembershipData({
									...membershipData,
									interval: e.target.value,
								});
							}}
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
							value={width}
							onChange={(e) => {
								const inputValue = e.target.value;
								if (/^\d+$/.test(inputValue) && parseInt(inputValue) >= 0) {
									setMembershipData({
										...membershipData,
										width: inputValue,
									});
								}
							}}
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
							value={height}
							onChange={(e) => {
								const inputValue = e.target.value;
								if (/^\d+$/.test(inputValue) && parseInt(inputValue) >= 0) {
									setMembershipData({
										...membershipData,
										height: inputValue,
									});
								}
							}}
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
							value={length}
							onChange={(e) => {
								const inputValue = e.target.value;
								if (/^\d+$/.test(inputValue) && parseInt(inputValue) >= 0) {
									setMembershipData({
										...membershipData,
										length: inputValue,
									});
								}
							}}
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
							value={weight}
							onChange={(e) => {
								const inputValue = e.target.value;
								if (/^\d+$/.test(inputValue) && parseInt(inputValue) >= 0) {
									setMembershipData({
										...membershipData,
										weight: inputValue,
									});
								}
							}}
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
							value={shippable}
							onChange={(e) => {
								setMembershipData({
									...membershipData,
									shippable: e.target.value,
								});
							}}
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
							value={tax_behavior}
							onChange={(e) => {
								setMembershipData({
									...membershipData,
									tax_behavior: e.target.value,
								});
							}}
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
							value={statement_descriptor}
							onChange={(e) => {
								setMembershipData({
									...membershipData,
									statement_descriptor: e.target.value,
								});
							}}
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
							value={unit_label}
							onChange={(e) => {
								const inputValue = e.target.value;
								if (/^\d+$/.test(inputValue) && inputValue.length <= 12) {
									setMembershipData({
										...membershipData,
										unit_label: inputValue,
									});
								}
							}}
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
							value={url}
							onChange={(e) => {
								setMembershipData({
									...membershipData,
									url: e.target.value,
								});
							}}
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
							value={active}
							onChange={(e) => {
								setMembershipData({
									...membershipData,
									active: e.target.value,
								});
							}}
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
							value={livemode}
							onChange={(e) => {
								setMembershipData({
									...membershipData,
									livemode: e.target.value,
								});
							}}
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
					status={status}
					fullWidth={false}
					password={""}
					featured={false}
					commented={false}
					embedding={false}
					github_readme=""
					category={undefined}
					categories={[]}
					objectData={membershipData}
					setObjectData={setMembershipData}
					multipleFiles={false}
					onModel={"Membership"}
				/>
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

export default UpdateMembership;
