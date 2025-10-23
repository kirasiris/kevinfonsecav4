"use client";
import { useState } from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { fetchurl } from "@/helpers/setTokenOnServer";
import MyTextArea from "@/components/global/myfinaltextarea";
import AdminSidebar from "@/components/noadmin/myfinaladminsidebar";
import FormButtons from "@/components/global/formbuttons";

const CreateProductForm = ({ token = {}, auth = {} }) => {
	const router = useRouter();

	const [showCategories, setShowCategories] = useState(true);

	const [btnText, setBtnText] = useState("Submit");

	const addProduct = async (e) => {
		e.preventDefault();
		setBtnText(`Processing...`);
		const form = e.target;
		const formData = new FormData(form);

		const rawFormData = {
			title: formData.get("title"),
			text: formData.get("text"),
			price: formData.get("price"),
			isFree: formData.get("isFree"),
			active: formData.get("active"),
			statement_descriptor: formData.get("statement_descriptor"),
			comparePrice: formData.get("comparePrice"),
			cost: formData.get("cost"),
			sku: formData.get("sku"),
			barcode: formData.get("barcode"),
			category: formData.get("category"),
			sub_category: formData.getAll("sub_category"),
			brand: formData.get("brand"),
			model: formData.get("model"),
			type: formData.get("type"),
			caliber: formData.get("caliber"),
			serialNumber: formData.get("serialNumber"),
			nfaClassification: formData.get("nfaClassification"),
			files: { avatar: formData.get("file") || undefined },
			variants: {},
			specifications: {},
			features: formData.get("features"),
			stockQuantity: formData.get("stockQuantity"),
			lowStockThreshold: formData.get("lowStockThreshold"),
			trackInventory: formData.get("trackInventory"),
			inStock: formData.get("inStock"),
			status: formData.get("status"),
			featured: formData.get("featured"),
			nfaItem: formData.get("nfaItem"),
			requiresBackgroundCheck: formData.get("requiresBackgroundCheck"),
			ageRestriction: formData.get("ageRestriction"),
			package_dimensions: {
				weight: formData.get("weight"),
				length: formData.get("length"),
				width: formData.get("width"),
				height: formData.get("height"),
			},
			shippable: formData.get("shippable"),
			shippingClass: formData.get("shippingClass"),
			commented: formData.get("commented"),
		};

		const res = await fetchurl(`/noadmin/stripe/products`, "POST", "no-cache", {
			...rawFormData,
			resourceId: auth?.companyId,
			onModel: "Company",
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
		toast.success("Product created", "bottom");
		router.push(`/nfabusiness/products`);
	};

	const resetForm = (e) => {
		e.target.closest("form").reset();
	};

	return (
		<form className="row" onSubmit={addProduct}>
			<div className="col">
				<label htmlFor="title" className="form-label">
					Title
				</label>
				<input
					id="title"
					name="title"
					defaultValue=""
					type="text"
					className="form-control mb-3"
					required
					placeholder="M4A1"
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
					onModel="Product"
					advancedTextEditor={false}
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
							defaultValue="0"
							type="text"
							className="form-control mb-3"
							required
							placeholder=""
						/>
					</div>
					<div className="col">
						<label htmlFor="comparePrice" className="form-label">
							Compare Price
						</label>
						<input
							id="comparePrice"
							name="comparePrice"
							defaultValue="0"
							type="text"
							className="form-control"
							placeholder=""
						/>
						<p className="text-small mb-3">
							Should always be bigger than price to apply discount
						</p>
					</div>
					<div className="col">
						<label htmlFor="cost" className="form-label">
							Cost
						</label>
						<input
							id="cost"
							name="cost"
							defaultValue="0"
							type="text"
							className="form-control mb-3"
							placeholder=""
						/>
					</div>
				</div>
				<div className="row">
					<div className="col">
						<label htmlFor="isFree" className="form-label">
							Is it free?
						</label>
						<select
							id="isFree"
							name="isFree"
							defaultValue={true}
							className="form-control mb-3"
						>
							<option value={true}>Yes</option>
							<option value={false}>No</option>
						</select>
						<p className="text-small mb-3">
							If free, price will be set to zero
						</p>
					</div>
					<div className="col">
						<label htmlFor="active" className="form-label">
							Activate
						</label>
						<select
							id="active"
							name="active"
							defaultValue={true}
							className="form-control mb-3"
						>
							<option value={true}>Yes</option>
							<option value={false}>No</option>
						</select>
					</div>
				</div>
				<div className="row">
					<div className="col">
						<label htmlFor="statement_descriptor" className="form-label">
							Statement Descriptor (22 characters. max)
						</label>
						<input
							id="statement_descriptor"
							name="statement_descriptor"
							defaultValue="ARMED CODE, LLC BANK STATEMENT"
							type="text"
							className="form-control mb-3"
							placeholder="This is what will appear in the user's bank statement account"
						/>
					</div>
					<div className="col">
						<label htmlFor="sku" className="form-label">
							SKU
						</label>
						<input
							id="sku"
							name="sku"
							defaultValue="0"
							type="text"
							className="form-control mb-3"
							required
							placeholder=""
						/>
					</div>
					<div className="col">
						<label htmlFor="barcode" className="form-label">
							Bar Code
						</label>
						<input
							id="barcode"
							name="barcode"
							defaultValue="0"
							type="text"
							className="form-control mb-3"
							required
							placeholder=""
						/>
					</div>
				</div>
				<div className="row">
					<div className="col">
						<label htmlFor="category" className="form-label">
							Category
						</label>
						<select
							id="category"
							name="category"
							defaultValue="all"
							className="form-control mb-3"
							onChange={(e) => setShowCategories(e.target.value)}
							required
						>
							<option value="all">Choose an option</option>
							<option value="weapons">Weapons</option>
							<option value="accessories">Accessories</option>
							<option value="clothing">Clothing</option>
						</select>
					</div>
					{showCategories === "accessories" && (
						<div className="col">
							<label htmlFor="sub_category" className="form-label">
								Sub categories for accessories
							</label>
							<select
								id="sub_category"
								name="sub_category"
								defaultValue="all"
								className="form-control mb-3"
								multiple
							>
								<option value="all">All</option>
								<option value="magazines">Magazines</option>
								<option value="buttstocks">Butt Stocks</option>
								<option value="grips">Grips</option>
								<option value="handguards">Handguards</option>
								<option value="slings">Slings</option>
								<option value="optics">Optics</option>
								<option value="mounts">Mounts</option>
								<option value="tools">Tools</option>
							</select>
						</div>
					)}
					{showCategories === "clothing" && (
						<div className="col">
							<label htmlFor="sub_category" className="form-label">
								Sub categories for clothing
							</label>
							<select
								id="sub_category"
								name="sub_category"
								defaultValue="all"
								className="form-control mb-3"
								multiple
							>
								<option value="all">All</option>
								<option value="male">Male</option>
								<option value="female">Female</option>
								<option value="unisex">Unisex</option>
								<option value="shirts">Shirts</option>
								<option value="shorts">Shorts</option>
								<option value="pants">Pants</option>
								<option value="footwear">Footwear</option>
								<option value="outerwear">Outerwear</option>
							</select>
						</div>
					)}
				</div>
				{showCategories === "weapons" && (
					<>
						<div className="row">
							<div className="col">
								<label htmlFor="nfaItem" className="form-label">
									NFA Item
								</label>
								<select
									id="nfaItem"
									name="nfaItem"
									defaultValue={true}
									className="form-control mb-3"
								>
									<option value={true}>Yes</option>
									<option value={false}>No</option>
								</select>
							</div>
							<div className="col">
								<label htmlFor="requiresBackgroundCheck" className="form-label">
									Requires Background Check?
								</label>
								<select
									id="requiresBackgroundCheck"
									name="requiresBackgroundCheck"
									defaultValue={true}
									className="form-control mb-3"
								>
									<option value={true}>Yes</option>
									<option value={false}>No</option>
								</select>
							</div>
							<div className="col">
								<label htmlFor="ageRestriction" className="form-label">
									Age Restriction
								</label>
								<input
									id="ageRestriction"
									name="ageRestriction"
									defaultValue="18"
									type="text"
									className="form-control mb-3"
									placeholder=""
								/>
							</div>
						</div>
						<div className="row">
							<div className="col">
								<label htmlFor="brand" className="form-label">
									Brand / Manufacturer
								</label>
								<input
									id="brand"
									name="brand"
									defaultValue="Brand"
									type="text"
									className="form-control mb-3"
									placeholder="Ruger"
								/>
							</div>
							<div className="col">
								<label htmlFor="model" className="form-label">
									Model
								</label>
								<input
									id="model"
									name="model"
									defaultValue="AR15"
									type="text"
									className="form-control mb-3"
									placeholder="AR15"
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
									defaultValue="all"
								>
									<option value="all">Choose an option</option>
									<option value="rifle">Rifle</option>
									<option value="shotgun">Shotgun</option>
									<option value="pistol">Pistol</option>
									<option value="supressor">Supressor</option>
									<option value="short-barrel-rifle">Short Barrel Rifle</option>
									<option value="short-barrel-shotgun">
										Short Barrel Shotgun
									</option>
									<option value="any-other-weapon">Any Other Weapon</option>
									<option value="destructive-device">Destructive Device</option>
									<option value="machine-gun">Machine Gun</option>
								</select>
							</div>
							<div className="col">
								<label htmlFor="caliber" className="form-label">
									Caliber
								</label>
								<input
									id="caliber"
									name="caliber"
									defaultValue="5.56x45mm NATO"
									type="text"
									className="form-control mb-3"
									placeholder="5.56x45mm NATO"
								/>
							</div>
							<div className="col">
								<label htmlFor="serialNumber" className="form-label">
									Serial Number
								</label>
								<input
									id="serialNumber"
									name="serialNumber"
									defaultValue="COL123456"
									type="text"
									className="form-control mb-3"
									placeholder="COL123456"
								/>
							</div>
							<div className="col">
								<label htmlFor="nfaClassification" className="form-label">
									NFA Classification
								</label>
								<select
									id="nfaClassification"
									name="nfaClassification"
									defaultValue="none"
									className="form-control mb-3"
									required
								>
									<option value="none">Choose an option</option>
									<option value="short-barrel-rifle">Short Barrel Rifle</option>
									<option value="short-barrel-shotgun">
										Short Barrel Shotgun
									</option>
									<option value="supressor">Supressor</option>
									<option value="any-other-weapon">Any Other Weapon</option>
									<option value="destructive-device">Destructive Device</option>
									<option value="machine-gun">Machine Gun</option>
								</select>
							</div>
						</div>
					</>
				)}
				{/* Files */}
				{/* Variants */}
				{/* Specifications */}
				<div className="row">
					<div className="col">
						<label htmlFor="features" className="form-label">
							Features
						</label>
						<input
							id="features"
							name="features"
							defaultValue=""
							type="text"
							className="form-control mb-3"
							placeholder="COL123456"
						/>
					</div>
					<div className="col">
						<label htmlFor="stockQuantity" className="form-label">
							Stock Quantity
						</label>
						<input
							id="stockQuantity"
							name="stockQuantity"
							defaultValue="0"
							type="text"
							className="form-control mb-3"
							placeholder=""
						/>
					</div>
					<div className="col">
						<label htmlFor="lowStockThreshold" className="form-label">
							Low Stock Threshold
						</label>
						<input
							id="lowStockThreshold"
							name="lowStockThreshold"
							defaultValue="5"
							min="5"
							type="text"
							className="form-control mb-3"
							placeholder=""
						/>
					</div>
				</div>
				<div className="row">
					<div className="col">
						<label htmlFor="trackInventory" className="form-label">
							Track Inventory
						</label>
						<select
							id="trackInventory"
							name="trackInventory"
							defaultValue={true}
							className="form-control mb-3"
						>
							<option value={true}>Yes</option>
							<option value={false}>No</option>
						</select>
					</div>
					<div className="col">
						<label htmlFor="inStock" className="form-label">
							In Stock
						</label>
						<select
							id="inStock"
							name="inStock"
							defaultValue={true}
							className="form-control mb-3"
						>
							<option value={true}>Yes</option>
							<option value={false}>No</option>
						</select>
					</div>
				</div>
				<div className="row">
					<div className="col">
						<label htmlFor="weight" className="form-label">
							Weight
						</label>
						<input
							id="weight"
							name="weight"
							defaultValue="0"
							type="text"
							className="form-control mb-3"
							placeholder=""
						/>
					</div>
					<div className="col">
						<label htmlFor="length" className="form-label">
							Length
						</label>
						<input
							id="length"
							name="length"
							defaultValue="0"
							type="text"
							className="form-control mb-3"
							placeholder=""
						/>
					</div>
					<div className="col">
						<label htmlFor="width" className="form-label">
							Width
						</label>
						<input
							id="width"
							name="width"
							defaultValue="0"
							type="text"
							className="form-control mb-3"
							placeholder=""
						/>
					</div>
					<div className="col">
						<label htmlFor="height" className="form-label">
							Height
						</label>
						<input
							id="height"
							name="height"
							defaultValue="0"
							type="text"
							className="form-control mb-3"
							placeholder=""
						/>
					</div>
				</div>
				<div className="row">
					<div className="col">
						<label htmlFor="shippable" className="form-label">
							Shippable
						</label>
						<select
							id="shippable"
							name="shippable"
							defaultValue={false}
							className="form-control mb-3"
						>
							<option value={true}>Yes</option>
							<option value={false}>No</option>
						</select>
					</div>
					<div className="col">
						<label htmlFor="shippingClass" className="form-label">
							Shipping Class
						</label>
						<select
							id="shippingClass"
							name="shippingClass"
							defaultValue="standard"
							className="form-control mb-3"
							required
						>
							<option value={`standard`}>Standard</option>
							<option value={`oversized`}>Oversized</option>
							<option value={`hazmat`}>Hazmat</option>
							<option value={`restricted`}>Restricted</option>
						</select>
					</div>
				</div>
			</div>
			<div className="col-lg-3">
				<AdminSidebar
					displayCategoryField={false}
					displayAvatar={true}
					avatar={undefined}
					avatarFormat="image"
					status="draft"
					fullWidth={false}
					password=""
					featured={true}
					commented={true}
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

export default CreateProductForm;
