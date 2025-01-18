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
	id = 0,
	src = "",
	mediaTitle = "",
	mediaAuthor = "",
	mediaAlbum = "",
	mediaArtwork = [],
	styleGiven = {},
}) => {
	const [isPlaying, setIsPlaying] = useState(false);
	const [isMute, setItMute] = useState(false);
	const [myWaveSurfer, setMyWaveSurfer] = useState(null);

	const formatTime = (seconds) => {
		const minutes = Math.floor(seconds / 60);
		const secondsRemainder = Math.round(seconds) % 60;
		const paddedSeconds = `0${secondsRemainder}`.slice(-2);
		return `${minutes}:${paddedSeconds}`;
	};

	useEffect(() => {
		const wavesurfer = WaveSurfer.create({
			container: `#waveform-${id}`,
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
		const timeEl = document.querySelector(`#waveform-time-${id}`);
		wavesurfer.on("timeupdate", (currentTime) => {
			timeEl.textContent = formatTime(currentTime);
		});

		// Get duration of source
		const durationEl = document.querySelector(`#waveform-duration-${id}`);
		wavesurfer.on("decode", (finalDuration) => {
			durationEl.textContent = formatTime(finalDuration);
		});

		// Play/pause on click
		wavesurfer.on("interaction", () => {
			wavesurfer.playPause();
		});

		// Hover effect
		const hover = document.querySelector(`#waveform-hover-${id}`);
		const waveform = document.querySelector(`#waveform-${id}`);
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
		myWaveSurfer.setMuted(!isMute ? true : false);
		setItMute(!isMute ? true : false);
	};

	return (
		<div className="row">
			<div className="col-lg-12">
				<div className="waveform" id={`waveform-${id}`} style={styleGiven}>
					<div className="waveform-time" id={`waveform-time-${id}`} />
					<div className="waveform-duration" id={`waveform-duration-${id}`} />
					<div className="waveform-hover" id={`waveform-hover-${id}`} />
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
