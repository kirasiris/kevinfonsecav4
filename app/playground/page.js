import Calendar from "@/components/global/calendar";
import UseDropzone from "@/components/global/dropzone";
import RecordAudioModal from "@/components/global/recordaudiomodal";
import { fetchurl, getUserOnServer } from "@/helpers/setTokenOnServer";
import Waveform from "@/layout/waveform";

async function getSetting(params) {
	const res = await fetchurl(`/settings/${params}`, "GET", "default");
	return res;
}

const PlaygroundIndex = async ({ params, searchParams }) => {
	const awtdParams = await params;
	const awtdSearchParams = await searchParams;

	const auth = await getUserOnServer();
	const settings = await getSetting(process.env.NEXT_PUBLIC_SETTINGS_ID);

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
			<Calendar settings={settings} />
		</div>
	);
};

export default PlaygroundIndex;
