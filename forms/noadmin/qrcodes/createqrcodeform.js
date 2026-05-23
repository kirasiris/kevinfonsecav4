"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { fetchurl } from "@/helpers/setTokenOnServer";
import QRC from "@/components/global/qrcode";
import FormButtons from "@/components/global/formbuttons";

const CreateQrCodeForm = ({ auth = {} }) => {
	const router = useRouter();

	const [qrcodeData, setQrCodeData] = useState({
		url: "",
		qrmargin: 5,
		qrcodesize: 300,
		securitylevel: "L",
		imageurl: "",
		imagewidth: 100,
		imageheight: 100,
	});

	const {
		url,
		qrmargin,
		qrcodesize,
		securitylevel,
		imageurl,
		imagewidth,
		imageheight,
	} = qrcodeData;

	const [btnText, setBtnText] = useState(`Submit`);

	const addQrCode = async (e) => {
		e.preventDefault();
		setBtnText("Processing...");
		const form = e.target;
		const formData = new FormData(form);

		const rawFormData = {
			title: formData.get("title"),
			url: formData.get("url"),
			qrmargin: formData.get("qrmargin"),
			qrcodesize: formData.get("qrcodesize"),
			securitylevel: formData.get("securitylevel"),
			user: auth?.userId,
			logo: {
				url: formData.get("imageurl"),
				width: formData.get("imagewidth"),
				height: formData.get("imageheight"),
			},
			website: process.env.NEXT_PUBLIC_WEBSITE_NAME,
			status: "published",
		};

		const res = await fetchurl(
			`/global/qrcodes`,
			"POST",
			"no-cache",
			rawFormData,
			undefined,
			false,
			false,
		);

		if (res.status === "error") {
			toast.error(res.message);
			setBtnText("Submit");
			return;
		}

		if (res.status === "fail") {
			toast.error(res.message);
			setBtnText("Submit");
			return;
		}

		toast.success("QR Code created");
		setBtnText(btnText);
		router.push(`/noadmin/qrcodes?page=1&limit=10&sort=-createdAt`);
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
			<form onSubmit={addQrCode}>
				<label htmlFor="title" className="form-label">
					Title
				</label>
				<input
					id="title"
					name="title"
					defaultValue=""
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
					defaultValue=""
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
					defaultValue="5"
					onChange={(e) => {
						setQrCodeData({
							...qrcodeData,
							qrmargin: e.target.value,
						});
					}}
					type="number"
					className="form-control mb-3"
					placeholder="5"
				/>
				<label htmlFor="qrcodesize" className="form-label">
					QR Code Size
				</label>
				<input
					id="qrcodesize"
					name="qrcodesize"
					defaultValue="300"
					onChange={(e) => {
						setQrCodeData({
							...qrcodeData,
							qrcodesize: e.target.value,
						});
					}}
					type="number"
					className="form-control mb-3"
					placeholder="300"
				/>
				<label htmlFor="securitylevel" className="form-label">
					Security Level
				</label>
				<select
					id="securitylevel"
					name="securitylevel"
					defaultValue="L"
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
					defaultValue=""
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
					defaultValue="100"
					onChange={(e) => {
						setQrCodeData({
							...qrcodeData,
							imagewidth: e.target.value,
						});
					}}
					type="number"
					className="form-control mb-3"
					placeholder="100"
				/>
				<label htmlFor="imageheight" className="form-label">
					Image Height
				</label>
				<input
					id="imageheight"
					name="imageheight"
					defaultValue="100"
					onChange={(e) => {
						setQrCodeData({
							...qrcodeData,
							imageheight: e.target.value,
						});
					}}
					type="number"
					className="form-control mb-3"
					placeholder="100"
				/>
				<FormButtons />
			</form>
		</>
	);
};

export default CreateQrCodeForm;
