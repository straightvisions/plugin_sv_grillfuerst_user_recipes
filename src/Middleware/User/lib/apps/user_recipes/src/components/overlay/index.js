import React from "react";
import Spinner from '../spinner';

export default function Overlay(props){
	
	const {message = false} = props;
	
	return (
		<div className="absolute top-0 left-0 right-0 bottom-0 w-full z-50 overflow-hidden bg-white opacity-75 flex flex-col items-center justify-center">
			{message ? {message} : <Spinner />}
		</div>
	);
}