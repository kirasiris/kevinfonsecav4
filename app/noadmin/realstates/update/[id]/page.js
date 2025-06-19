import { notFound, redirect } from "next/navigation";
import {
	fetchurl,
	getAuthTokenOnServer,
	getUserOnServer,
} from "@/helpers/setTokenOnServer";
import AdminSidebar from "@/components/admin/myfinaladminsidebar";
import MyTextArea from "@/components/global/myfinaltextarea";
import FormButtons from "@/components/global/formbuttons";

async function getRealState(params) {
	const res = await fetchurl(`/global/realstates${params}`, "GET", "no-cache");
	if (!res.success) notFound();
	return res;
}

const UpdateRealState = async ({ params, searchParams }) => {
	const awtdParams = await params;
	const awtdSearchParams = await searchParams;
	const token = await getAuthTokenOnServer();
	const auth = await getUserOnServer();

	const realstate = await getRealState(`/${awtdParams.id}`);

	const upgradeRealState = async (formData) => {
		"use server";
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
			files: { avatar: formData.get("file") },
		};

		await fetchurl(
			`/noadmin/realstates/${awtdParams.id}`,
			"PUT",
			"no-cache",
			rawFormData
		);
		redirect(`/noadmin/realstates`);
	};

	return (
		<form className="row" action={upgradeRealState}>
			<div className="col">
				<label htmlFor="blog-title" className="form-label">
					Title
				</label>
				<input
					id="blog-title"
					name="title"
					defaultValue={realstate?.data?.title}
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
					onModel="RealState"
					advancedTextEditor={true}
					customPlaceholder="No description"
					defaultValue={realstate?.data?.text}
				/>
				<div className="row">
					<div className="col">
						<label htmlFor="weeklyPrice" className="form-label">
							Weekly Price
						</label>
						<input
							id="weeklyPrice"
							name="weeklyPrice"
							defaultValue={realstate?.data?.rates?.weeklyPrice}
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
							defaultValue={realstate?.data?.rates?.monthlyPrice}
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
							defaultValue={realstate?.data?.rates?.nightlyPrice}
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
							defaultValue={realstate?.data?.address}
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
							defaultValue={realstate?.data?.isSold}
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
							defaultValue={realstate?.data?.bedrooms}
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
							defaultValue={realstate?.data?.bathrooms}
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
							defaultValue={realstate?.data?.squarefeet}
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
							defaultValue={[realstate?.data?.businessType]}
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
							defaultValue={realstate?.data?.type}
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
								defaultChecked={realstate?.data?.amenities.includes("wifi")}
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
								defaultChecked={realstate?.data?.amenities.includes(
									"free-parking"
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
								className="form-check-input"
								type="checkbox"
								defaultChecked={realstate?.data?.amenities.includes(
									"elevator-access"
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
								className="form-check-input"
								type="checkbox"
								defaultChecked={realstate?.data?.amenities.includes(
									"air-conditioning"
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
								className="form-check-input"
								type="checkbox"
								defaultChecked={realstate?.data?.amenities.includes(
									"coffee-maker"
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
								className="form-check-input"
								type="checkbox"
								defaultChecked={realstate?.data?.amenities.includes(
									"full-kitchen"
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
								className="form-check-input"
								type="checkbox"
								defaultChecked={realstate?.data?.amenities.includes(
									"swimming-pool"
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
								className="form-check-input"
								type="checkbox"
								defaultChecked={realstate?.data?.amenities.includes(
									"dish-washer"
								)}
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
								defaultChecked={realstate?.data?.amenities.includes(
									"balcony-patio"
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
								className="form-check-input"
								type="checkbox"
								defaultChecked={realstate?.data?.amenities.includes(
									"laundry-room"
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
								className="form-check-input"
								type="checkbox"
								defaultChecked={realstate?.data?.amenities.includes(
									"24-7-security"
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
								className="form-check-input"
								type="checkbox"
								defaultChecked={realstate?.data?.amenities.includes(
									"gym-fitness-center"
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
								className="form-check-input"
								type="checkbox"
								defaultChecked={realstate?.data?.amenities.includes("smart-tv")}
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
								defaultChecked={realstate?.data?.amenities.includes(
									"wheelchair-accessible"
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
								className="form-check-input"
								type="checkbox"
								defaultChecked={realstate?.data?.amenities.includes("hot-tub")}
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
					avatar={realstate?.data?.files}
					avatarFormat={realstate?.data?.files?.avatar?.format_type}
					status={realstate?.data?.status}
					fullWidth={false}
					password=""
					featured={false}
					commented={realstate?.data?.commented.toString()}
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

export default UpdateRealState;
