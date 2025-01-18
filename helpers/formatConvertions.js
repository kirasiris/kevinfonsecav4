"use client";

export const createObjectUrl = (file) => {
	return URL.createObjectURL(file);
};

var audioRecorder = {
	/** Stores the recorded audio as Blob objects of audio data as the recording continues*/
	audioBlobs: [] /*of type Blob[]*/,
	/** Stores the reference of the MediaRecorder instance that handles the MediaStream when recording starts*/
	mediaRecorder: null /*of type MediaRecorder*/,
	/** Stores the reference to the stream currently capturing the audio*/
	streamBeingCaptured: null /*of type MediaStream*/,

	/** Start recording the audio
	 * @returns {Promise} - returns a promise that resolves if audio recording successfully started
	 */
	start: () => {
		//Feature Detection
		if (!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia)) {
			//Feature is not supported in browser
			//return a custom error
			return Promise.reject(
				new Error(
					"mediaDevices API or getUserMedia method is not supported in this browser."
				)
			);
		} else {
			//Feature is supported in browser

			//create an audio stream
			return (
				navigator.mediaDevices
					.getUserMedia({ audio: true } /*of type MediaStreamConstraints*/)
					//returns a promise that resolves to the audio stream
					.then((stream) /*of type MediaStream*/ => {
						//save the reference of the stream to be able to stop it when necessary
						audioRecorder.streamBeingCaptured = stream;

						//create a media recorder instance by passing that stream into the MediaRecorder constructor
						audioRecorder.mediaRecorder = new MediaRecorder(
							stream
						); /*the MediaRecorder interface of the MediaStream Recording
					API provides functionality to easily record media*/

						//clear previously saved audio Blobs, if any
						audioRecorder.audioBlobs = [];

						//add a dataavailable event listener in order to store the audio data Blobs when recording
						audioRecorder.mediaRecorder.addEventListener(
							"dataavailable",
							(event) => {
								//store audio Blob object
								audioRecorder.audioBlobs.push(event.data);
							}
						);

						//start the recording by calling the start method on the media recorder
						audioRecorder.mediaRecorder.start();
					})
			);

			/* errors are not handled in the API because if its handled and the promise is chained, the .then after the catch will be executed*/
		}
	},
	/** Stop the started audio recording
	 * @returns {Promise} - returns a promise that resolves to the audio as a blob file
	 */
	stop: () => {
		return new Promise((resolve) => {
			//save audio type to pass to set the Blob type
			let mimeType = audioRecorder.mediaRecorder.mimeType;

			//listen to the stop event in order to create & return a single Blob object
			audioRecorder.mediaRecorder.addEventListener("stop", () => {
				//create a single blob object, as we might have gathered a few Blob objects that needs to be joined as one
				let audioBlob = new Blob(audioRecorder.audioBlobs, { type: mimeType });

				//resolve promise with the single audio blob representing the recorded audio
				resolve(audioBlob);
			});

			//stop the recording feature
			audioRecorder.mediaRecorder.stop();

			//stop all the tracks on the active stream in order to stop the stream
			audioRecorder.stopStream();

			//reset API properties for next recording
			audioRecorder.resetRecordingProperties();
		});
	},
	/** Cancel audio recording*/
	cancel: () => {
		//stop the recording feature
		audioRecorder.mediaRecorder.stop();

		//stop all the tracks on the active stream in order to stop the stream
		audioRecorder.stopStream();

		//reset API properties for next recording
		audioRecorder.resetRecordingProperties();
	},
	/** Stop all the tracks on the active stream in order to stop the stream and remove
	 * the red flashing dot showing in the tab
	 */
	stopStream: () => {
		//stopping the capturing request by stopping all the tracks on the active stream
		audioRecorder.streamBeingCaptured
			.getTracks() //get all tracks from the stream
			.forEach((track) /*of type MediaStreamTrack*/ => track.stop()); //stop each one
	},
	/** Reset all the recording properties including the media recorder and stream being captured*/
	resetRecordingProperties: () => {
		audioRecorder.mediaRecorder = null;
		audioRecorder.streamBeingCaptured = null;

		/*No need to remove event listeners attached to mediaRecorder as
			If a DOM element which is removed is reference-free (no references pointing to it), the element itself is picked
			up by the garbage collector as well as any event handlers/listeners associated with it.
			getEventListeners(audioRecorder.mediaRecorder) will return an empty array of events.*/
	},
};

export const recordAudio = async () => {
	try {
		// start recording using the audio recording API
		await audioRecorder.start();

		console.log("Recording Audio...");
	} catch (error) {
		//No Browser Support Error
		if (
			error.message.includes(
				"mediaDevices API or getUserMedia method is not supported in this browser."
			)
		) {
			console.log("To record audio, use browsers like Chrome and Firefox.");
			//Error handling structure
			switch (error.name) {
				case "AbortError": //error from navigator.mediaDevices.getUserMedia
					console.log("An AbortError has occured.");
					break;
				case "NotAllowedError": //error from navigator.mediaDevices.getUserMedia
					console.log(
						"A NotAllowedError has occured. User might have denied permission."
					);
					break;
				case "NotFoundError": //error from navigator.mediaDevices.getUserMedia
					console.log("A NotFoundError has occured.");
					break;
				case "NotReadableError": //error from navigator.mediaDevices.getUserMedia
					console.log("A NotReadableError has occured.");
					break;
				case "SecurityError": //error from navigator.mediaDevices.getUserMedia or from the MediaRecorder.start
					console.log("A SecurityError has occured.");
					break;
				case "TypeError": //error from navigator.mediaDevices.getUserMedia
					console.log("A TypeError has occured.");
					break;
				case "InvalidStateError": //error from the MediaRecorder.start
					console.log("An InvalidStateError has occured.");
					break;
				case "UnknownError": //error from the MediaRecorder.start
					console.log("An UnknownError has occured.");
					break;
				default:
					console.log("An error occured with the error name " + error.name);
			}
		}
	}
};

export const stopAudio = async () => {
	try {
		//stop the recording using the audio recording API
		console.log("Stopping Audio Recording...");
		const audioAsblob = await audioRecorder.stop();
		// Do something with the recorded audio
		return {
			blobFile: audioAsblob,
			blobUrl: createObjectUrl(audioAsblob),
		};
	} catch (error) {
		// Error handling structure
		switch (error.name) {
			case "InvalidStateError": // Error from the MediaRecorder.stop
				console.log("An InvalidStateError has occurred.");
				break;
			default:
				console.log("An error occurred with the error name " + error.name);
		}
	}
};

export const cancelAudio = async () => {
	console.log("Cancelling Audio Recording...");
	await audioRecorder.cancel();
};

export const recordVideo = () => {};

export const stopVideo = () => {};

export const cancelVideo = () => {};

export const openCamera = () => {};

export const closeCamera = () => {};
