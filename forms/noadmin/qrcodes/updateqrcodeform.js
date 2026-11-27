"use client";
import { useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import QRC from "@/components/global/qrcode";
import FormButtons from "@/components/global/formbuttons";
import { isFailure, safeFetch } from "@/helpers/filemanagerhelpers";
import { useIsMounted } from "@/components/global/filemanagerui";
import {
	actionMessage,
	shakeElement,
} from "@/components/global/actionfeedback";

const savedQrCodeOf = (object) => ({
	url: object?.data?.url,
	qrmargin: object?.data?.qrmargin,
	qrcodesize: object?.data?.qrcodesize,
	securitylevel: object?.data?.securitylevel,
	imageurl: object?.data?.logo?.url,
	imagewidth: object?.data?.logo?.width,
	imageheight: object?.data?.logo?.height,
});

const UpdateQRCodeForm = ({
	currentpage = "/noadmin/qrcodes?page=1&limit=10&sort=-createdAt",
	object = {},
}) => {
	const router = useRouter();
	const isMountedRef = useIsMounted();
	const submittingRef = useRef(false);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [isLeaving, startLeaving] = useTransition();
	const [error, setError] = useState("");

	const [qrcodeData, setQrCodeData] = useState(() => savedQrCodeOf(object));

	const {
		url,
		qrmargin,
		qrcodesize,
		securitylevel,
		imageurl,
		imagewidth,
		imageheight,
	} = qrcodeData;

	const upgradeQrCode = async (e) => {
		e.preventDefault();
		if (submittingRef.current) {
			return;
		}
		const form = e.currentTarget;
		const formData = new FormData(form);

		const rawFormData = {
			title: formData.get("title"),
			url: formData.get("url"),
			qrmargin: formData.get("qrmargin"),
			qrcodesize: formData.get("qrcodesize"),
			securitylevel: formData.get("securitylevel"),
			logo: {
				url: formData.get("imageurl"),
				width: formData.get("imagewidth"),
				height: formData.get("imageheight"),
			},
		};

		submittingRef.current = true;
		setIsSubmitting(true);
		setError("");
		const res = await safeFetch(
			`/noadmin/qrcodes/${object?.data?._id}`,
			"PUT",
			"no-cache",
			rawFormData,
			undefined,
			false,
			false,
		);
		submittingRef.current = false;
		if (!isMountedRef.current) {
			return;
		}
		setIsSubmitting(false);

		if (isFailure(res)) {
			setError(actionMessage(res, "Could not update the QR code"));
			shakeElement(form);
			return;
		}
		toast.success("QR Code upgraded");
		startLeaving(() => router.push(currentpage));
	};

	const resetForm = () => {
		setError("");
		setQrCodeData(savedQrCodeOf(object));
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
					title={url ? `QR code preview for ${url}` : "QR code preview"}
				/>
			</div>
			<form
				key={object?.data?._id}
				onSubmit={upgradeQrCode}
				onReset={resetForm}
			>
				<label htmlFor="title" className="form-label">
					Title
				</label>
				<input
					id="title"
					name="title"
					defaultValue={object?.data?.title}
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
					defaultValue={object?.data?.url}
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
					defaultValue={object?.data?.qrmargin}
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
					defaultValue={object?.data?.qrcodesize}
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
					defaultValue={object?.data?.securitylevel}
					onChange={(e) => {
						setQrCodeData({
							...qrcodeData,
							securitylevel: e.target.value,
						});
					}}
					className="form-select mb-3"
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
					defaultValue={object?.data?.logo?.url}
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
					defaultValue={object?.data?.logo?.width}
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
					defaultValue={object?.data?.logo?.height}
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
				{error && (
					<div className="alert alert-danger py-2 px-3 mb-3 small" role="alert">
						{error}
					</div>
				)}
				<FormButtons pending={isSubmitting || isLeaving} />
			</form>
		</>
	);
};

export default UpdateQRCodeForm;
