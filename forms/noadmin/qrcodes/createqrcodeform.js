"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { fetchurl } from "@/helpers/setTokenOnServer";
import QRC from "@/components/global/qrcode";

const CreateQrCodeForm = ({ auth = {} }) => {
	const router = useRouter();

	const [qrcodeData, setQrCodeData] = useState({
		title: ``,
		url: ``,
		qrmargin: 4,
		qrcodesize: 200,
		securitylevel: `L`,
		imageurl: ``,
		imagewidth: 30,
		imageheight: 30,
		status: "draft",
	});

	const {
		title,
		url,
		qrmargin,
		qrcodesize,
		securitylevel,
		imageurl,
		imagewidth,
		imageheight,
		status,
	} = qrcodeData;

	const [btnText, setBtnText] = useState(`Submit`);

	const createQrCode = async (e) => {
		e.preventDefault();
		setBtnText("...");
		const res = await fetchurl(`/extras/tools/qrcodes`, "POST", "no-cache", {
			...qrcodeData,
			user: auth?.userId,
			logo: {
				url: imageurl,
				width: imagewidth,
				height: imageheight,
			},
			website: process.env.NEXT_PUBLIC_WEBSITE_NAME,
			status: "published",
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
		setBtnText(btnText);
		resetForm();
		router.push(`/noadmin/qrcodes?page=1&limit=10&sort=-createdAt`);
	};

	const resetForm = () => {
		setQrCodeData({
			title: ``,
			url: ``,
			qrmargin: 4,
			qrcodesize: 200,
			securitylevel: `L`,
			imageurl: ``,
			imagewidth: 30,
			imageheight: 30,
			status: "draft",
		});
	};

	return (
		<>
			<div className="align-content-center border border-5 d-flex justify-content-center">
				<QRC
					value={url}
					qrmargin={qrmargin}
					qrcodesize={qrcodesize}
					securitylevel={securitylevel}
					imgsrc={imageurl}
					imgwidth={imagewidth}
					imgheight={imageheight}
				/>
			</div>
			<form onSubmit={createQrCode}>
				<label htmlFor="title" className="form-label">
					Title
				</label>
				<input
					id="title"
					name="title"
					value={title}
					onChange={(e) => {
						setQrCodeData({
							...qrcodeData,
							title: e.target.value,
						});
					}}
					type="text"
					className="form-control mb-3"
					placeholder="Demo"
				/>
				<label htmlFor="url" className="form-label">
					URL
				</label>
				<input
					id="url"
					name="url"
					value={url}
					onChange={(e) => {
						setQrCodeData({
							...qrcodeData,
							url: e.target.value,
						});
					}}
					type="text"
					className="form-control mb-3"
					placeholder="https://demo.com"
				/>
				<label htmlFor="qrmargin" className="form-label">
					QR Margin
				</label>
				<input
					id="qrmargin"
					name="qrmargin"
					value={qrmargin}
					onChange={(e) => {
						setQrCodeData({
							...qrcodeData,
							qrmargin: e.target.value,
						});
					}}
					type="number"
					className="form-control mb-3"
					placeholder="4"
				/>
				<label htmlFor="qrcodesize" className="form-label">
					QR Code Size
				</label>
				<input
					id="qrcodesize"
					name="qrcodesize"
					value={qrcodesize}
					onChange={(e) => {
						setQrCodeData({
							...qrcodeData,
							qrcodesize: e.target.value,
						});
					}}
					type="number"
					className="form-control mb-3"
					placeholder="200"
				/>
				<label htmlFor="securitylevel" className="form-label">
					Security Level
				</label>
				<select
					id="securitylevel"
					name="securitylevel"
					value={securitylevel}
					onChange={(e) => {
						setQrCodeData({
							...qrcodeData,
							securitylevel: e.target.value,
						});
					}}
					className="form-control mb-3"
				>
					<option value="L">Low</option>
					<option value="M">Medium</option>
					<option value="Q">Quality</option>
					<option value="H">High</option>
				</select>
				<label htmlFor="imageurl" className="form-label">
					Image Url
				</label>
				<input
					id="imageurl"
					name="imageurl"
					value={imageurl}
					onChange={(e) => {
						setQrCodeData({
							...qrcodeData,
							imageurl: e.target.value,
						});
					}}
					type="text"
					className="form-control mb-3"
					placeholder="https://demo.com/src/images/demo.png"
				/>
				<label htmlFor="imagewidth" className="form-label">
					Image Width
				</label>
				<input
					id="imagewidth"
					name="imagewidth"
					value={imagewidth}
					onChange={(e) => {
						setQrCodeData({
							...qrcodeData,
							imagewidth: e.target.value,
						});
					}}
					type="number"
					className="form-control mb-3"
					placeholder="30"
				/>
				<label htmlFor="imageheight" className="form-label">
					Image Height
				</label>
				<input
					id="imageheight"
					name="imageheight"
					value={imageheight}
					onChange={(e) => {
						setQrCodeData({
							...qrcodeData,
							imageheight: e.target.value,
						});
					}}
					type="number"
					className="form-control mb-3"
					placeholder="30"
				/>
				<button
					className="btn btn-secondary btn-sm float-start"
					type="submit"
					disabled={url?.length > 0 ? !true : !false}
				>
					{btnText}
				</button>
				<button
					className="btn btn-secondary btn-sm float-end"
					type="reset"
					onClick={resetForm}
				>
					Reset
				</button>
			</form>
		</>
	);
};

export default CreateQrCodeForm;
