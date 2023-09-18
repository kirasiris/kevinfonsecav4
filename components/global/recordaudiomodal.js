"use client";
import { useState } from "react";
import Modal from "react-bootstrap/Modal";
import { FaMicrophone, FaMicrophoneSlash, FaStop } from "react-icons/fa";
import { ReactMic } from "react-mic";
import {
	recordAudio,
	stopAudio,
	cancelAudio,
} from "@/helpers/formatConvertions";

import Waveform from "@/layout/waveform";

const RecordAudioModal = ({}) => {
	const [audioRecordModal, setAudioRecordModal] = useState(false);

	const [recordingAudio, setRecordingAudio] = useState(false);
	const [recordingAudioVisual, setRecordingAudioVisual] = useState(false);
	const [audioRecordingUrl, setAudioRecordingUrl] = useState(null);

	const startRecordingAudio = async () => {
		setAudioRecordingUrl(null);
		setRecordingAudio(true);
		// setRecordingAudioVisual(true);
		setTimeout(() => {
			setRecordingAudioVisual(true);
		}, 100);
		await recordAudio();
	};

	const stopRecordingAudio = async () => {
		setRecordingAudio(false);
		setRecordingAudioVisual(false);
		const finalAudio = await stopAudio();
		setAudioRecordingUrl(finalAudio);
	};

	const cancelRecordingAudio = async () => {
		setAudioRecordingUrl(null);
		setRecordingAudio(false);
		setRecordingAudioVisual(false);
		await cancelAudio();
	};

	return (
		<>
			<button
				className="btn btn-secondary btn-sm"
				type="button"
				onClick={() => setAudioRecordModal(!audioRecordModal)}
			>
				<FaMicrophone style={{ fontSize: "25px" }} />
			</button>
			<Modal
				show={audioRecordModal}
				onHide={() => {
					setAudioRecordModal(!audioRecordModal);
					setRecordingAudio(false);
					setRecordingAudioVisual(false);
					setAudioRecordingUrl(null);
				}}
				backdrop={true}
				animation={true}
				size="lg"
			>
				<Modal.Header closeButton>
					<Modal.Title>Record Audio!</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<button
						className="btn btn-secondary btn-sm"
						onClick={recordingAudio ? stopRecordingAudio : startRecordingAudio}
						type="button"
					>
						{recordingAudio && (
							<FaMicrophoneSlash style={{ fontSize: "25px" }} />
						)}
						{!recordingAudio && <FaMicrophone style={{ fontSize: "25px" }} />}
					</button>
					{recordingAudio && (
						<button
							className="btn btn-secondary btn-sm"
							onClick={cancelAudio}
							type="button"
						>
							<FaStop style={{ fontSize: "25px" }} />
						</button>
					)}
					{recordingAudioVisual && (
						<ReactMic
							record={recordingAudio}
							className="react-mic"
							strokeColor="#000"
							backgroundColor="#fff"
						/>
					)}
					{audioRecordingUrl !== undefined && audioRecordingUrl !== null && (
						<Waveform src={audioRecordingUrl} />
					)}
				</Modal.Body>
				<Modal.Footer>
					<button
						className="btn btn-secondary btn-sm"
						onClick={() => {
							setAudioRecordModal(!audioRecordModal);
							setRecordingAudio(false);
							setRecordingAudioVisual(false);
							setAudioRecordingUrl(null);
						}}
					>
						Close
					</button>
					<button className="btn btn-primary btn-sm" type="submit">
						Submit
					</button>
				</Modal.Footer>
			</Modal>
		</>
	);
};

export default RecordAudioModal;
