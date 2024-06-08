"use client";

const OnboardingLink = ({ auth = {} }) => {
	return (
		<div className="alert alert-link rounded-0 m-0 border-0">
			<p>
				Hey,&nbsp;what&apos;s&nbsp;up?.&nbsp;Before&nbsp;being&nbsp;able&nbsp;to&nbsp;publish&nbsp;products&nbsp;and/or&nbsp;services&nbsp;that&nbsp;can&nbsp;be&nbsp;purchased&nbsp;by&nbsp;other&nbsp;users.&nbsp;You&nbsp;will&nbsp;need&nbsp;to&nbsp;finish&nbsp;setting&nbsp;up&nbsp;your&nbsp;Bussiness&nbsp;account&nbsp;on&nbsp;Stripe.
			</p>
			<p className="m-0">
				The&nbsp;link&nbsp;should&nbsp;have&nbsp;been&nbsp;sent&nbsp;to&nbsp;your&nbsp;inbox&nbsp;whenever&nbsp;you
				created&nbsp;your&nbsp;account.
				{/* &nbsp;Otherwise,&nbsp;here&nbsp;it&nbsp;is,&nbsp;
				<a href={auth?.user?.stripe?.stripeOnboardingLink} target="_blank">
					<b className="text-bg-primary text-decoration-underline">
						CLICK HERE!.
					</b>
				</a> */}
			</p>
			<p>
				If&nbsp;for&nbsp;some&nbsp;reason,&nbsp;you&nbsp;did&nbsp;not&nbsp;get&nbsp;the&nbsp;email,&nbsp;please&nbsp;make&nbsp;sure&nbsp;it&nbsp;did
				not&nbsp;go&nbsp;to&nbsp;your&nbsp;Spam&nbsp;folder.&nbsp;Let&nbsp;me&nbsp;know&nbsp;as&nbsp;soon&nbsp;as&nbsp;possible,&nbsp;said&nbsp;link
				is&nbsp;quite&nbsp;important&nbsp;for&nbsp;you&nbsp;to&nbsp;have!
			</p>
		</div>
	);
};

export default OnboardingLink;
