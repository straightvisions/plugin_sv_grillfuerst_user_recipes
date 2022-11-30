import React, { useState } from "react";
import Spinner from "../spinner";

export default function Dropzone(props) {
	const {
		label = '',
		subLabel = '',
		hint = '',
		multiple = false,
		accept = 'image/*',
		onChange = (files) => {},
		uploading = false,
	} = props;
	
	const [dragActive, setDragActive] = useState(false);
	const [errors, setErrors] = useState([]);
	
	const handleDrag = function(e) {
		e.preventDefault();
		e.stopPropagation();

		if (e.type === "dragenter" || e.type === "dragover") {
			return dragActive ? '' : setDragActive(true);
		} else if (e.type === "dragleave") {
			return dragActive ? setDragActive(false) : '';
		}
	};

	const handleDrop = function(e) {
		e.preventDefault();
		e.stopPropagation();

		if (e.dataTransfer.files && e.dataTransfer.files[0]) {
			const files = e.dataTransfer.files;
			
			setDragActive(false);
			return validate(files) ? onChange(files) : false;
		}
	};
	
	const handleChange = function(e) {
		e.preventDefault();

		if (e.target.files && e.target.files[0]) {
			const files = e.target.files;
			setDragActive(false);
			return validate(files) ? onChange(files) : false;
		}
	};
	
	const validate = function(files){
		let errors = [];
		// handle multiple files if not allowed  ------------------------------------------------------------------
		if(multiple === false && files.length > 1){
			// error handling here -> notice component?
			errors.push('Nur eine Datei erlaubt!');
		}
		
		// handle wrong file formats ---------------------------------------------------------------------
		let wrongFileFormat = false;
		const allowed = accept.split('/');
		
		Array.from(files).forEach((item, index) => {
			const format = item.type.split('/');
			// media type
			wrongFileFormat = format[0] === allowed[0] ? wrongFileFormat : true;
			// wildcard && specific file type
			wrongFileFormat = allowed[1] === '*' ? wrongFileFormat : allowed[1].includes(format[1]) ? wrongFileFormat : true;
		});
		
		if(wrongFileFormat){
			errors.push('Falsches Dateiformat.');
		}
		
		setErrors(errors);
		
		return errors.length <= 0;
	}
	
	const dragStateIndicatorClass = dragActive ? ' border-sky-500' : ' border-white-300';

	if(uploading === true){
		return (
			<div
				className="h-full relative overflow-hidden mt-1 flex justify-center rounded-md p-6 bg-gray-100">
				<div className="m-auto p-6 space-y-1 bg-white text-center rounded-md  border-dashed border-4">
					<Spinner/>
				</div>
			</div>
		);
	}
	
	return (
		<div
			className="h-full relative overflow-hidden mt-1 flex justify-center rounded-md p-6 bg-gray-100"
			onDragEnter={handleDrag}
			onDragLeave={handleDrag} onDragOver={handleDrag} onDrop={handleDrop}
		>
			<div className={
				'm-auto p-6 space-y-1 bg-white text-center rounded-md  border-dashed border-4 '
				+ dragStateIndicatorClass }>
				<svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
					<path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"/>
				</svg>
				<div className="max-w-max flex flex-wrap justify-center text-sm text-gray-600">
					<label
						className="relative cursor-pointer font-bold text-orange-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-500 focus-within:ring-offset-2"
					>
						{label !== '' &&
							<span>{label}</span>
						}
						<input type="file" accept={accept} className="sr-only" multiple={multiple} onChange={handleChange}/>
					</label>
					{subLabel !== '' &&
						<p className="pl-1">{subLabel}</p>
					}
				</div>
				<p className="text-xs text-gray-500">{hint}</p>
				{errors.map(error => (
						<p key={error} className="text-xs text-red-500">{error}</p>
					))
				}
			</div>
		</div>
	);
}