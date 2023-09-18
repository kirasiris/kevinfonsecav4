"use client";

import { useState } from "react";
import RecordAudioModal from "@/components/global/recordaudiomodal";

const PlaygroundIndex = () => {
	/*
	 *
	 *
	 * RECORD VIDEO
	 *
	 *
	 */
	const [recordingVideo, setRecordingVideo] = useState(false);
	const [videoRecordingUrl, setVideoRecordingUrl] = useState(null);

	const startRecordingVideo = async () => {
		setVideoRecordingUrl(null);
		setRecordingVideo(true);
	};

	const stopRecordingVideo = async () => {
		setRecordingVideo(false);
		// const finalVideo = await stopVideo()
		// setVideoRecordingUrl(finalVideo);
	};

	const cancelRecordingVideo = async () => {
		setRecordingVideo(false);
		// await cancelVideo()
	};

	/*
	 *
	 *
	 * RECORD SCREENSHOT
	 *
	 *
	 */

	return (
		<div className="container">
			<div className="row">PlaygroundIndex</div>
			<RecordAudioModal />
		</div>
	);
};

export default PlaygroundIndex;
