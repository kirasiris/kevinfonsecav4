import { notFound } from "next/navigation";
import Image from "next/image";
import showdown from "showdown";
import base64 from "base-64";
import ParseHtml from "@/layout/parseHtml";
import { fetchurl } from "@/helpers/setTokenOnServer";

async function getTheme(params) {
	const res = await fetchurl(`/global/themes${params}`, "GET", "no-cache");
	if (!res.success) notFound();
	return res;
}
async function getReadMe(repoName) {
	const response = await fetch(
		`https://api.github.com/repos/kirasiris/${repoName}/contents/README.md`,
		{
			method: "GET",
			accept: "application/vnd.github+json",
			headers: {
				Authorization: process.env.NEXT_PUBLIC_GITHUB_TOKEN,
			},
			cache: "no-store",
		}
	)
		.then(async (res) => {
			if (!res.ok) {
				// check if there was JSON
				const contentType = res.headers.get("Content-Type");
				if (contentType && contentType.includes("application/json")) {
					// return a rejected Promise that includes the JSON
					return res.json().then((json) => Promise.reject(json));
				}
				// no JSON, just throw an error
				throw new Error("Something went horribly wrong 💩");
			}
			return res.json();
		})
		.then((data) => data)
		.catch((err) => {
			console.log(err);
			if (err.name === "AbortError") {
				console.log("successfully aborted");
			} else {
				// handle error
				console.log("Error coming from setTokenOnServer file", err);
			}
		});

	return response;
}

const ReadTheme = async ({ params, searchParams }) => {
	const awtdParams = await params;
	const awtdSearchParams = await searchParams;

	const theme = await getTheme(`/${awtdParams.id}`);

	const readMeResponse = await getReadMe(theme.data.github_readme);

	const readMEDecoder = (text) => {
		const converter = new showdown.Converter();
		const readMEContentBase64 = base64.decode(text);
		const textConverted = converter.makeHtml(readMEContentBase64);
		return textConverted;
	};

	const readme = readMEDecoder(
		readMeResponse.content || "Tm8gcmVhZE1FIGZpbGU="
	);

	return (
		<div className="row">
			<div className="col-lg-12">
				<article>
					{/* HERE GOES THE FIGURE */}
					<figure className="mb-4">
						<Image
							className="img-fluid"
							src={
								theme?.data?.files?.avatar?.location?.secure_location ||
								`https://source.unsplash.com/random/1200x900`
							}
							alt={`${theme?.data?.avatar?.location?.fileName}'s featured image`}
							width={1200}
							height={900}
							priority
						/>
					</figure>
					<section className="mb-5">
						<ParseHtml text={theme.data.text} />
						<div className="card mb-4">
							<div className="card-header">ReadMe.md</div>
							<div className="card-body">
								<ParseHtml text={readme} />
							</div>
						</div>
					</section>
				</article>
			</div>
		</div>
	);
};

export default ReadTheme;
