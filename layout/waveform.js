"use client";
import { useEffect, useState } from "react";
import WaveSurfer from "wavesurfer.js";
import { FaPlayCircle, FaPauseCircle, FaStop } from "react-icons/fa";
import { GoMute, GoUnmute } from "react-icons/go";
// import WaverSurferCursor from "wavesurfer.js/dist/plugin/wavesurfer.cursor";

/*
 *
 * https://andreidobrinski.com/blog/implementing-an-audio-waveform-with-react-hooks-and-wavesurferjs/
 *
 */
const Waveform = ({
	src = "",
	mediaTitle = "",
	mediaAuthor = "",
	mediaAlbum = "",
	mediaArtwork = [],
	styleGiven = {},
}) => {
	const [isPlaying, setIsPlaying] = useState(false);
	const [isMute, setItMute] = useState(true);
	const [myWaveSurfer, setMyWaveSurfer] = useState(null);

	const formatTime = (seconds) => {
		const minutes = Math.floor(seconds / 60);
		const secondsRemainder = Math.round(seconds) % 60;
		const paddedSeconds = `0${secondsRemainder}`.slice(-2);
		return `${minutes}:${paddedSeconds}`;
	};

	useEffect(() => {
		const wavesurfer = WaveSurfer.create({
			container: "#waveform",
			waveColor: "#333",
			progressColor: "#f50",
			cursorColor: "#f50",
			barWidth: 3,
			barHeight: 1,
			barRadius: 0,
			barGap: null,
			responsive: false,
			height: 100,
		});

		setMyWaveSurfer(wavesurfer);

		// Load source
		wavesurfer.load(src);

		// Get initial duraction of source
		const timeEl = document.querySelector("#waveform-time");
		wavesurfer.on("timeupdate", (currentTime) => {
			timeEl.textContent = formatTime(currentTime);
		});

		// Get duration of source
		const durationEl = document.querySelector("#waveform-duration");
		wavesurfer.on("decode", (finalDuration) => {
			durationEl.textContent = formatTime(finalDuration);
		});

		// Play/pause on click
		wavesurfer.on("interaction", () => {
			wavesurfer.playPause();
		});

		// Hover effect
		const hover = document.querySelector("#waveform-hover");
		const waveform = document.querySelector("#waveform");
		waveform.addEventListener(
			"pointermove",
			(e) => (hover.style.width = `${e.offsetX}px`)
		);

		return () => {
			wavesurfer.destroy();
		};
	}, []);

	const handlePlay = () => {
		myWaveSurfer.play();
		setIsPlaying(true);
		setItMute(false);
	};

	const handlePause = () => {
		myWaveSurfer.pause();
		setIsPlaying(false);
		setItMute(true);
	};

	const handleStop = () => {
		myWaveSurfer.stop();
		setIsPlaying(false);
		setItMute(true);
	};

	const makeMute = () => {
		myWaveSurfer.toggleMute();
		setItMute(isMute ? false : true);
	};

	return (
		<div className="row">
			<div className="col-lg-12">
				<div id="waveform" style={styleGiven}>
					<div id="waveform-time" />
					<div id="waveform-duration" />
					<div id="waveform-hover" />
				</div>
			</div>
			<div className="btn-group">
				<button
					className="btn btn-secondary btn-sm rounded-0"
					onClick={isPlaying ? handlePause : handlePlay}
				>
					{isPlaying ? (
						<FaPauseCircle style={{ fontSize: "25px" }} />
					) : (
						<FaPlayCircle style={{ fontSize: "25px" }} />
					)}
				</button>
				<button
					className="btn btn-secondary btn-sm rounded-0"
					onClick={handleStop}
				>
					<FaStop />
				</button>
				<button
					className="btn btn-secondary btn-sm rounded-0"
					onClick={isMute ? makeMute : makeMute}
				>
					{isMute ? (
						<GoMute style={{ fontSize: "25px" }} />
					) : (
						<GoUnmute style={{ fontSize: "25px" }} />
					)}
				</button>
			</div>
		</div>
	);
};

export default Waveform;
