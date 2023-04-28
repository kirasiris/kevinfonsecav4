import Header from "@/layout/header";
import Footer from "@/layout/footer";
import Head from "@/app/head";
import SQLCompilerPage from "@/components/sqlcompiler/sqlcompilerpage";

const SQLCompilerIndex = async ({}) => {
	return (
		<>
			<Head
				title="SQL Snipps"
				description="A tool for easy online testing and sharing of database problems and their solutions.!."
			/>
			<Header
				title="SQL Snipps"
				description="A tool for easy online testing and sharing of database problems and their solutions.!."
			/>

			<SQLCompilerPage />
			<Footer />
		</>
	);
};

export default SQLCompilerIndex;
