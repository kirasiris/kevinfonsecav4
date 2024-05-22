"use client";
import { useState } from "react";
import { FaWrench } from "react-icons/fa6";
import Modal from "react-bootstrap/Modal";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";

const SnippetSettingsModal = ({ objectId = 0, objectData, setObjectData }) => {
	const [activeModal, setActiveModal] = useState(false);

	const addCssUrlInput = () => {
		setObjectData({
			...objectData,
			csslinks: [...objectData.csslinks, ""], // Add an empty string for a new URL input
		});
	};

	const removeEmptyCssLinks = (index) => () => {
		const filteredLinks = objectData.csslinks.filter((_, i) => i !== index);
		setObjectData({
			...objectData,
			csslinks: filteredLinks,
		});
	};

	const addJsUrlInput = () => {
		setObjectData({
			...objectData,
			jslinks: [...objectData.jslinks, ""], // Add an empty string for a new URL input
		});
	};

	const removeEmptyJsLinks = (index) => () => {
		const filteredLinks = objectData.jslinks.filter((_, i) => i !== index);
		setObjectData({
			...objectData,
			jslinks: filteredLinks,
		});
	};

	return (
		<>
			<button
				className="btn btn-link btn-sm p-0"
				type="button"
				onClick={() => setActiveModal(!activeModal)}
				id={objectId}
			>
				<FaWrench />
			</button>
			<Modal
				id={objectId}
				show={activeModal}
				onHide={() => setActiveModal(!activeModal)}
				size="xl"
				backdrop={true}
				animation={true}
			>
				<Modal.Header closeButton>
					<Modal.Title>Settings</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<Tabs
						defaultActiveKey="css-tab"
						id="justify-tab-example"
						className="mb-3"
						justify
					>
						<Tab eventKey="css-tab" title="CSS">
							{objectData.csslinks.map((url, index) => (
								<div key={index} className="input-group mb-3">
									<input
										value={url}
										onChange={(e) => {
											const updatedLinks = [...objectData.csslinks];
											updatedLinks[index] = e.target.value;
											setObjectData({ ...objectData, csslinks: updatedLinks });
										}}
										type="text"
										className="form-control"
										placeholder={`URL ${index + 1}`}
									/>
									{index === objectData.csslinks.length - 1 ? (
										<button
											className="btn btn-success btn-sm"
											type="button"
											onClick={addCssUrlInput}
										>
											+
										</button>
									) : (
										<button
											className="btn btn-danger btn-sm"
											type="button"
											onClick={removeEmptyCssLinks(index)}
										>
											X
										</button>
									)}
								</div>
							))}
						</Tab>
						<Tab eventKey="js-tab" title="JavaScript">
							{objectData.jslinks.map((url, index) => (
								<div key={index} className="input-group mb-3">
									<input
										value={url}
										onChange={(e) => {
											const updatedLinks = [...objectData.jslinks];
											updatedLinks[index] = e.target.value;
											setObjectData({ ...objectData, jslinks: updatedLinks });
										}}
										type="text"
										className="form-control"
										placeholder={`URL ${index + 1}`}
									/>
									{index === objectData.jslinks.length - 1 ? (
										<button
											className="btn btn-success btn-sm"
											type="button"
											onClick={addJsUrlInput}
										>
											+
										</button>
									) : (
										<button
											className="btn btn-danger btn-sm"
											type="button"
											onClick={removeEmptyJsLinks(index)}
										>
											X
										</button>
									)}
								</div>
							))}
						</Tab>
					</Tabs>
				</Modal.Body>
				<Modal.Footer>
					<button
						className="btn btn-secondary btn-sm"
						onClick={() => setActiveModal(!activeModal)}
					>
						Close
					</button>
				</Modal.Footer>
			</Modal>
		</>
	);
};

export default SnippetSettingsModal;
