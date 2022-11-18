import React, { useState, useEffect } from "react";

export default function Spinner(){
	return (
		<div className="flex justify-center items-center">
			<div className="spinner-grow inline-block w-8 h-8 bg-current rounded-full opacity-0" role="status">
				<span className="visually-hidden">Loading...</span>
			</div>
		</div>
	);
}