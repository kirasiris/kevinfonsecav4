"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { checkEmptyObject } from "befree-utilities";
import Globalcontent from "@/layout/content";
import Globalsidebar from "@/layout/sidebar";
import { fetchurl } from "@/helpers/setTokenOnServer";
import QRC from "../global/qrcode";

const QRCodeGeneratorPage = ({ searchParams = {}, pushTo = true }) => {
	const router = useRouter();

	const [searchEmailParams, setEmailSearchParams] = useState({
		keyword: "",
	});

	const { keyword } = searchEmailParams;

	const searchData = async (e) => {
		e.preventDefault();
		router.push(`/qrcode/results?email=${keyword}`);
	};

	const [qrcode, setQrCode] = useState({});
	const [loading, setLoading] = useState(false);

	const [qrcodeData, setQrCodeData] = useState({
		title: ``,
		url: ``,
		qrmargin: 4,
		qrcodesize: 200,
		securitylevel: `L`,
		imageurl: ``,
		imagewidth: 30,
		imageheight: 30,
		name: "",
		email: "",
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
		name,
		email,
	} = qrcodeData;

	const [btnText, setBtnText] = useState(`Submit`);

	const createQrCode = async (e) => {
		e.preventDefault();
		setBtnText("...");
		const res = await fetchurl(`/extras/tools/qrcodes`, "POST", "no-cache", {
			...qrcodeData,
			logo: {
				url: imageurl,
				width: imagewidth,
				height: imageheight,
			},
			website: process.env.NEXT_PUBLIC_WEBSITE_NAME,
			status: "published",
		});
		setQrCode(res?.data);
		setBtnText(btnText);
		resetForm();
		router.push(`/qrcode/generator?_id=${res?.data?._id}`, { scroll: false });
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
			name: "",
			email: "",
		});
	};

	// Fetch single object
	useEffect(() => {
		const abortController = new AbortController();
		const fetchQRCode = async (id) => {
			const res = await fetchurl(
				`/extras/tools/qrcodes/${id}`,
				"GET",
				"default",
				{},
				abortController.signal,
				false,
				false
			);
			if (res?.data) {
				setQrCode(res.data);
				setLoading(false);
			} else {
				router.push(`/qrcode/generator`, { scroll: false });
			}
		};
		if (!checkEmptyObject(searchParams)) {
			setLoading(true);
			fetchQRCode(searchParams._id);
		}
		return () => abortController.abort();
	}, [searchParams._id]);

	return (
		<>
			<div className="container-fluid">
				<div className="row">
					<Globalsidebar>
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
							<h2>User information</h2>
							<div className="row g-2">
								<div className="col-md">
									<div className="form-floating">
										<input
											id="name"
											name="name"
											className="form-control mb-3"
											type="text"
											onChange={(e) => {
												setQrCodeData({
													...qrcodeData,
													name: e.target.value,
												});
											}}
											value={name}
										/>
										<label htmlFor="name">Name</label>
									</div>
								</div>
								<div className="col-md">
									<div className="form-floating">
										<input
											id="email"
											name="email"
											className="form-control mb-3"
											type="email"
											onChange={(e) => {
												setQrCodeData({
													...qrcodeData,
													email: e.target.value,
												});
											}}
											value={email}
										/>
										<label htmlFor="email">Type&nbsp;your&nbsp;email</label>
									</div>
								</div>
							</div>
							<button
								className="btn btn-secondary btn-sm float-start"
								type="submit"
								disabled={
									url?.length > 0 && name?.length > 0 && email?.length > 0
										? !true
										: !false
								}
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
					</Globalsidebar>
					<Globalcontent containerClasses="col-lg-8">
						<div className="card rounded-0">
							<div className="card-header">
								<div className="d-flex align-items-center">
									<button className="btn btn-link btn-sm">
										Find your QR Codes:
									</button>
									<form
										onSubmit={searchData}
										className="d-none d-md-block d-lg-block d-xl-block d-xxl-block"
									>
										<input
											id="keyword"
											name="keyword"
											value={keyword}
											onChange={(e) => {
												setEmailSearchParams({
													...searchEmailParams,
													keyword: e.target.value,
												});
											}}
											type="text"
											className="form-control"
											placeholder="Enter email"
										/>
									</form>
								</div>
							</div>
							<div className="align-content-center border border-5 d-flex justify-content-center">
								{loading ? (
									<p>Loading...</p>
								) : (
									<QRC
										value={qrcode.url || url}
										qrmargin={qrcode.qrmargin || qrmargin}
										qrcodesize={qrcode.qrcodesize || qrcodesize}
										securitylevel={qrcode.securitylevel || securitylevel}
										imgsrc={qrcode.logo?.url || imageurl}
										imgwidth={qrcode.logo?.width || imagewidth}
										imgheight={qrcode.logo?.height || imageheight}
									/>
								)}
							</div>
						</div>
					</Globalcontent>
				</div>
			</div>
		</>
	);
};

export default QRCodeGeneratorPage;
