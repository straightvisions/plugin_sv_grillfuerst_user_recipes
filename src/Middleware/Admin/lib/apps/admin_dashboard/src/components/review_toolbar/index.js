import React from 'react';
import Spinner from '../spinner';

export default function ReviewToolbar(props) {
	const {
		onSave = () => {},
		onSubmit = () => {},
		onPublish = () => {},
		saving = false,
		submitting = false,
		publishing = false
	} = props;

	const disabled = saving || submitting || publishing;

	return (
		<div className="flex flex-row items-center items-stretch mb-2 gap-2">
			<button disabled={disabled} onClick={onSave} type="button" className="flex items-center gap-2 px-2 py-1 bg-white border rounded text-sm border-gray-200 bg-blue-600 text-white">
				{ saving ? <> <Spinner width="4" height="4" /> Speichern </> :
					<> Speichern </>
				}
			</button>
			<button disabled={disabled} onClick={onSubmit} type="button" className="flex items-center gap-2 px-2 py-1 bg-white border rounded text-sm border-gray-200 bg-orange-600 text-white">
				{ submitting ? <> <Spinner width="4" height="4" /> Feedback senden </> :
					<> Feedback senden </>
				}
			</button>
			<button disabled={disabled} onClick={onPublish} type="button" className="flex items-center gap-2 px-2 py-1 bg-white border rounded text-sm border-gray-200 bg-red-600 text-white">
				{ publishing ? <> <Spinner width="4" height="4" /> Veröffentlichen </> :
					<> Veröffentlichen </>
				}
			</button>
		</div>
	);
}

