import React from 'react';

export default function VideoPlayer(props){
	
	const {
		src = '',
		className = ''
	} = props;
	
	return (
		<div className={className}>
			<video controls>
				<source src={src} type="video/mp4" />
				Your browser does not support the video tag.
			</video>
		</div>
	);
}
