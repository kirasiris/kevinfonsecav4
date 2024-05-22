"use client";
import { fetchurl } from "@/helpers/setTokenOnServer";
import { useRouter } from "next/navigation";
import { useState, useEffect, useContext } from "react";
import { toast } from "react-toastify";
import AuthContext from "@/helpers/globalContext";
import AdminSidebar from "@/components/admin/adminsidebar";
import MyTextArea from "@/components/global/mytextarea";

const CreateRealState = () => {
	const { auth, files } = useContext(AuthContext);
	const router = useRouter();

	// Redirect if not authenticated
	!auth.isAuthenticated && router.push("/auth/login");

	// Redirec if not founder
	auth.isAuthenticated &&
		!auth.user.role.includes("founder") &&
		router.push("/dashboard");

	const [realstateData, setRealStateData] = useState({
		title: `Untitled`,
		text: `No description`,
		weeklyPrice: 0,
		monthlyPrice: 0,
		nightlyPrice: 0,
		featured: true,
		commented: true,
		address: "",
		bedrooms: 1,
		bathrooms: 1,
		squarefeet: 1,
		isSold: false,
		businessType: "sale",
		type: "house",
		amenities: "",
		password: ``,
		status: `draft`,
	});
	const {
		title,
		text,
		weeklyPrice,
		monthlyPrice,
		nightlyPrice,
		featured,
		commented,
		address,
		bedrooms,
		bathrooms,
		squarefeet,
		isSold,
		businessType,
		type,
		amenities,
		password,
		status,
	} = realstateData;

	const addRealState = async (e) => {
		e.preventDefault();
		try {
			await fetchurl(`/realstates`, "POST", "no-cache", {
				...realstateData,
				files: { avatar: files?.selected?._id },
				rates: {
					weeklyPrice: weeklyPrice,
					monthlyPrice: monthlyPrice,
					nightlyPrice: nightlyPrice,
				},
			});
			toast.success(`Item created`);
			resetForm();
			router.push(`/noadmin/realstates`);
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
		setRealStateData({
			title: `Untitled`,
			text: `No description`,
			weeklyPrice: 0,
			monthlyPrice: 0,
			nightlyPrice: 0,
			featured: true,
			commented: true,
			address: "",
			bedrooms: 1,
			bathrooms: 1,
			squarefeet: 1,
			isSold: false,
			businessType: "sale",
			type: "house",
			amenities: "",
			password: ``,
			status: `draft`,
		});
	};

	const handleAmenitiesChange = (e) => {
		const { value } = e.target;
		const updatedAmenities = amenities.includes(value)
			? amenities.filter((amenity) => amenity !== value)
			: [...amenities, value];
		setRealStateData({ ...realstateData, amenities: updatedAmenities });
	};

	return (
		<form className="row" onSubmit={addRealState}>
			<div className="col">
				<label htmlFor="blog-title" className="form-label">
					Title
				</label>
				<input
					id="blog-title"
					name="title"
					value={title}
					onChange={(e) => {
						setRealStateData({
							...realstateData,
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
					objectData={realstateData}
					setObjectData={setRealStateData}
					onModel="RealState"
					advancedTextEditor={false}
				/>
				<div className="row">
					<div className="col">
						<label htmlFor="weeklyPrice" className="form-label">
							Weekly Price
						</label>
						<input
							id="weeklyPrice"
							name="weeklyPrice"
							value={weeklyPrice}
							onChange={(e) => {
								const inputValue = e.target.value;
								if (/^\d+$/.test(inputValue) && parseInt(inputValue) >= 0) {
									setRealStateData({
										...realstateData,
										weeklyPrice: inputValue,
									});
								}
							}}
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
							value={monthlyPrice}
							onChange={(e) => {
								const inputValue = e.target.value;
								if (/^\d+$/.test(inputValue) && parseInt(inputValue) >= 0) {
									setRealStateData({
										...realstateData,
										monthlyPrice: inputValue,
									});
								}
							}}
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
							value={nightlyPrice}
							onChange={(e) => {
								const inputValue = e.target.value;
								if (/^\d+$/.test(inputValue) && parseInt(inputValue) >= 0) {
									setRealStateData({
										...realstateData,
										nightlyPrice: inputValue,
									});
								}
							}}
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
							value={address}
							onChange={(e) => {
								setRealStateData({
									...realstateData,
									address: e.target.value,
								});
							}}
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
							value={isSold}
							onChange={(e) => {
								setRealStateData({
									...realstateData,
									isSold: e.target.value,
								});
							}}
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
							value={bedrooms}
							onChange={(e) => {
								const inputValue = e.target.value;
								if (/^\d+$/.test(inputValue) && parseInt(inputValue) >= 1) {
									setRealStateData({
										...realstateData,
										bedrooms: inputValue,
									});
								}
							}}
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
							value={bathrooms}
							onChange={(e) => {
								const inputValue = e.target.value;
								if (/^\d+$/.test(inputValue) && parseInt(inputValue) >= 1) {
									setRealStateData({
										...realstateData,
										bathrooms: inputValue,
									});
								}
							}}
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
							value={squarefeet}
							onChange={(e) => {
								const inputValue = e.target.value;
								if (/^\d+$/.test(inputValue) && parseInt(inputValue) >= 1) {
									setRealStateData({
										...realstateData,
										squarefeet: inputValue,
									});
								}
							}}
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
							value={businessType}
							onChange={(e) => {
								setRealStateData({
									...realstateData,
									businessType: e.target.value,
								});
							}}
							className="form-control"
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
							value={type}
							onChange={(e) => {
								setRealStateData({
									...realstateData,
									type: e.target.value,
								});
							}}
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
								value="wifi"
								className="form-check-input"
								type="checkbox"
								checked={amenities.includes("wifi")}
								onChange={handleAmenitiesChange}
							/>
							<label htmlFor="wifi" className="form-check-label">
								Wi-Fi
							</label>
						</div>
						<div className="form-check">
							<input
								id="free-parking"
								name="amenities"
								value="free-parking"
								className="form-check-input"
								type="checkbox"
								checked={amenities.includes("free-parking")}
								onChange={handleAmenitiesChange}
							/>
							<label htmlFor="free-parking" className="form-check-label">
								Free Parking
							</label>
						</div>
						<div className="form-check">
							<input
								id="elevator-access"
								name="amenities"
								value="elevator-access"
								className="form-check-input"
								type="checkbox"
								checked={amenities.includes("elevator-access")}
								onChange={handleAmenitiesChange}
							/>
							<label htmlFor="elevator-access" className="form-check-label">
								Elevator Access
							</label>
						</div>
						<div className="form-check">
							<input
								id="air-conditioning"
								name="amenities"
								value="air-conditioning"
								className="form-check-input"
								type="checkbox"
								checked={amenities.includes("air-conditioning")}
								onChange={handleAmenitiesChange}
							/>
							<label htmlFor="air-conditioning" className="form-check-label">
								Air Conditioning
							</label>
						</div>
						<div className="form-check">
							<input
								id="coffee-maker"
								name="amenities"
								value="coffee-maker"
								className="form-check-input"
								type="checkbox"
								checked={amenities.includes("coffee-maker")}
								onChange={handleAmenitiesChange}
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
								value="full-kitchen"
								className="form-check-input"
								type="checkbox"
								checked={amenities.includes("full-kitchen")}
								onChange={handleAmenitiesChange}
							/>
							<label htmlFor="full-kitchen" className="form-check-label">
								Full Kitchen
							</label>
						</div>
						<div className="form-check">
							<input
								id="swimming-pool"
								name="amenities"
								value="swimming-pool"
								className="form-check-input"
								type="checkbox"
								checked={amenities.includes("swimming-pool")}
								onChange={handleAmenitiesChange}
							/>
							<label htmlFor="swimming-pool" className="form-check-label">
								Swimming Pool
							</label>
						</div>
						<div className="form-check">
							<input
								id="dish-washer"
								name="amenities"
								value="dish-washer"
								className="form-check-input"
								type="checkbox"
								checked={amenities.includes("dish-washer")}
								onChange={handleAmenitiesChange}
							/>
							<label htmlFor="dish-washer" className="form-check-label">
								Dish Washer
							</label>
						</div>
						<div className="form-check">
							<input
								id="balcony-patio"
								name="amenities"
								value="balcony-patio"
								className="form-check-input"
								type="checkbox"
								checked={amenities.includes("balcony-patio")}
								onChange={handleAmenitiesChange}
							/>
							<label htmlFor="balcony-patio" className="form-check-label">
								Balcony / Patio
							</label>
						</div>
						<div className="form-check">
							<input
								id="laundry-room"
								name="amenities"
								value="laundry-room"
								className="form-check-input"
								type="checkbox"
								checked={amenities.includes("laundry-room")}
								onChange={handleAmenitiesChange}
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
								value="24-7-security"
								className="form-check-input"
								type="checkbox"
								checked={amenities.includes("24-7-security")}
								onChange={handleAmenitiesChange}
							/>
							<label htmlFor="24-7-security" className="form-check-label">
								24/7 Security
							</label>
						</div>
						<div className="form-check">
							<input
								id="gym-fitness-center"
								name="amenities"
								value="gym-fitness-center"
								className="form-check-input"
								type="checkbox"
								checked={amenities.includes("gym-fitness-center")}
								onChange={handleAmenitiesChange}
							/>
							<label htmlFor="gym-fitness-center" className="form-check-label">
								Gym / Fitness Center
							</label>
						</div>
						<div className="form-check">
							<input
								id="smart-tv"
								name="amenities"
								value="smart-tv"
								className="form-check-input"
								type="checkbox"
								checked={amenities.includes("smart-tv")}
								onChange={handleAmenitiesChange}
							/>
							<label htmlFor="smart-tv" className="form-check-label">
								Smart TV
							</label>
						</div>
						<div className="form-check">
							<input
								id="wheelchair-accessible"
								name="amenities"
								value="wheelchair-accessible"
								className="form-check-input"
								type="checkbox"
								checked={amenities.includes("wheelchair-accessible")}
								onChange={handleAmenitiesChange}
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
								value="hot-tub"
								className="form-check-input"
								type="checkbox"
								checked={amenities.includes("hot-tub")}
								onChange={handleAmenitiesChange}
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
					avatar={files?.selected?._id}
					status={status}
					fullWidth={false}
					password={password}
					featured={featured}
					commented={commented}
					embedding={false}
					github_readme={""}
					category={undefined}
					categories={[]}
					objectData={realstateData}
					setObjectData={setRealStateData}
					multipleFiles={false}
					onModel={"RealState"}
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

export default CreateRealState;
