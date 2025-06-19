import { redirect, notFound } from "next/navigation";
import {
	fetchurl,
	getAuthTokenOnServer,
	getUserOnServer,
} from "@/helpers/setTokenOnServer";
import AdminSidebar from "@/components/admin/myfinaladminsidebar";
import MyTextArea from "@/components/global/myfinaltextarea";
import FormButtons from "@/components/global/formbuttons";

async function getChapter(params) {
	const res = await fetchurl(`/global/videos${params}`, "GET", "no-cache");
	if (!res.success) notFound();
	return res;
}

const UpdateChapter = async ({ params, searchParams }) => {
	const awtdParams = await params;
	const awtdSearchParams = await searchParams;
	const token = await getAuthTokenOnServer();
	const auth = await getUserOnServer();

	const chapter = await getChapter(`/${awtdParams.id}`);

	const upgradeChapter = async (formData) => {
		"use server";
		const rawFormData = {
			title: formData.get("title"),
			text: formData.get("text"),
			featured: formData.get("featured"),
			commented: formData.get("commented"),
			embedding: formData.get("embedding"),
			status: formData.get("status"),
			language: formData.get("language"),
			captionCert: formData.get("captionCert"),
			recordingDate: formData.get("recordingDate"),
			address: formData.get("address"),
			license: formData.get("license"),
			free_preview: formData.get("free_preview"),
			duration: formData.get("duration"),
			averageRating: formData.get("averageRating"),
			orderingNumber: formData.get("orderingNumber"),
			players: {
				mega: formData.get("mega"),
				streamwish: formData.get("streamwish"),
				yourupload: formData.get("yourupload"),
				okru: formData.get("okru"),
				maru: formData.get("maru"),
				netu: formData.get("netu"),
				stape: formData.get("stape"),
			},
			downloads: {
				mega: formData.get("mega_download"),
				onefichier: formData.get("onefichier"),
				stape: formData.get("stape_download"),
			},
		};
		await fetchurl(
			`/noadmin/videos/${awtdParams.id}`,
			"PUT",
			"no-cache",
			rawFormData
		);
		redirect(`/noadmin/animes/read/${chapter?.data?.resourceId?._id}`);
	};

	return (
		<form className="row" action={upgradeChapter}>
			<div className="col">
				<label htmlFor="title" className="form-label">
					Title
				</label>
				<input
					id="title"
					name="title"
					defaultValue={chapter?.data?.title}
					type="text"
					className="form-control mb-3"
					placeholder=""
				/>
				<label htmlFor="text" className="form-label">
					Text
				</label>
				<MyTextArea
					auth={auth}
					token={token}
					id="text"
					name="text"
					defaultValue={chapter?.data?.text}
					onModel="Video"
					advancedTextEditor={false}
					customPlaceholder="No description"
				/>
				<label htmlFor="address" className="form-label">
					Address
				</label>
				<input
					id="address"
					name="address"
					defaultValue={chapter?.data?.address}
					type="text"
					className="form-control mb-3"
					placeholder=""
				/>
				<div className="row">
					<div className="col">
						<label htmlFor="language" className="form-label">
							Language
						</label>
						<select
							id="language"
							name="language"
							defaultValue={chapter?.data?.language}
							className="form-control mb-3"
						>
							<option value="english">English</option>
							<option value="mandarin">Mandarin</option>
							<option value="hindi">Hindi</option>
							<option value="spanish">Spanish</option>
							<option value="french">French</option>
							<option value="arabic">Arabic</option>
							<option value="bengali">Bengali</option>
							<option value="russian">Russian</option>
							<option value="portuguese">Portuguese</option>
							<option value="indonesian">Indonesian</option>
						</select>
					</div>
					<div className="col">
						<label htmlFor="captionCert" className="form-label">
							Caption Certificate
						</label>
						<select
							id="captionCert"
							name="captionCert"
							defaultValue={chapter?.data?.captionCert}
							className="form-control mb-3"
						>
							<option value="0">None</option>
							<option value="1">
								This content has never aired on television in the U.S.
							</option>
							<option value="2">
								This content has only aired on television in the U.S. without
								captions
							</option>
							<option value="3">
								This content has not aired on U.S. television with captions
								since September 30, 2012.
							</option>
							<option value="4">
								This content does not consist of full-length video programming.
							</option>
							<option value="5">
								This content does not fall within a category of online
								programming that requires captions under FCC regulations (47
								C.F.R. § 79).
							</option>
							<option value="6">
								The FCC and/or U.S. Congress has granted an exemption from
								captioning requirements for this content.
							</option>
						</select>
					</div>
					<div className="col">
						<label htmlFor="recordingDate" className="form-label">
							Recording Date
						</label>
						<input
							id="recordingDate"
							name="recordingDate"
							defaultValue={chapter?.data?.recordingDate}
							type="text"
							className="form-control mb-3"
							placeholder="01/30/2020"
						/>
					</div>
					<div className="col">
						<label htmlFor="license" className="form-label">
							License
						</label>
						<select
							id="license"
							name="license"
							defaultValue={chapter?.data?.license}
							className="form-control"
						>
							<option value="0">Standard beFree license</option>
							<option value="1">Creative Commons - Attribution</option>
						</select>
					</div>
				</div>
				<div className="row">
					<div className="col">
						<label htmlFor="free_preview" className="form-label">
							Free Preview
						</label>
						<select
							id="free_preview"
							name="free_preview"
							defaultValue={chapter?.data?.free_preview.toString()}
							className="form-control"
						>
							<option value={true}>Yes</option>
							<option value={false}>No</option>
						</select>
					</div>
					<div className="col">
						<label htmlFor="duration" className="form-label">
							Duration
						</label>
						<input
							id="duration"
							name="duration"
							defaultValue={chapter?.data?.duration}
							type="text"
							className="form-control mb-3"
							placeholder=""
						/>
					</div>
					<div className="col">
						<label htmlFor="averageRating" className="form-label">
							Average Rating
						</label>
						<select
							id="averageRating"
							name="averageRating"
							defaultValue={chapter?.data?.averageRating}
							className="form-control"
						>
							<option value={1}>1</option>
							<option value={2}>2</option>
							<option value={3}>3</option>
							<option value={4}>4</option>
							<option value={5}>5</option>
							<option value={6}>6</option>
							<option value={7}>7</option>
							<option value={8}>8</option>
							<option value={9}>9</option>
							<option value={10}>10</option>
						</select>
					</div>
					<div className="col">
						<label htmlFor="orderingNumber" className="form-label">
							Order
						</label>
						<input
							id="orderingNumber"
							name="orderingNumber"
							defaultValue={chapter?.data?.orderingNumber}
							type="number"
							className="form-control mb-3"
							placeholder="Here goes the #number of object within list"
						/>
					</div>
				</div>
				<div className="row">
					<div className="col">
						<h4>Players</h4>
						<label htmlFor="mega" className="form-label">
							Mega
						</label>
						<input
							id="mega"
							name="mega"
							defaultValue={chapter?.data?.players?.mega}
							type="text"
							className="form-control mb-3"
							placeholder=""
						/>
						<label htmlFor="streamwish" className="form-label">
							Streamwish
						</label>
						<input
							id="streamwish"
							name="streamwish"
							defaultValue={chapter?.data?.players?.streamwish}
							type="text"
							className="form-control mb-3"
							placeholder=""
						/>
						<label htmlFor="yourupload" className="form-label">
							Your Upload
						</label>
						<input
							id="yourupload"
							name="yourupload"
							defaultValue={chapter?.data?.players?.yourupload}
							type="text"
							className="form-control mb-3"
							placeholder=""
						/>
						<label htmlFor="okru" className="form-label">
							Okru
						</label>
						<input
							id="okru"
							name="okru"
							defaultValue={chapter?.data?.players?.okru}
							type="text"
							className="form-control mb-3"
							placeholder=""
						/>
						<label htmlFor="maru" className="form-label">
							Maru
						</label>
						<input
							id="maru"
							name="maru"
							defaultValue={chapter?.data?.players?.maru}
							type="text"
							className="form-control mb-3"
							placeholder=""
						/>
						<label htmlFor="netu" className="form-label">
							Netu
						</label>
						<input
							id="netu"
							name="netu"
							defaultValue={chapter?.data?.players?.netu}
							type="text"
							className="form-control mb-3"
							placeholder=""
						/>
						<label htmlFor="stape" className="form-label">
							Stape
						</label>
						<input
							id="stape"
							name="stape"
							defaultValue={chapter?.data?.players?.stape}
							type="text"
							className="form-control mb-3"
							placeholder=""
						/>
					</div>
					<div className="col">
						<h4>Downloads</h4>
						<label htmlFor="mega_download" className="form-label">
							Mega
						</label>
						<input
							id="mega_download"
							name="mega_download"
							defaultValue={chapter?.data?.downloads?.mega}
							type="text"
							className="form-control mb-3"
							placeholder=""
						/>
						<label htmlFor="onefichier" className="form-label">
							One Fichier
						</label>
						<input
							id="onefichier"
							name="onefichier"
							defaultValue={chapter?.data?.downloads?.onefichier}
							type="text"
							className="form-control mb-3"
							placeholder=""
						/>
						<label htmlFor="stape_download" className="form-label">
							Stape
						</label>
						<input
							id="stape_download"
							name="stape_download"
							defaultValue={chapter?.data?.downloads?.stape}
							type="text"
							className="form-control mb-3"
							placeholder=""
						/>
					</div>
				</div>
			</div>
			<div className="col-lg-3">
				<AdminSidebar
					displayCategoryField={false}
					displayAvatar={false}
					avatar={undefined}
					avatarFormat={"image"}
					status={chapter?.data?.status}
					fullWidth={false}
					password=""
					featured={chapter?.data?.featured.toString()}
					commented={chapter?.data?.commented.toString()}
					embedding={chapter?.data?.embedding.toString()}
					github_readme={""}
					category={undefined}
					categories={[]}
					multiple_categories={false}
				/>
				<br />
				<FormButtons />
			</div>
		</form>
	);
};

export default UpdateChapter;
