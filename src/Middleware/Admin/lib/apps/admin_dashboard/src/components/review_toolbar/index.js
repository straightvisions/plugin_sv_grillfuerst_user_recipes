import React from 'react';

export default function ReviewToolbar(props) {
	
	const {
		onClick = () => {},
	} = props;
	
	return (
		<div className="flex flex-row items-center items-stretch mb-2 gap-2">
			<button type="button" className="px-2 py-1 bg-white border rounded text-sm border-gray-200 bg-blue-600 text-white">
				Speichern
			</button>
			<button type="button" className="px-2 py-1 bg-white border rounded text-sm border-gray-200 bg-orange-600 text-white">
				Feedback senden
			</button>
			<button type="button" className="px-2 py-1 bg-white border rounded text-sm border-gray-200 bg-red-600 text-white">
				Veröffentlichen
			</button>
		</div>
	);
}

