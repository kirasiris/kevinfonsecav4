"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { fetchurl } from "@/helpers/setTokenOnServer";
import AdminSidebar from "@/components/noadmin/myfinaladminsidebar";
import MyTextArea from "@/components/global/myfinaltextarea";
import FormButtons from "@/components/global/formbuttons";

const CreateRealStateForm = ({ token = {}, auth = {} }) => {
	const router = useRouter();

	const [btnText, setBtnText] = useState(`Submit`);

	const addRealState = async (e) => {
		e.preventDefault();
		setBtnText("...");
		const form = e.target;
		const formData = new FormData(form);

		const rawFormData = {
			title: formData.get("title"),
			text: formData.get("text"),
			commented: formData.get("commented"),
			address: formData.get("address"),
			bedrooms: formData.get("bedrooms"),
			bathrooms: formData.get("bathrooms"),
			squarefeet: formData.get("squarefeet"),
			isSold: formData.get("isSold"),
			businessType: formData.getAll("businessType"),
			type: formData.get("type"),
			amenities: formData.getAll("amenities"),
			status: formData.get("status"),
			files: { avatar: formData.get("file") || undefined },
		};

		const res = await fetchurl(`/noadmin/realstates`, "POST", "no-cache", {
			...rawFormData,
			rates: {
				weeklyPrice: formData.get("weeklyPrice"),
				monthlyPrice: formData.get("monthlyPrice"),
				nightlyPrice: formData.get("nightlyPrice"),
			},
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
		toast.success(`Real State created`, "bottom");
		router.push(`/noadmin/realstates`);
	};

	const resetForm = (e) => {
		e.target.closest("form").reset();
	};

	return (
		<form className="row" onSubmit={addRealState}>
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
					auth={auth}
					token={token}
					id="text"
					name="text"
					defaultValue="No description..."
					onModel="RealState"
					advancedTextEditor={true}
					customPlaceholder="No description"
				/>
				<div className="row">
					<div className="col">
						<label htmlFor="weeklyPrice" className="form-label">
							Weekly Price
						</label>
						<input
							id="weeklyPrice"
							name="weeklyPrice"
							defaultValue={0}
							type="number"
							className="form-control mb-3"
							placeholder="18"
							min={0}
						/>
					</div>
					<div className="col">
						<label htmlFor="monthlyPrice" className="form-label">
							Monthly Price
						</label>
						<input
							id="monthlyPrice"
							name="monthlyPrice"
							defaultValue={0}
							type="number"
							className="form-control mb-3"
							placeholder="18"
							min={0}
						/>
					</div>
					<div className="col">
						<label htmlFor="nightlyPrice" className="form-label">
							Nightly Price
						</label>
						<input
							id="nightlyPrice"
							name="nightlyPrice"
							defaultValue={0}
							type="number"
							className="form-control mb-3"
							placeholder="18"
							min={0}
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
							defaultValue=""
							type="text"
							className="form-control mb-3"
							placeholder=""
						/>
					</div>
					<div className="col">
						<label htmlFor="isSold" className="form-label">
							Is it sold?
						</label>
						<select
							id="isSold"
							name="isSold"
							defaultValue={false}
							className="form-control"
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
							defaultValue={1}
							type="number"
							className="form-control mb-3"
							placeholder="18"
							min={1}
						/>
					</div>
					<div className="col">
						<label htmlFor="bathrooms" className="form-label">
							Bathrooms
						</label>
						<input
							id="bathrooms"
							name="bathrooms"
							defaultValue={1}
							type="number"
							className="form-control mb-3"
							placeholder="18"
							min={1}
						/>
					</div>
					<div className="col">
						<label htmlFor="squarefeet" className="form-label">
							Square Feet
						</label>
						<input
							id="squarefeet"
							name="squarefeet"
							defaultValue={1}
							type="number"
							className="form-control mb-3"
							placeholder="18"
							min={1}
						/>
					</div>
				</div>
				<div className="row">
					<div className="col">
						<label htmlFor="businessType" className="form-label">
							Business Type
						</label>
						<select
							id="businessType"
							name="businessType"
							defaultValue="sale"
							className="form-control"
							multiple
						>
							<option value={`sale`}>Sale</option>
							<option value={`rent`}>Rent</option>
						</select>
					</div>
					<div className="col">
						<label htmlFor="type" className="form-label">
							Type
						</label>
						<select
							id="type"
							name="type"
							defaultValue="house"
							className="form-control"
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
								className="form-check-input"
								type="checkbox"
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
								className="form-check-input"
								type="checkbox"
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
								className="form-check-input"
								type="checkbox"
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
								className="form-check-input"
								type="checkbox"
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
								className="form-check-input"
								type="checkbox"
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
								className="form-check-input"
								type="checkbox"
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
								className="form-check-input"
								type="checkbox"
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
								className="form-check-input"
								type="checkbox"
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
								className="form-check-input"
								type="checkbox"
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
								className="form-check-input"
								type="checkbox"
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
								className="form-check-input"
								type="checkbox"
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
								className="form-check-input"
								type="checkbox"
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
								className="form-check-input"
								type="checkbox"
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
								className="form-check-input"
								type="checkbox"
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
								className="form-check-input"
								type="checkbox"
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
					avatar={undefined}
					avatarFormat={"image"}
					status="draft"
					fullWidth={false}
					password=""
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

export default CreateRealStateForm;
