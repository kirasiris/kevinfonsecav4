"use client";
import Waveform from "@/layout/waveform";

const Audio = ({ object = {} }) => {
	return (
		<Waveform
			src={object?.files[0].location.secure_location}
			mediaTitle={object.title}
			mediaAuthor={object.user.username}
			mediaAlbum=""
			// mediaArtwork={images}
		/>
	);
};

export default Audio;
