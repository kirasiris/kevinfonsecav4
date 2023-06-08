import Header from "@/layout/header";
import Head from "@/app/head";
import AImagePage from "@/components/openai/generateimage/AImagePage";

const AImage = async ({ searchParams }) => {
	return (
		<>
			<Head
				title="Generate AI Image"
				description="Enter a prompt and get the best quality image!"
			/>
			<Header
				title="Generate AI Image"
				description="Enter a prompt and get the best quality image!"
			/>

			<AImagePage searchParams={searchParams} />
		</>
	);
};

export default AImage;
