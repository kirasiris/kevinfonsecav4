import Header from "@/layout/header";
import Head from "@/app/head";
import MongoDBCompilerPage from "@/components/mongodbcompiler/mongodbcompilerpage";

const MongoDBCompilerIndex = async ({}) => {
	return (
		<>
			<Head
				title="MongoDB Schema Builder"
				description="A tool for easy online testing and sharing of database problems and their solutions.!."
			/>
			<Header
				title="MongoDB Schema Builder"
				description="A tool for easy online testing and sharing of database problems and their solutions.!."
			/>

			<MongoDBCompilerPage />
		</>
	);
};

export default MongoDBCompilerIndex;
