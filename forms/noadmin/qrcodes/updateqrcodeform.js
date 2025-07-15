"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { fetchurl } from "@/helpers/setTokenOnServer";
import QRC from "@/components/global/qrcode";

const UpdateQRCodeForm = ({ object = {} }) => {
	const router = useRouter();

	const [qrcodeData, setQrCodeData] = useState({
		title: object?.data?.title,
		url: object?.data?.url,
		qrmargin: object?.data?.qrmargin,
		qrcodesize: object?.data?.qrcodesize,
		securitylevel: object?.data?.securitylevel,
		imageurl: object?.data?.logo.url,
		imagewidth: object?.data?.logo.width,
		imageheight: object?.data?.logo.height,
		status: object?.data?.status,
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
		const res = await fetchurl(
			`/extras/tools/qrcodes/${object?.data?._id}`,
			"PUT",
			"no-cache",
			{
				...qrcodeData,
				logo: {
					url: imageurl,
					width: imagewidth,
					height: imageheight,
				},
			}
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
		setBtnText(btnText);
		resetForm();
		router.push(`/noadmin/qrcodes?page=1&limit=10&sort=-createdAt`);
	};

	const resetForm = () => {
		setQrCodeData({
			title: object?.data?.title,
			url: object?.data?.url,
			qrmargin: object?.data?.qrmargin,
			qrcodesize: object?.data?.qrcodesize,
			securitylevel: object?.data?.securitylevel,
			imageurl: object?.data?.imageurl,
			imagewidth: object?.data?.imagewidth,
			imageheight: object?.data?.imageheight,
			status: object?.data?.status,
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

export default UpdateQRCodeForm;
