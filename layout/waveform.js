"use strict";
import { useEffect, useRef, useState } from "react";
import WaveSurfer from "wavesurfer.js";
import { FaPlayCircle, FaPauseCircle } from "react-icons/fa";

/*
 *
 * https://andreidobrinski.com/blog/implementing-an-audio-waveform-with-react-hooks-and-wavesurferjs/
 *
 */
const Waveform = ({ audio = "" }) => {
	const containerRef = useRef();
	const waveSurferRef = useRef({ isPlaying: () => false }); // Add pause and play functionality

	const [isPlaying, setIsPlaying] = useState(false);

	useEffect(() => {
		const WaveSurferInstance = WaveSurfer.create({
			container: containerRef.current,
			responsive: true,
			cursorWidth: 0,
			barWidth: 2,
			barHeight: 10,
		});
		WaveSurferInstance.load(audio);
		// Add pause and play functionality
		WaveSurferInstance.on("ready", () => {
			waveSurferRef.current = WaveSurferInstance;
			console.log(waveSurferRef);
		});

		return () => {
			WaveSurferInstance.destroy();
		};
	}, [audio]);
	return (
		<>
			<button
				onClick={() => {
					waveSurferRef.current.playPause();
					setIsPlaying(waveSurferRef.current.isPlaying());
				}}
				type="button"
				style={{
					width: "40px",
					height: "40px",
					border: "none",
					padding: "0",
				}}
			>
				{isPlaying ? <FaPauseCircle size="3em" /> : <FaPlayCircle size="3em" />}
			</button>
			<div
				ref={containerRef}
				style={{
					display: "grid",
					gridTemplateColumns: "40px 1fr",
					alignItems: "center",
				}}
			/>
		</>
	);
};

export default Waveform;
