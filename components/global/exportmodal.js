"use client";
import { useState } from "react";
import { Form } from "react-bootstrap";
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
					<Form.Control readOnly disabled value={linkToShare} />
					<hr />
					<pre>
						<code>
							&lt;iframe src=&rdquo;{linkToShare}&rdquo; title=&rdquo;
							{object?.title}&rdquo;&gt;&lt;/iframe&gt;
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
		</>
	);
};

export default ExportModal;
