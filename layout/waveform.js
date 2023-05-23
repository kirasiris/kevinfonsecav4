"use client";
import { useEffect, useState } from "react";
import WaveSurfer from "wavesurfer.js";
import { FaPlayCircle, FaPauseCircle, FaStop } from "react-icons/fa";
import { GoMute, GoUnmute } from "react-icons/go";
import WaveSurferMicrophone from "wavesurfer.js/dist/plugin/wavesurfer.microphone";
import WaverSurferCursor from "wavesurfer.js/dist/plugin/wavesurfer.cursor";
import WaverSurferMediaSessionData from "wavesurfer.js/dist/plugin/wavesurfer.mediasession";

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
}) => {
	const [isPlaying, setIsPlaying] = useState(false);
	const [isMute, setItMute] = useState(true);
	const [waveSurfer, setWaveSurfer] = useState(null);

	useEffect(() => {
		const wavesurfer = WaveSurfer.create({
			container: "#waveform",
			backend: "MediaElementWebAudio",
			waveColor: "#333",
			progressColor: "#f50",
			cursorColor: "#f50",
			barWidth: 3,
			barHeight: 1,
			barRadius: 0,
			barGap: null,
			responsive: false,
			height: 100,
			plugins: [
				WaveSurferMicrophone.create({
					bufferSize: 4096,
					numberOfInputChannels: 1,
					numberOfOutputChannels: 1,
					constraints: {
						video: false,
						audio: true,
					},
				}),
				WaverSurferCursor.create({
					showTime: true,
					opacity: 1,
					customShowTimeStyle: {
						"background-color": "#000",
						color: "#fff",
						padding: "2px",
						"font-size": "10px",
					},
				}),
				// https://wavesurfer-js.org/example/media-session/index.html
				WaverSurferMediaSessionData.create({
					metadata: {
						title: mediaTitle,
						artist: mediaAuthor,
						album: mediaAlbum,
						// artwork: mediaArtwork,
					},
				}),
			],
		});

		setWaveSurfer(wavesurfer);

		wavesurfer.load(src);

		wavesurfer.microphone?.on("deviceReady", function (stream) {
			console.log("Device ready!", stream);
		});

		wavesurfer.microphone?.on("deviceError", function (code) {
			console.warn("Device error: " + code);
		});

		return () => {
			wavesurfer.destroy();
		};
	}, []);

	const handlePlay = () => {
		waveSurfer.play();
		setIsPlaying(true);
		setItMute(false);
	};

	const handlePause = () => {
		waveSurfer.pause();
		setIsPlaying(false);
		setItMute(true);
	};

	const handleStop = () => {
		waveSurfer.stop();
		setIsPlaying(false);
		setItMute(true);
	};

	const makeMute = () => {
		waveSurfer.toggleMute();
		setItMute(isMute ? false : true);
	};

	return (
		<div className="row">
			<div className="col-lg-12">
				<div id="waveform"></div>
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
