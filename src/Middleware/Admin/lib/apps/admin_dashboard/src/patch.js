/**
 *
 * @param shadowRootContainer - The HTML element that is the shadowRoot's parent
 * @param portalRoot - The HTML element that you want Modals to be teleported to
 * @returns
 */
export default function patch(
	shadowRootContainer,
	portalRoot
) {
	const elementById = Document.prototype.getElementById;

	const element = portalRoot
		? portalRoot
		: shadowRootContainer.shadowRoot?.children[0];
	console.log(element);
	if (!element) return;
	
	Document.prototype.getElementById = function (elementId) {
		console.log(elementId);
		if (elementId === "headlessui-portal-root") {
			const d = document.createElement("div");
			d.id = elementId;
			element.appendChild(d);
		
			return d;
		}
		return elementById.call(this, elementId);
	};
	
	const activeElementDescriptorGetter = Object.getOwnPropertyDescriptor(
		Document.prototype,
		"activeElement"
	)?.get;
	
	Object.defineProperty(Document.prototype, "activeElement", {
		get: function () {
			const activeElement = activeElementDescriptorGetter?.call(this);
			if (activeElement === shadowRootContainer) {
				return shadowRootContainer.shadowRoot?.activeElement;
			}
		},
	});
	
	const targetGetter = Object.getOwnPropertyDescriptor(
		Event.prototype,
		"target"
	)?.get;
	
	Object.defineProperty(Event.prototype, "target", {
		get: function () {
			const target = targetGetter?.call(this);
			if (target === shadowRootContainer) {
				return this.path[0];
			}
			return target;
		},
	});
}