"use client";
import { useState } from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { fetchurl } from "@/helpers/setTokenOnServer";
import MyTextArea from "@/components/global/myfinaltextarea";

const CreateWeaponForm = ({ token = "", auth = {} }) => {
	const router = useRouter();

	const [rawFiles, setRawFiles] = useState({
		files: [""],
	});

	const [btnText, setBtnText] = useState("Submit");

	const { files } = rawFiles;

	const handleAddFile = () => {
		setRawFiles({
			...rawFiles,
			files: [...files, ""],
		});
	};

	const handleRemoveFile = (index) => {
		const newFiles = files.filter((_, i) => i !== index);
		setRawFiles({
			...rawFiles,
			files: newFiles,
		});
	};

	const handleChange = (index, value) => {
		const newFiles = [...files];
		newFiles[index] = value;
		setRawFiles({
			...rawFiles,
			files: newFiles,
		});
	};

	const createWeapon = async (e) => {
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
			nfaClassification: formData.get("nfaClassification"),
			text: formData.get("text"),
			files: formData.getAll("files[]"),
		};

		const res = await fetchurl(
			`/noadmin/weapons`,
			"POST",
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
		toast.success("Weapon created", "bottom");
		router.push(`/nfabusiness/weapons`);
	};

	const resetForm = (e) => {
		e.target.closest("form").reset();
	};

	return (
		<form className="row" onSubmit={createWeapon}>
			<div className="col">
				<div className="row">
					<div className="col">
						<label htmlFor="manufacturer" className="form-label">
							Manufacturer
						</label>
						<input
							id="manufacturer"
							name="manufacturer"
							type="text"
							className="form-control mb-3"
							required
							placeholder="Ruger"
							defaultValue=""
						/>
					</div>
					<div className="col">
						<label htmlFor="title" className="form-label">
							Model / Title
						</label>
						<input
							id="title"
							name="title"
							type="text"
							className="form-control mb-3"
							required
							placeholder="M4A1"
							defaultValue=""
						/>
					</div>
					<div className="col">
						<label htmlFor="type" className="form-label">
							Type
						</label>
						<select
							id="type"
							name="type"
							className="form-control mb-3"
							required
							defaultValue=""
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
					</div>
				</div>
				<div className="row">
					<div className="col">
						<label htmlFor="caliber" className="form-label">
							Caliber
						</label>
						<input
							id="caliber"
							name="caliber"
							type="text"
							className="form-control mb-3"
							required
							placeholder="5.56x45mm NATO"
							defaultValue=""
						/>
					</div>
					<div className="col">
						<label htmlFor="serialNumber" className="form-label">
							Serial Number
						</label>
						<input
							id="serialNumber"
							name="serialNumber"
							type="text"
							className="form-control mb-3"
							placeholder="COL123456"
							defaultValue=""
						/>
					</div>
					<div className="col">
						<label htmlFor="nfaClassification" className="form-label">
							NFA Classification
						</label>
						<select
							id="nfaClassification"
							name="nfaClassification"
							className="form-control mb-3"
							required
							defaultValue=""
						>
							<option value="none">Choose an option</option>
							<option value="short-barrel-rifle">Short Barrel Rifle</option>
							<option value="short-barrel-shotgun">Short Barrel Shotgun</option>
							<option value="supressor">Supressor</option>
							<option value="any-other-weapon">Any Other Weapon</option>
							<option value="destructive-device">Destructive Device</option>
							<option value="machine-gun">Machine Gun</option>
						</select>
					</div>
				</div>
				<label htmlFor="files" className="form-label">
					Files (File URLs)
				</label>
				{files.map((file, index) => (
					<div key={index} className="d-flex mb-3">
						<input
							id={`file-${index}`}
							name="files[]"
							value={file}
							onChange={(e) => handleChange(index, e.target.value)}
							type="text"
							className="form-control me-2"
							placeholder="Enter file URL"
						/>
						<button
							type="button"
							className="btn btn-danger"
							onClick={() => handleRemoveFile(index)}
							disabled={files.length === 1}
						>
							Remove
						</button>
					</div>
				))}
				<button
					type="button"
					className="btn btn-secondary mb-3 w-100"
					onClick={handleAddFile}
				>
					Add File
				</button>
				<label htmlFor="text" className="form-label">
					Message
				</label>
				<MyTextArea
					auth={auth}
					token={token}
					id="text"
					name="text"
					defaultValue="No description..."
					onModel="Weapon"
					advancedTextEditor={false}
					customPlaceholder="No description"
				/>
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

export default CreateWeaponForm;
