"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { fetchurl } from "@/helpers/setTokenOnServer";
import AdminSidebar from "@/components/noadmin/myfinaladminsidebar";
import MyTextArea from "@/components/global/myfinaltextarea";
import FormButtons from "@/components/global/formbuttons";

const UpdateRealStateForm = ({ token = {}, auth = {}, object = {} }) => {
	const router = useRouter();

	const [btnText, setBtnText] = useState(`Submit`);

	const upgradeRealState = async (e) => {
		e.preventDefault();
		setBtnText("...");
		const form = e.target;
		const formData = new FormData(form);

		const rawFormData = {
			title: formData.get("title"),
			text: formData.get("text"),
			price: formData.get("price"),
			active: formData.get("active"),
			statement_descriptor: formData.get("statement_descriptor"),
			commented: formData.get("commented"),
			address: formData.get("address"),
			bedrooms: formData.get("bedrooms"),
			bathrooms: formData.get("bathrooms"),
			squarefeet: formData.get("squarefeet"),
			inStock: formData.get("inStock"),
			itemType: formData.get("itemType"),
			buldingType: formData.get("buldingType"),
			amenities: formData.getAll("amenities"),
			status: formData.get("status"),
			builtOnYear: formData.get("builtOnYear"),
			files: { avatar: formData.get("file") || undefined },
		};

		const res = await fetchurl(
			`/noadmin/stripe/realstates/${object?.data?._id}`,
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
		toast.success(`Real State updated`, "bottom");
		router.push(`/nfabusiness/realstates`);
	};

	const resetForm = (e) => {
		e.target.closest("form").reset();
	};

	return (
		<form className="row" onSubmit={upgradeRealState}>
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
					onModel="RealState"
					advancedTextEditor={true}
					customPlaceholder="No description"
				/>
				<div className="row">
					<div className="col">
						<label htmlFor="price" className="form-label">
							Price
						</label>
						<input
							id="price"
							name="price"
							defaultValue={object?.data?.price.inHumanFormat}
							type="text"
							className="form-control mb-3"
							required
							placeholder=""
						/>
					</div>
					<div className="col">
						<label htmlFor="active" className="form-label">
							Activate
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
						<label htmlFor="statement_descriptor" className="form-label">
							Statement Descriptor (22 characters. max)
						</label>
						<input
							id="statement_descriptor"
							name="statement_descriptor"
							defaultValue={object?.data?.statement_descriptor}
							type="text"
							className="form-control mb-3"
							placeholder="This is what will appear in the user's bank statement account"
						/>
					</div>
				</div>
				<div className="row">
					<div className="col">
						<label htmlFor="address" className="form-label">
							Address
						</label>
						<input
							id="address"
							name="address"
							defaultValue={object?.data?.address}
							type="text"
							className="form-control mb-3"
							placeholder=""
						/>
					</div>
					<div className="col">
						<label htmlFor="inStock" className="form-label">
							Is it sold?
						</label>
						<select
							id="inStock"
							name="inStock"
							defaultValue={object?.data?.inStock.toString()}
							className="form-control mb-3"
						>
							<option value={true}>Yes</option>
							<option value={false}>No</option>
						</select>
					</div>
				</div>
				<div className="row">
					<div className="col">
						<label htmlFor="bedrooms" className="form-label">
							Bedrooms
						</label>
						<input
							id="bedrooms"
							name="bedrooms"
							defaultValue={object?.data?.bedrooms}
							type="number"
							className="form-control mb-3"
							min={1}
							placeholder="18"
						/>
					</div>
					<div className="col">
						<label htmlFor="bathrooms" className="form-label">
							Bathrooms
						</label>
						<input
							id="bathrooms"
							name="bathrooms"
							defaultValue={object?.data?.bathrooms}
							type="number"
							className="form-control mb-3"
							min={1}
							placeholder="18"
						/>
					</div>
					<div className="col">
						<label htmlFor="squarefeet" className="form-label">
							Square Feet
						</label>
						<input
							id="squarefeet"
							name="squarefeet"
							defaultValue={object?.data?.squarefeet}
							type="number"
							className="form-control mb-3"
							min={1}
							placeholder="18"
						/>
					</div>
				</div>
				<div className="row">
					<div className="col">
						<label htmlFor="itemType" className="form-label">
							Property Type
						</label>
						<select
							id="itemType"
							name="itemType"
							defaultValue={object?.data?.itemType}
							className="form-control"
						>
							<option value={`sale`}>Sale</option>
							<option value={`rent`}>Rent</option>
						</select>
					</div>
					<div className="col">
						<label htmlFor="builtOnYear" className="form-label">
							Built On?
						</label>
						<input
							id="builtOnYear"
							name="builtOnYear"
							defaultValue={object?.data?.builtOnYear}
							type="text"
							className="form-control mb-3"
							placeholder=""
						/>
					</div>
					<div className="col">
						<label htmlFor="buldingType" className="form-label">
							Building Type
						</label>
						<select
							id="buldingType"
							name="buldingType"
							defaultValue={object?.data?.buldingType}
							className="form-control mb-3"
						>
							<option value={`apartment`}>Apartment</option>
							<option value={`studio`}>Studio</option>
							<option value={`condo`}>Condo</option>
							<option value={`house`}>House</option>
							<option value={`cabin-or-cottage`}>Cabin or Cottage</option>
							<option value={`loft`}>Loft</option>
							<option value={`room`}>Room</option>
							<option value={`land`}>Land</option>
							<option value={`other`}>Other</option>
						</select>
					</div>
				</div>
				<p className="mt-3">Amenities</p>
				<div className="row">
					<div className="col">
						<div className="form-check">
							<input
								id="wifi"
								name="amenities"
								defaultValue="wifi"
								type="checkbox"
								className="form-check-input"
								defaultChecked={object?.data?.amenities.includes("wifi")}
							/>
							<label htmlFor="wifi" className="form-check-label">
								Wi-Fi
							</label>
						</div>
						<div className="form-check">
							<input
								id="free-parking"
								name="amenities"
								defaultValue="free-parking"
								type="checkbox"
								className="form-check-input"
								defaultChecked={object?.data?.amenities.includes(
									"free-parking",
								)}
							/>
							<label htmlFor="free-parking" className="form-check-label">
								Free Parking
							</label>
						</div>
						<div className="form-check">
							<input
								id="elevator-access"
								name="amenities"
								defaultValue="elevator-access"
								type="checkbox"
								className="form-check-input"
								defaultChecked={object?.data?.amenities.includes(
									"elevator-access",
								)}
							/>
							<label htmlFor="elevator-access" className="form-check-label">
								Elevator Access
							</label>
						</div>
						<div className="form-check">
							<input
								id="air-conditioning"
								name="amenities"
								defaultValue="air-conditioning"
								type="checkbox"
								className="form-check-input"
								defaultChecked={object?.data?.amenities.includes(
									"air-conditioning",
								)}
							/>
							<label htmlFor="air-conditioning" className="form-check-label">
								Air Conditioning
							</label>
						</div>
						<div className="form-check">
							<input
								id="coffee-maker"
								name="amenities"
								defaultValue="coffee-maker"
								type="checkbox"
								className="form-check-input"
								defaultChecked={object?.data?.amenities.includes(
									"coffee-maker",
								)}
							/>
							<label htmlFor="coffee-maker" className="form-check-label">
								Coffee Maker
							</label>
						</div>
					</div>
					<div className="col">
						<div className="form-check">
							<input
								id="full-kitchen"
								name="amenities"
								defaultValue="full-kitchen"
								type="checkbox"
								className="form-check-input"
								defaultChecked={object?.data?.amenities.includes(
									"full-kitchen",
								)}
							/>
							<label htmlFor="full-kitchen" className="form-check-label">
								Full Kitchen
							</label>
						</div>
						<div className="form-check">
							<input
								id="swimming-pool"
								name="amenities"
								defaultValue="swimming-pool"
								type="checkbox"
								className="form-check-input"
								defaultChecked={object?.data?.amenities.includes(
									"swimming-pool",
								)}
							/>
							<label htmlFor="swimming-pool" className="form-check-label">
								Swimming Pool
							</label>
						</div>
						<div className="form-check">
							<input
								id="dish-washer"
								name="amenities"
								defaultValue="dish-washer"
								type="checkbox"
								className="form-check-input"
								defaultChecked={object?.data?.amenities.includes("dish-washer")}
							/>
							<label htmlFor="dish-washer" className="form-check-label">
								Dish Washer
							</label>
						</div>
						<div className="form-check">
							<input
								id="balcony-patio"
								name="amenities"
								defaultValue="balcony-patio"
								type="checkbox"
								className="form-check-input"
								defaultChecked={object?.data?.amenities.includes(
									"balcony-patio",
								)}
							/>
							<label htmlFor="balcony-patio" className="form-check-label">
								Balcony / Patio
							</label>
						</div>
						<div className="form-check">
							<input
								id="laundry-room"
								name="amenities"
								defaultValue="laundry-room"
								type="checkbox"
								className="form-check-input"
								defaultChecked={object?.data?.amenities.includes(
									"laundry-room",
								)}
							/>
							<label htmlFor="laundry-room" className="form-check-label">
								Laundry Room
							</label>
						</div>
					</div>
					<div className="col">
						<div className="form-check">
							<input
								id="24-7-security"
								name="amenities"
								defaultValue="24-7-security"
								type="checkbox"
								className="form-check-input"
								defaultChecked={object?.data?.amenities.includes(
									"24-7-security",
								)}
							/>
							<label htmlFor="24-7-security" className="form-check-label">
								24/7 Security
							</label>
						</div>
						<div className="form-check">
							<input
								id="gym-fitness-center"
								name="amenities"
								defaultValue="gym-fitness-center"
								type="checkbox"
								className="form-check-input"
								defaultChecked={object?.data?.amenities.includes(
									"gym-fitness-center",
								)}
							/>
							<label htmlFor="gym-fitness-center" className="form-check-label">
								Gym / Fitness Center
							</label>
						</div>
						<div className="form-check">
							<input
								id="smart-tv"
								name="amenities"
								defaultValue="smart-tv"
								type="checkbox"
								className="form-check-input"
								defaultChecked={object?.data?.amenities.includes("smart-tv")}
							/>
							<label htmlFor="smart-tv" className="form-check-label">
								Smart TV
							</label>
						</div>
						<div className="form-check">
							<input
								id="wheelchair-accessible"
								name="amenities"
								defaultValue="wheelchair-accessible"
								type="checkbox"
								className="form-check-input"
								defaultChecked={object?.data?.amenities.includes(
									"wheelchair-accessible",
								)}
							/>
							<label
								htmlFor="wheelchair-accessible"
								className="form-check-label"
							>
								Wheelchair Accessible
							</label>
						</div>
						<div className="form-check">
							<input
								id="hot-tub"
								name="amenities"
								defaultValue="hot-tub"
								type="checkbox"
								className="form-check-input"
								defaultChecked={object?.data?.amenities.includes("hot-tub")}
							/>
							<label htmlFor="hot-tub" className="form-check-label">
								Hot Tub
							</label>
						</div>
					</div>
				</div>
			</div>
			<div className="col-lg-3">
				<AdminSidebar
					displayCategoryField={false}
					displayAvatar={true}
					avatar={object?.data?.files}
					avatarFormat={object?.data?.files?.avatar?.format_type}
					status={object?.data?.status}
					fullWidth={false}
					password=""
					featured={false}
					commented={object?.data?.commented.toString()}
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

export default UpdateRealStateForm;
