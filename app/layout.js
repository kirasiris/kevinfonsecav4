import Footer from "@/layout/footer";
import "./bootstrap.css";
// import "./bootstrap.js";
import "./global.css";
import "./app.css";
import Menu from "@/layout/menu";

export default function RootLayout({ children }) {
	return (
		<html lang="en">
			{/*
        <head /> will contain the components returned by the nearest parent
        head.js. Find out more at https://beta.nextjs.org/docs/api-reference/file-conventions/head
      */}
			<head />
			<body>
				<Menu />
				<main>{children}</main>
				<Footer />
			</body>
		</html>
	);
}
