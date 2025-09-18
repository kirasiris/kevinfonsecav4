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
			url: formData.get("url"),
			comparePrice: formData.get("comparePrice"),
			cost: formData.get("cost"),
			sku: formData.get("sku"),
			barcode: formData.get("barcode"),
			category: formData.get("category"),
			sub_category: formData.getAll("sub_category"),
			brand: formData.get("brand"),
			model: formData.get("model"),
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

		const res = await fetchurl(
			`/noadmin/store/products`,
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
		toast.success("Product created", "bottom");
		// router.push(`/nfabusiness/products`);
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
					type="text"
					className="form-control mb-3"
					required
					placeholder="M4A1"
					defaultValue=""
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
				<label htmlFor="price" className="form-label">
					Price
				</label>
				<input
					id="price"
					name="price"
					defaultValue="0"
					type="text"
					className="form-control mb-3"
					placeholder=""
				/>
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
				<label htmlFor="statement_descriptor" className="form-label">
					Statement Descriptor
				</label>
				<input
					id="statement_descriptor"
					name="statement_descriptor"
					type="text"
					className="form-control mb-3"
					required
					placeholder="THIS WILL APPEAR ON THE BANK STATEMENT"
					defaultValue=""
				/>
				<label htmlFor="url" className="form-label">
					Url
				</label>
				<input
					id="url"
					name="url"
					defaultValue="0"
					type="text"
					className="form-control mb-3"
					placeholder=""
				/>
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
				<label htmlFor="sku" className="form-label">
					SKU
				</label>
				<input
					id="sku"
					name="sku"
					defaultValue="0"
					type="text"
					className="form-control mb-3"
					placeholder=""
				/>
				<label htmlFor="barcode" className="form-label">
					Bar Code
				</label>
				<input
					id="barcode"
					name="barcode"
					defaultValue="0"
					type="text"
					className="form-control mb-3"
					placeholder=""
				/>
				<label htmlFor="category" className="form-label">
					Category
				</label>
				<select
					id="category"
					name="category"
					className="form-control mb-3"
					required
					defaultValue=""
				>
					<option value="none">Choose an option</option>
					<option value="rifles">Rifles</option>
					<option value="handguns">Handguns</option>
					<option value="nfa-items">NFA Items</option>
					<option value="shotguns">Shotguns</option>
					<option value="accessories">Accessories</option>
					<option value="clothing">Clothing</option>
				</select>
				<label htmlFor="sub_category" className="form-label">
					Sub category
				</label>
				<input
					id="sub_category"
					name="sub_category"
					type="text"
					className="form-control mb-3"
					required
					placeholder="5.56x45mm NATO"
					defaultValue=""
				/>
				<label htmlFor="brand" className="form-label">
					Brand
				</label>
				<input
					id="brand"
					name="brand"
					type="text"
					className="form-control mb-3"
					placeholder="COL123456"
					defaultValue=""
				/>
				<label htmlFor="model" className="form-label">
					Model
				</label>
				<input
					id="model"
					name="model"
					type="text"
					className="form-control mb-3"
					placeholder="COL123456"
					defaultValue=""
				/>
				{/* Files */}
				{/* Variants */}
				{/* Specifications */}
				<label htmlFor="features" className="form-label">
					Features
				</label>
				<input
					id="features"
					name="features"
					type="text"
					className="form-control mb-3"
					placeholder="COL123456"
					defaultValue=""
				/>
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
				<label htmlFor="shippable" className="form-label">
					Shippable
				</label>
				<select
					id="shippable"
					name="shippable"
					defaultValue={false}
					className="form-control"
				>
					<option value={true}>Yes</option>
					<option value={false}>No</option>
				</select>
				<label htmlFor="shippingClass" className="form-label">
					Shipping Class
				</label>
				<select
					id="shippingClass"
					name="shippingClass"
					className="form-control"
					required
					defaultValue=""
				>
					<option value={`standard`}>Standard</option>
					<option value={`oversized`}>Oversized</option>
					<option value={`hazmat`}>Hazmat</option>
					<option value={`restricted`}>Restricted</option>
				</select>
			</div>
			<div className="col-lg-3">
				<AdminSidebar
					displayCategoryField={false}
					displayAvatar={true}
					avatar={undefined}
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
