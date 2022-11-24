const rawList = [

	{label: "Esslöffel", value: "EL", plural: "Esslöffel"},
	{label: "Teelöffel", value: "TL", plural: "Teelöffel"},
	{label: "Kilogramm", value: "kg", plural: "Kilogramm"},
	{label: "Gramm", value: "g", plural: "Gramm"},
	{label: "Liter", value: "L", plural: "Liter"},
	{label: "Milliliter", value: "ml", plural: "Milliliter"},
	{label: "Tropfen", value: "Tropfen", plural: "Tropfen"},
	{label: "Prise", value: "Prise", plural: "Prisen"},
	{label: "Würfel", value: "Würfel", plural: "Würfel"},
	
	{label: "Stück", value: "Stück", plural: "Stück"},
	{label: "Stange", value: "Stange", plural: "Stangen"},
	{label: "Bund", value: "Bund", plural: "Bünde"},
	{label: "Beutel", value: "Beutel", plural: "Beutel"},
	
	{label: "Glas", value: "Glas", plural: "Gläser"},
	{label: "Weinglas", value: "Weinglas", plural: "Weingläser"},
	{label: "Tasse", value: "Tasse", plural: "Tassen"},
	{label: "Becher", value: "Becher", plural: "Becher"},
	{label: "Zehe", value: "Zehe", plural: "Zehen"},
	{label: "pro Person", value: "pro Person", plural: "pro Person"},
];

export default rawList.sort((a,b) => a.label - b.label);
