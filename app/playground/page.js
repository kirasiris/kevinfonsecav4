"use client";

import { useState } from "react";
import RecordAudioModal from "@/components/global/recordaudiomodal";
import Waveform from "@/layout/waveform";

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
			<Waveform
				src="/JinMoriSaysRun.mp3"
				mediaTitle="The God of High School OST - Seoul Team / Monkey King Say Run ( HQ Cover)"
				mediaAuthor="Dude's Cover"
				mediaAlbum=""
			/>
		</div>
	);
};

export default PlaygroundIndex;
