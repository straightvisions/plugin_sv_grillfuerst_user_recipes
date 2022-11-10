import React from "react";
import Common from '../../components/form_common';
import Ingredients from '../../components/form_ingredients';
import Steps from '../../components/form_steps';
import Submit from '../../components/form_submit';

export default function Example() {
	return (
		<form className="space-y-6" action="#" method="POST">
			<Common/>
			<Ingredients/>
			<Steps/>
			<Submit/>
		</form>
	)
}