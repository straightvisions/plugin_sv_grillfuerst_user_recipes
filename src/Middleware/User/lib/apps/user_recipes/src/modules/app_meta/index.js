import version from '../../version';

const getBrowser = () => {
	const vendor = window.navigator.vendor ?? '---';
	const userAgent = window.navigator.userAgent ?? '---';
	return `${vendor} - ${userAgent}`;
}

export const appMeta = {
	appVersion: version,
	browser: getBrowser(),
}