import user from '../../modules/user';

const messages = {
	other: 'Ups! Auf unserer Seite ist ein Fehler aufgetreten. Wir entschuldigen uns für die Unannehmlichkeiten! Bitte versuche es später erneut.',
	unauthorized: 'Ups! Du scheinst nicht angemeldet zu sein. Bitte melde dich an und versuche es erneut.',
	notFound: 'Ups! Die Seite konnte nicht gefunden werden. Bitte versuche es später erneut.',
	serverError: 'Ups! Auf unserer Seite ist ein Serverfehler aufgetreten. Bitte versuche es später erneut.'
};

export function fetchError(response) {
	if (response.status >= 100 && response.status <= 199) {
		handleInformationalResponse();
	} else if (response.status >= 200 && response.status <= 299) {
		handleSuccessfulResponse();
	} else if (response.status >= 300 && response.status <= 399) {
		handleRedirectionMessage();
	} else if (response.status === 404) {
		handleNotFound();
	} else if (response.status >= 400 && response.status <= 499) {
		handleClientErrorResponse();
	} else if (response.status >= 500 && response.status <= 599) {
		handleServerError();
	} else {
		handleOtherErrors();
	}
	
	return response;
}

function handleInformationalResponse() {
	// Handle informational responses (100–199)
	// nothing
}

function handleSuccessfulResponse() {
	// Handle successful responses (200–299)
	// nothing
}

function handleRedirectionMessage() {
	// Handle redirection messages (300–399)
	// nothing
}

function handleNotFound() {
	// Handle client error responses (400–499)
	alert(messages.notFound);
}

function handleClientErrorResponse() {
	// Handle client error responses (400–499)
	alert(messages.unauthorized);
	// 401 errors happen if user session is expired
	user.logout();
}

function handleServerError() {
	// Handle server error responses (500–599)
	alert(messages.serverError);
}

function handleOtherErrors() {
	// Handle other errors
	alert(messages.other);
}
