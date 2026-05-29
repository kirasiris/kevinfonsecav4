import { notFound } from "next/navigation";
import Image from "next/image";
import showdown from "showdown";
import base64 from "base-64";
import ParseHtml from "@/layout/parseHtml";
import {
	fetchurl,
	getAuthTokenOnServer,
	getUserOnServer,
} from "@/helpers/setTokenOnServer";
import UseDropzone from "@/components/noadmin/themes/themedropzone";
import Link from "next/link";

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
		},
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
				return (err.message = "VGhpcyBpcyBhIHByaXZhdGUgcmVwb3NpdG9yeQ==");
			}
		});
	return response;
}

const ReadTheme = async ({ params, searchParams }) => {
	const awtdParams = await params;
	const awtdSearchParams = await searchParams;

	const token = await getAuthTokenOnServer();
	const auth = await getUserOnServer();

	const theme = await getTheme(`/${awtdParams.id}`);

	const readMeResponse = await getReadMe(theme.data.github_readme);

	const readMEDecoder = (text) => {
		const converter = new showdown.Converter();
		const readMEContentBase64 = base64.decode(text);
		const textConverted = converter.makeHtml(readMEContentBase64);
		return textConverted;
	};

	let readme = "";
	if (theme.data.github_readme !== "#") {
		// No readMe file
		readme = readMEDecoder(readMeResponse.content || "Tm8gcmVhZE1FIGZpbGU=");
	} else {
		// This is a private repository
		readme = readMEDecoder(
			readMeResponse.content || "VGhpcyBpcyBhIHByaXZhdGUgcmVwb3NpdG9yeQ==",
		);
	}

	return (
		<div className="row">
			<div className="col-lg-12">
				<article>
					{/* HERE GOES THE FIGURE */}
					<div className="row">
						<div className="col">
							<figure className="mb-4">
								<Image
									className="img-fluid"
									src={
										theme?.data?.files?.avatar?.location?.secure_location ||
										`https://picsum.photos/1200/900?blur`
									}
									alt={`${theme?.data?.files?.avatar?.location?.fileName}'s featured image`}
									width={1200}
									height={900}
									priority
								/>
							</figure>
						</div>
						{theme?.data?.files?.extras.length > 0 && (
							<div className="col">
								<div className="card rounded-0">
									<div className="card-header">Files</div>
									<ul className="list-group list-group-flush">
										{theme?.data?.files?.extras.map((file, index) => (
											<li
												key={file?._id}
												className={`list-group-item ${file?._id}`}
											>
												<div className="float-start">
													<Link
														href={{
															pathname: `/noadmin/files/update/${file?._id}`,
															query: {},
														}}
													>
														{file?.location?.filename}
													</Link>
													<div className="blog-item__meta">
														<span className="badge bg-dark me-1">
															{file?.location?.format_type}
														</span>
													</div>
												</div>
												<div className="float-end"></div>
											</li>
										))}
									</ul>
								</div>
							</div>
						)}
					</div>
					<UseDropzone
						auth={auth}
						token={token}
						id="file"
						name="file"
						multipleFiles={true}
						object={theme?.data}
					/>
					<section className="mb-5">
						<ParseHtml text={theme.data.text} />
						{theme.data.github_readme !== "#" ? (
							<div className="card mb-4">
								<div className="card-header">ReadMe.md</div>
								<div className="card-body">
									<ParseHtml text={readme} />
								</div>
							</div>
						) : (
							<div className="card mb-4">
								<div className="card-header">ReadMe.md</div>
								<div className="card-body">
									{readme.replace(/<\/?[^>]+(>|$)/g, "")}
								</div>
							</div>
						)}
					</section>
				</article>
			</div>
		</div>
	);
};

export default ReadTheme;
