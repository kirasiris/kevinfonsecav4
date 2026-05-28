"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { Form } from "react-bootstrap";
import Modal from "react-bootstrap/Modal";
import {
	EmailShareButton,
	FacebookShareButton,
	XShareButton,
	RedditShareButton,
	WhatsappShareButton,
	PinterestShareButton,
	LinkedinShareButton,
	TelegramShareButton,
	EmailIcon,
	FacebookIcon,
	TwitterIcon,
	RedditIcon,
	WhatsappIcon,
	PinterestIcon,
	LinkedinIcon,
	TelegramIcon,
} from "react-share";

const ExportModal = ({
	object = {},
	linkToShare = process.env.NEXT_PUBLIC_WEBSITE_URL,
	iconSize = "45",
}) => {
	const [showExportModal, setShowExportModal] = useState(false);
	const [copiedUrl, setCopiedUrl] = useState(false);
	const [copiedEmbed, setCopiedEmbed] = useState(false);
	const timeoutRef = useRef(null);

	useEffect(() => {
		return () => {
			if (timeoutRef.current) {
				clearTimeout(timeoutRef.current);
			}
		};
	}, []);

	useEffect(() => {
		if (!showExportModal) {
			setCopiedUrl(false);
			setCopiedEmbed(false);
		}
	}, [showExportModal]);

	const copyToClipboard = useCallback((text, type) => {
		navigator.clipboard.writeText(text);
		if (timeoutRef.current) clearTimeout(timeoutRef.current);
		if (type === "url") {
			setCopiedUrl(true);
			timeoutRef.current = setTimeout(() => setCopiedUrl(false), 2000);
		} else {
			setCopiedEmbed(true);
			timeoutRef.current = setTimeout(() => setCopiedEmbed(false), 2000);
		}
	}, []);

	// if (!showExportModal) {
	// 	return null;
	// }

	const presentationUrl = `${process.env.NEXT_PUBLIC_WEBSITE_URL}${linkToShare}`;
	const embedCode = `<iframe src="${presentationUrl}" width="100%" height="600" frameborder="0" allowfullscreen></iframe>`;

	return (
		<>
			<button
				className="btn btn-secondary btn-sm"
				type="button"
				onClick={() => setShowExportModal(true)}
				id={object._id}
			>
				Export
			</button>
			<Modal
				id={object._id}
				show={showExportModal}
				onHide={() => setShowExportModal(!showExportModal)}
				size={`xl`}
				backdrop={true}
				animation={true}
			>
				<Modal.Header closeButton>
					<Modal.Title>
						Export&nbsp;-&nbsp;{object?.title || "Object"}
					</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<div className="input-group">
						<Form.Control readOnly disabled value={presentationUrl} />
						<button
							className={`btn ${copiedUrl ? "btn-success" : "btn-outline-secondary"}`}
							onClick={() => copyToClipboard(presentationUrl, "url")}
						>
							{copiedUrl ? "Copied!" : "Copy"}
						</button>
					</div>
					<hr />
					<div className="input-group">
						<input
							readOnly
							disabled
							value={embedCode}
							className="form-control text-bg-dark"
						/>
						<button
							className={`btn btn-sm ${copiedEmbed ? "btn-success" : "btn-outline-secondary"}`}
							onClick={() => copyToClipboard(embedCode, "embed")}
						>
							{copiedEmbed ? "Copied!" : "Copy"}
						</button>
					</div>
					<hr />
					<EmailShareButton subject={object?.title} body={object?.text}>
						<EmailIcon size={iconSize} />
					</EmailShareButton>
					<FacebookShareButton
						url={presentationUrl}
						title={
							object.title
								? `${process.env.NEXT_PUBLIC_WEBSITE_NAME} - ` + object.title
								: `${process.env.NEXT_PUBLIC_WEBSITE_NAME} - ` + object._id
						}
					>
						<FacebookIcon size={iconSize} />
					</FacebookShareButton>
					<XShareButton
						url={presentationUrl}
						title={
							object.title
								? `${process.env.NEXT_PUBLIC_WEBSITE_NAME} - ` + object.title
								: `${process.env.NEXT_PUBLIC_WEBSITE_NAME} - ` + object._id
						}
					>
						<TwitterIcon size={iconSize} />
					</XShareButton>
					<RedditShareButton
						url={presentationUrl}
						title={
							object.title
								? `${process.env.NEXT_PUBLIC_WEBSITE_NAME} - ` + object.title
								: `${process.env.NEXT_PUBLIC_WEBSITE_NAME} - ` + object._id
						}
					>
						<RedditIcon size={iconSize} />
					</RedditShareButton>
					<WhatsappShareButton
						url={presentationUrl}
						title={
							object.title
								? `${process.env.NEXT_PUBLIC_WEBSITE_NAME} - ` + object.title
								: `${process.env.NEXT_PUBLIC_WEBSITE_NAME} - ` + object._id
						}
					>
						<WhatsappIcon size={iconSize} />
					</WhatsappShareButton>
					<PinterestShareButton
						url={presentationUrl}
						title={
							object.title
								? `${process.env.NEXT_PUBLIC_WEBSITE_NAME} - ` + object.title
								: `${process.env.NEXT_PUBLIC_WEBSITE_NAME} - ` + object._id
						}
					>
						<PinterestIcon size={iconSize} />
					</PinterestShareButton>
					<LinkedinShareButton
						url={presentationUrl}
						title={
							object.title
								? `${process.env.NEXT_PUBLIC_WEBSITE_NAME} - ` + object.title
								: `${process.env.NEXT_PUBLIC_WEBSITE_NAME} - ` + object._id
						}
					>
						<LinkedinIcon size={iconSize} />
					</LinkedinShareButton>
					<TelegramShareButton
						url={presentationUrl}
						title={
							object.title
								? `${process.env.NEXT_PUBLIC_WEBSITE_NAME} - ` + object.title
								: `${process.env.NEXT_PUBLIC_WEBSITE_NAME} - ` + object._id
						}
					>
						<TelegramIcon size={iconSize} />
					</TelegramShareButton>
				</Modal.Body>
			</Modal>
		</>
	);
};

export default ExportModal;
