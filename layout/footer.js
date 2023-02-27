import ToggleTheme from "./toggletheme";

const Footer = () => {
	return (
		<footer className="py-5 bg-dark">
			<div className="container">
				<p className="m-0 text-center text-white">
					Made with &#10084; &#38; &#9749; by KEVIN URIEL <ToggleTheme />
				</p>
			</div>
		</footer>
	);
};

export default Footer;
