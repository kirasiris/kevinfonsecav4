import UseDropzone from "@/components/global/dropzone";
import RecordAudioModal from "@/components/global/recordaudiomodal";
import {
	getUserEmailOnServer,
	getUserIdOnServer,
	getUserUsernameOnServer,
} from "@/helpers/setTokenOnServer";
import Waveform from "@/layout/waveform";

const PlaygroundIndex = async ({ params, searchParams }) => {
	const userId = await getUserIdOnServer();
	const username = await getUserUsernameOnServer();
	const email = await getUserEmailOnServer();
	const auth = {
		id: userId?.value,
		username: username?.value,
		email: email?.value,
	};
	return (
		<div className="container">
			<div className="row">PlaygroundIndex</div>
			<RecordAudioModal auth={auth} />
			<Waveform
				src="/JinMoriSaysRun.mp3"
				mediaTitle="The God of High School OST - Seoul Team / Monkey King Say Run ( HQ Cover)"
				mediaAuthor="Dude's Cover"
				mediaAlbum=""
			/>
			<UseDropzone />
		</div>
	);
};

export default PlaygroundIndex;
