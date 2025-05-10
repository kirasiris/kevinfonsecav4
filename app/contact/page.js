import Header from "@/layout/header";
import Globalcontent from "@/layout/content";
import Sidebar from "@/layout/contact/sidebar";
import ContactForm from "@/components/forms/contact/contactform";

const ContactIndex = async ({ params, searchParams }) => {
	const address = {
		location: {
			formattedAddress: "10153 Red Bluff Ln, Fort Worth, TX 76177",
			coordinates: [-97.33096, 32.92332],
		},
	};

	return (
		<>
			<Header
				title="Contact Page"
				description="Do not hesitate to contact me!"
			/>
			<div className="container">
				<div className="row">
					<Globalcontent>
						<ContactForm />
					</Globalcontent>
					<Sidebar address={address} />
				</div>
			</div>
		</>
	);
};

export default ContactIndex;
