import { fetchurl } from "@/helpers/setTokenOnServer";
import ParseHtml from "@/layout/parseHtml";
import ArticleHeader from "@/components/global/articleheader";

async function getContact(params) {
	const res = await fetchurl(`/contacts${params}`, "GET", "no-cache");
	return res;
}

const ReadContact = async ({ params, searchParams }) => {
	const contact = await getContact(`/${params.id}`);

	return (
		<div className="row">
			<div className="col">IMAGE</div>
			<div className="col-lg-11">
				<article>
					<ArticleHeader object={contact} />
					<section className="mb-5">
						<div className="card">
							<div className="card-header">
								{contact.data.name.first}&nbsp;{contact.data.name.middle}&nbsp;
								{contact.data.name.last}
							</div>
							<div className="card-body">
								<ul class="list-group list-group-flush m-0">
									{contact.data.emails.map((email) => (
										<li key={email._id} class="list-group-item">
											{email.handle} - {email.type}
										</li>
									))}
								</ul>
								<ul class="list-group list-group-flush m-0">
									{contact.data.phones.map((phone) => (
										<li key={phone._id} class="list-group-item">
											{phone.number} - {phone.type}
										</li>
									))}
								</ul>
								Birthdate
								<ParseHtml text={contact.data.dates.birthdate} />
								<ul class="list-group list-group-flush m-0">
									{contact.data.dates.significantDates.map((date) => (
										<li key={date._id} class="list-group-item">
											{date.date} - {date.type}
										</li>
									))}
								</ul>
								<ul class="list-group list-group-flush m-0">
									{contact.data.related.map((contact) => (
										<li key={contact._id} class="list-group-item">
											{contact.name} - {contact.type}
										</li>
									))}
								</ul>
								<ParseHtml text={contact?.data?.text} />
							</div>
						</div>
					</section>
				</article>
			</div>
		</div>
	);
};

export default ReadContact;
