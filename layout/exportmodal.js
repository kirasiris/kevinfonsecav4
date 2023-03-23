"use client";
import { useState } from "react";
import { Form } from "react-bootstrap";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import {
	EmailShareButton,
	FacebookShareButton,
	TwitterShareButton,
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
	linkToShare = "https://demo.com/",
	iconSize = "45",
}) => {
	const [showExportModal, setShowExportModal] = useState(false);
	return (
		<div>
			<Button
				variant="secondary"
				size="sm"
				onClick={() => setShowExportModal(true)}
				data-target={object?._id}
			>
				Export
			</Button>
			{showExportModal && (
				<Modal
					show={true}
					onHide={() => setShowExportModal(false)}
					backdrop={true}
					animation={true}
					size={`lg`}
					id={object?._id}
				>
					<Modal.Header closeButton>
						<Modal.Title>Export - {object?.title || "Object"}</Modal.Title>
					</Modal.Header>
					<Modal.Body>
						<Form.Control readOnly disabled value={linkToShare} />
						<hr />
						<pre>
							<code>
								&lt;iframe src="{linkToShare}" title="{object?.title}
								"&gt;&lt;/iframe&gt;
							</code>
						</pre>
						<hr />
						<EmailShareButton subject={object?.title} body={object?.text}>
							<EmailIcon size={iconSize} />
						</EmailShareButton>
						<FacebookShareButton
							url={linkToShare}
							title={
								object.title
									? `beFree - ` + object.title
									: `beFree - ` + object._id
							}
						>
							<FacebookIcon size={iconSize} />
						</FacebookShareButton>
						<TwitterShareButton
							url={linkToShare}
							title={
								object.title
									? `beFree - ` + object.title
									: `beFree - ` + object._id
							}
						>
							<TwitterIcon size={iconSize} />
						</TwitterShareButton>
						<RedditShareButton
							url={linkToShare}
							title={
								object.title
									? `beFree - ` + object.title
									: `beFree - ` + object._id
							}
						>
							<RedditIcon size={iconSize} />
						</RedditShareButton>
						<WhatsappShareButton
							url={linkToShare}
							title={
								object.title
									? `beFree - ` + object.title
									: `beFree - ` + object._id
							}
						>
							<WhatsappIcon size={iconSize} />
						</WhatsappShareButton>
						<PinterestShareButton
							url={linkToShare}
							title={
								object.title
									? `beFree - ` + object.title
									: `beFree - ` + object._id
							}
						>
							<PinterestIcon size={iconSize} />
						</PinterestShareButton>
						<LinkedinShareButton
							url={linkToShare}
							title={
								object.title
									? `beFree - ` + object.title
									: `beFree - ` + object._id
							}
						>
							<LinkedinIcon size={iconSize} />
						</LinkedinShareButton>
						<TelegramShareButton
							url={linkToShare}
							title={
								object.title
									? `beFree - ` + object.title
									: `beFree - ` + object._id
							}
						>
							<TelegramIcon size={iconSize} />
						</TelegramShareButton>
					</Modal.Body>
				</Modal>
			)}
		</div>
	);
};

export default ExportModal;
