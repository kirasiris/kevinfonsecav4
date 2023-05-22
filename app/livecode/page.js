import Header from "@/layout/header";
import Head from "@/app/head";
import LiveCodePage from "@/components/livecode/livecodepage";

const LiveCodeIndex = async ({ searchParams }) => {
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
			<LiveCodePage searchParams={searchParams} />
		</>
	);
};

export default LiveCodeIndex;
