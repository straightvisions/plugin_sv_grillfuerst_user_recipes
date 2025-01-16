import React from 'react';

const DateDisplay = ({
	                     date,
	                     format = 'YYYY-MM-DD HH:mm:ss',
	                     timezoneOffset = 0,
	                     fallbackDate = '1970-01-01T00:00:00Z', // Fallback date in ISO format
                     }) => {

	const formatDate = (dateString, format, offset) => {
		const parsedDate = new Date(dateString);
		
		// Check if the parsed date is valid
		if (isNaN(parsedDate.getTime())) {
			// Use fallback date if the input date is invalid
			return formatDate(fallbackDate, format, offset);
		}
		
		const adjustedTime = parsedDate.getTime() + offset * 60 * 1000; // Adjust for timezone offset in minutes
		const adjustedDate = new Date(adjustedTime);
		
		// Helper to pad numbers with leading zeros
		const pad = (number) => (number < 10 ? `0${number}` : number);
		
		const year = adjustedDate.getFullYear();
		const month = pad(adjustedDate.getMonth() + 1);
		const day = pad(adjustedDate.getDate());
		const hours = pad(adjustedDate.getHours());
		const minutes = pad(adjustedDate.getMinutes());
		const seconds = pad(adjustedDate.getSeconds());
		
		// Replace format placeholders with actual values
		return format
			.replace('YYYY', year)
			.replace('MM', month)
			.replace('DD', day)
			.replace('HH', hours)
			.replace('mm', minutes)
			.replace('ss', seconds);
	};
	
	return <span>{formatDate(date, format, timezoneOffset)}</span>;
};

export default DateDisplay;
