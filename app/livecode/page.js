import Header from "@/layout/header";
import Footer from "@/layout/footer";
import Head from "@/app/head";
import LiveCodePage from "@/components/livecode/livecodepage";

const LiveCodeIndex = async ({}) => {
	return (
		<>
			<Head
				title="Live Code"
				description="Design elements, playground and code snippets for Bootstrap HTML/CSS/JS framework!."
			/>
			<Header
				title="Live Code"
				description="Design elements, playground and code snippets for Bootstrap HTML/CSS/JS framework!."
			/>
			<LiveCodePage />
			<Footer styles={{ marginTop: "0px !important" }} />
		</>
	);
};

export default LiveCodeIndex;
