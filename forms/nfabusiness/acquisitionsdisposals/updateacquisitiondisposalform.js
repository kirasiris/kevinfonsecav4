"use client";
import { useState } from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { fetchurl } from "@/helpers/setTokenOnServer";
import MyTextArea from "@/components/global/myfinaltextarea";

const UpdateAcquisitionDisposalForm = ({
	object = {},
	token = "",
	auth = {},
}) => {
	const router = useRouter();

	const [btnText, setBtnText] = useState("Submit");

	const upgradeAcquisitionDisposal = async (e) => {
		e.preventDefault();
		setBtnText(`Processing...`);
		const form = e.target;
		const formData = new FormData(form);

		const rawFormData = {
			manufacturer: formData.get("manufacturer"),
			title: formData.get("title"),
			type: formData.get("type"),
			caliber: formData.get("caliber"),
			serialNumber: formData.get("serialNumber"),
			fromWhomReceived: formData.get("fromWhomReceived"),
			name: formData.get("name"),
			address: formData.get("address"),
			text: formData.get("text"),
			status: formData.get("status"),
		};

		const res = await fetchurl(
			`/noadmin/acquisitionsdisposals/${object?.data?._id}`,
			"PUT",
			"no-cache",
			rawFormData
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
		toast.success("Weapon acquistion and disposal updated", "bottom");
		router.push(`/nfabusiness/acquisitionsdisposals`);
	};

	const resetForm = (e) => {
		e.target.closest("form").reset();
	};

	return (
		<form className="row" onSubmit={upgradeAcquisitionDisposal}>
			<div className="col-lg-6">
				<h6 className="display-6">Description</h6>
				<label htmlFor="manufacturer" className="form-label">
					Manufacturer and/or Importer
				</label>
				<input
					id="manufacturer"
					name="manufacturer"
					defaultValue={object?.data?.manufacturer}
					type="text"
					className="form-control mb-3"
					required
					placeholder="Ruger"
				/>
				<label htmlFor="title" className="form-label">
					Model
				</label>
				<input
					id="title"
					name="title"
					defaultValue={object?.data?.title}
					type="text"
					className="form-control mb-3"
					required
					placeholder="M4A1"
				/>
				<label htmlFor="type" className="form-label">
					Type
				</label>
				<select
					id="type"
					name="type"
					defaultValue={object?.data?.type}
					className="form-control mb-3"
					required
				>
					<option value="none">Choose an option</option>
					<option value="rifle">Rifle</option>
					<option value="shotgun">Shotgun</option>
					<option value="pistol">Pistol</option>
					<option value="supressor">Supressor</option>
					<option value="short-barrel-rifle">Short Barrel Rifle</option>
					<option value="short-barrel-shotgun">Short Barrel Shotgun</option>
					<option value="any-other-weapon">Any Other Weapon</option>
					<option value="destructive-device">Destructive Device</option>
					<option value="machine-gun">Machine Gun</option>
				</select>
				<label htmlFor="caliber" className="form-label">
					Caliber
				</label>
				<input
					id="caliber"
					name="caliber"
					defaultValue={object?.data?.caliber}
					type="text"
					className="form-control mb-3"
					required
					placeholder="5.56x45mm NATO"
				/>
				<label htmlFor="serialNumber" className="form-label">
					Serial Number
				</label>
				<input
					id="serialNumber"
					name="serialNumber"
					defaultValue={object?.data?.serialNumber}
					type="text"
					className="form-control mb-3"
					placeholder="COL123456"
				/>
			</div>
			<div className="col-lg-6">
				<h6 className="display-6">Receipt</h6>
				<label htmlFor="fromWhomReceived" className="form-label">
					From Whom Received
				</label>
				<input
					id="fromWhomReceived"
					name="fromWhomReceived"
					defaultValue={object?.data?.fromWhomReceived}
					type="text"
					className="form-control"
					required
					placeholder="Shootsmart"
				/>
				<small className="mb-3">
					Name and Address or Name and License Number "FFL"
				</small>
				<h6 className="display-6">Disposal</h6>
				<label htmlFor="name" className="form-label">
					Name
				</label>
				<input
					id="name"
					name="name"
					defaultValue={object?.data?.name}
					type="text"
					className="form-control mb-3"
					required
					placeholder="John Doe"
				/>
				<label htmlFor="address" className="form-label">
					Address
				</label>
				<input
					id="address"
					name="address"
					defaultValue={object?.data?.address}
					type="text"
					className="form-control"
					required
					placeholder=""
				/>
				<small className="mb-3">
					Or Form 4473 Serial Number if Forms 4473 Filed Numerically
				</small>
			</div>
			<div className="col">
				<label htmlFor="text" className="form-label">
					Notes
				</label>
				<MyTextArea
					auth={auth}
					token={token}
					id="text"
					name="text"
					defaultValue={object?.data?.text}
					onModel="Weapon"
					advancedTextEditor={false}
					customPlaceholder="No description"
				/>
				<label htmlFor="status" className="form-label">
					Status
				</label>
				<select
					id="status"
					name="status"
					defaultValue={object?.data?.status}
					className="form-control mb-3"
					required
				>
					<option value={`draft`}>Draft</option>
					<option value={`published`}>Published</option>
					<option value={`acquired`}>Acquired</option>
					<option value={`disposed`}>Disposed</option>
				</select>
				<button type="submit" className="btn btn-secondary btn-sm float-start">
					{btnText}
				</button>
				<button
					type="reset"
					onClick={resetForm}
					className="btn btn-secondary btn-sm float-end"
				>
					Reset
				</button>
			</div>
		</form>
	);
};

export default UpdateAcquisitionDisposalForm;
