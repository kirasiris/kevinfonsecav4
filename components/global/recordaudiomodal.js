"use client";
import axios from "axios";
import { useEffect, useState } from "react";
import Modal from "react-bootstrap/Modal";
import { FaMicrophone, FaMicrophoneSlash, FaStop } from "react-icons/fa";
import WaveSurfer from "wavesurfer.js";
import RecordPlugin from "wavesurfer.js/dist/plugins/record.esm";
import {
	recordAudio,
	stopAudio,
	cancelAudio,
} from "@/helpers/formatConvertions";
import Waveform from "@/layout/waveform";
import UseProgress from "./useprogress";

const RecordAudioModal = ({
	auth = {},
	token = null,
	objectData = {},
	setObjectData = () => {},
	onModel = "Blog",
}) => {
	const [audioRecordModal, setAudioRecordModal] = useState(false);
	const [recordingAudio, setRecordingAudio] = useState(false);
	const [recordingAudioVisual, setRecordingAudioVisual] = useState(false);
	const [audioRecordingUrl, setAudioRecordingUrl] = useState(null);
	const [uploadPercentage, setUploadPercentage] = useState(0);

	useEffect(() => {
		if (recordingAudio) {
			const wavesurfer = WaveSurfer.create({
				container: "#mic",
				waveColor: "#f50",
				progressColor: "#333",
				cursorColor: "#f50",
				barWidth: 3,
				barHeight: 1,
				barRadius: 0,
				barGap: null,
				responsive: false,
				height: 100,
			});

			const record = RecordPlugin.create();

			wavesurfer.registerPlugin(record);

			if (record.isRecording()) {
				record.stopRecording();
				return;
			}

			record.startRecording();

			return () => {
				wavesurfer.destroy();
			};
		}
	}, [recordingAudio]);

	const startRecordingAudio = async () => {
		setAudioRecordingUrl(null);
		setRecordingAudio(true);
		setRecordingAudioVisual(true);
		await recordAudio();
	};

	const stopRecordingAudio = async () => {
		setRecordingAudio(false);
		setRecordingAudioVisual(false);
		const finalAudio = await stopAudio();
		setAudioRecordingUrl(finalAudio.blobUrl);
		const res = await axios.put(
			`${process.env.NEXT_PUBLIC_API_URL}/uploads/uploadObject`,
			{
				userId: auth?.userId,
				username: auth?.username,
				userEmail: auth?.email,
				onModel: onModel,
				file: finalAudio.blobFile,
			},
			{
				headers: {
					Authorization: `Bearer ${token?.value}`,
					"Content-Type": "multipart/form-data",
				},
				onUploadProgress: (ProgressEvent) => {
					setUploadPercentage(
						parseInt(
							Math.round(ProgressEvent.loaded * 100) / ProgressEvent.total
						)
					);
					setTimeout(() => setUploadPercentage(0), 10000);
				},
			}
		);
		setObjectData({ ...objectData, files: res?.data?.data });
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
				size="xl"
				backdrop={true}
				animation={true}
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
						<div
							id="mic"
							style={{
								border: "1px solid #ddd",
								marginTop: "1rem",
								height: "100px",
							}}
						/>
					)}
					<UseProgress percentage={uploadPercentage} />
					{audioRecordingUrl !== undefined && audioRecordingUrl !== null && (
						<Waveform
							src={audioRecordingUrl}
							styleGiven={{
								border: "1px solid #ddd",
								marginTop: "1rem",
							}}
						/>
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
					<button
						className="btn btn-primary btn-sm"
						onClick={() => {
							setAudioRecordModal(!audioRecordModal);
							setRecordingAudio(false);
							setRecordingAudioVisual(false);
							setAudioRecordingUrl(null);
						}}
						type="submit"
					>
						Submit
					</button>
				</Modal.Footer>
			</Modal>
		</>
	);
};

export default RecordAudioModal;
