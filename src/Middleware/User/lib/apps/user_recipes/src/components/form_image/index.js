import React from "react";

export default function Image(data) {
	return (
		/*<div><img src={data.url} className="w-full block" /></div>*/
		<div className="mt-1 flex justify-center rounded-md border-2 border-dashed border-gray-300 px-6 pt-5 pb-6">
			<div className="space-y-1 text-center">
				<svg
					className="mx-auto h-12 w-12 text-gray-400"
					stroke="currentColor"
					fill="none"
					viewBox="0 0 48 48"
					aria-hidden="true"
				>
					<path
						d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
						strokeWidth={2}
						strokeLinecap="round"
						strokeLinejoin="round"
					/>
				</svg>
				<div className="flex text-sm text-gray-600">
					<label
						htmlFor="recipe_featured_image"
						className="relative cursor-pointer rounded-md bg-white font-medium text-orange-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-500 focus-within:ring-offset-2"
					>
						<span>Bild hochladen</span>
						<input id="recipe_featured_image" name="recipe_featured_image" type="file" className="sr-only" />
					</label>
					<p className="pl-1">oder per Drag & Drop ablegen</p>
				</div>
				<p className="text-xs text-gray-500">PNG oder JPG</p>
			</div>
		</div>
	)
}