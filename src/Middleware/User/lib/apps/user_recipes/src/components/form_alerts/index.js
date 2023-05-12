import React from "react";

export function AlertReviewPending() {
	return (
		<div className="flex items-center bg-blue-500 text-white font-bold px-4 py-3" role="alert">
			<svg className="fill-current w-16 h-16 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
				<path
					d="M12.432 0c1.34 0 2.01.912 2.01 1.957 0 1.305-1.164 2.512-2.679 2.512-1.269 0-2.009-.75-1.974-1.99C9.789 1.436 10.67 0 12.432 0zM8.309 20c-1.058 0-1.833-.652-1.093-3.524l1.214-5.092c.211-.814.246-1.141 0-1.141-.317 0-1.689.562-2.502 1.117l-.528-.88c2.572-2.186 5.531-3.467 6.801-3.467 1.057 0 1.233 1.273.705 3.23l-1.391 5.352c-.246.945-.141 1.271.106 1.271.317 0 1.357-.392 2.379-1.207l.6.814C12.098 19.02 9.365 20 8.309 20z"/>
			</svg>
			<p>Dein Rezept wird derzeit geprüft und aktuell nicht weiter bearbeitet werden. Du erhälst eine Nachricht, wenn es Änderungsvorschläge gibt oder dein Rezept veröffentlicht wurde.</p>
		</div>
	);
}

export function AlertReviewed(props) {
	const {
		feedback
	} = props;
	
	const latestFeedback = feedback[feedback.length -1];
	
	return (
		<div className=" space-y-4 bg-blue-100 border-t border-b border-blue-500 text-blue-700 px-4 py-3" role="alert">
			<p className="font-bold">Anpassungen notwendig</p>
			<p className="text-grey"><i>Bitte führe die folgenden Änderungen durch und reiche dein Rezept erneut ein:</i></p>
			<p className="" dangerouslySetInnerHTML={{__html: latestFeedback.text}} />
		</div>
	);
}

export function AlertPublished(props) {
	const {
		voucher,
		link
	} = props;
	
	return (
		<div className="flex flex-col gap-4 space-y-4 bg-blue-100 border-t border-b border-blue-500 text-blue-700 px-4 py-3" role="alert">
			<p className="font-bold">Dein Rezept wurde veröffentlicht!</p>
			<p className="">Als Dankeschön erhälst du diesen exklusiven Gutschein-Code, den du in unserem <a className="link" href="https://www.grillfuerst.de/" target="_blank">Onlineshop</a> einlösen kannst: <br/><br/>
				<span className="text-lg font-bold">{voucher}</span><br /><br />
			</p>
		</div>
	);
}