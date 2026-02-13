import Header from "@/layout/header";
import Globalcontent from "@/layout/content";
import Sidebar from "@/layout/contact/sidebar";
import ContactForm from "@/forms/contact/contactform";
import Head from "@/app/head";
import { getGlobalData } from "@/helpers/globalData";

const ContactIndex = async ({ params, searchParams }) => {
	const { settings } = await getGlobalData();

	const address = {
		location: {
			formattedAddress: "10153 Red Bluff Ln, Fort Worth, TX 76177",
			coordinates: [-97.33096, 32.92332],
		},
	};

	return (
		<>
			<Head
				title={`${settings?.data?.title} - Contact`}
				description={"Do not hesitate to contact me!"}
				favicon={settings?.data?.favicon}
				postImage=""
				imageWidth=""
				imageHeight=""
				videoWidth=""
				videoHeight=""
				card="summary"
				robots=""
				category=""
				url={`/contact`}
				author={settings.data.author}
				createdAt={settings.data.createdAt}
				updatedAt={settings.data.updatedAt}
				locales=""
				posType="page"
			/>
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
