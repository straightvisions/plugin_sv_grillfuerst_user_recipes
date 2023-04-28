import React, { useState } from "react";
import routes from "../../../models/routes";
import headers from "../../../modules/headers";
import mediaModel from "../../../models/media";
import Spinner from "../../spinner";

export default function MediaEdit(props) {
	const { label = "", subLabel = "", onChange = (e) => {}, onClose = (e) => {}, route = "", mediaFile = {} } = props;
	
	const [saving, setSaving] = useState(false);
	const [media, setMedia] = useState({ ...mediaModel, ...mediaFile });
	
	const handleSave = () => {
		if (saving) return;
		setSaving(true);
		// upload fetch
		fetch(routes.updateMedia + route, {
			method: "PUT",
			headers: headers.get(),
			body: JSON.stringify(media),
		})
			.then((response) => response.json())
			.then((result) => {
				onChange(result);
				setSaving(false);
			})
			.catch((error) => {
				// error handling here
				console.error("Error:", error);
				setSaving(false);
			});
	};
	
	const handleClose = () => {
		// Logic to handle closing the modal
		onClose();
	}
	
	const getMediaHtml = () => {
		
		if(!media.type){
			const fileExtension = media.filename.split('.').pop().toLowerCase();
			
			switch (fileExtension) {
				case 'mp4':
				case 'webm': media.type = 'video'; break;
				case 'mp3':
				case 'wav': media.type = 'audio'; break;
				case 'pdf': media.type = 'pdf'; break;
				default:
					return  media.type = 'image'; break; // Or return a default HTML element if needed
			}
		}
		
		if (media.type === "image") {
			return <img src={media.url} alt={media.title} />;
		} else if (media.type === "video") {
			return <video src={media.url} controls />;
		} else if (media.type === "audio") {
			return <audio src={media.url} controls />;
		} else if (media.type === "pdf") {
			return (
				<object
					data={media.url}
					type="application/pdf"
					width="100%"
					height="500px"
				>
					<p>Unable to display PDF. Please download it.</p>
				</object>
			);
		} else {
			return null; // Or return a default HTML element if needed
		}
	};
	
	return (
		<div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50 p-5">
			<div className="bg-white p-4 rounded-md shadow-lg w-full max-w-[1400px]">
				<h2 className="border-b-2 border-gray-100 mb-2 pb-2">Bild bearbeiten</h2>
				<div className="flex justify-between gap-10 bg-grey-100 p-4 rounded">
					<div className="w-full max-w-[1000px] max-h-[100%]">
						{getMediaHtml()}
					</div>
					<div className="w-full max-w-[400px]">
						<div className="mb-4">
							<label className="text-gray-700">{label}</label>
							<p className="text-gray-500">{subLabel}</p>
						</div>
						<div className="mb-4">
							<label className="block text-sm font-medium text-gray-700">Title</label>
							<input
								type="text"
								value={media.title}
								onChange={(e) => setMedia({ ...media, title: e.target.value })}
								className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
							/>
						</div>
						<div className="mb-4">
							<label className="block text-sm font-medium text-gray-700">Filename</label>
							<input
								type="text"
								value={media.newFilename ? media.newFilename : media.filename}
								onChange={(e) => setMedia({ ...media, newFilename: e.target.value })}
								className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
							/>
						</div>
						<div>
							<label className="block text-sm font-medium text-gray-700">Description</label>
							<textarea
								value={media.description}
								onChange={(e) => setMedia({ ...media, description: e.target.value })}
								className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
							></textarea>
						</div>
						
					</div>
				</div>
				
				<div className="flex justify-end mt-4">
					<button
						onClick={handleSave}
						className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md disabled:bg-gray-300 disabled:cursor-not-allowed mr-2"
						disabled={saving}
					>
						{saving && <Spinner height="4" width="4"/>}
						Speichern
					</button>

		          <button
		            onClick={handleClose}
		            className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded-md"
		            disabled={saving}
		          >
		            Abbrechen
		          </button>
		        </div>
		      </div>
		    </div>
  );
}
