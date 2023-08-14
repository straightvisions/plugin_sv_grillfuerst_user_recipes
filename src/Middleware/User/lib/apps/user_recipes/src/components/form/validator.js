import React, {useEffect, useState, useContext} from "react";

export default class Validator{
	
	static validate(state){
		const errors = [];
		
		!this.title(state.title) ? errors.push('<p><strong>Name des Rezeptes</strong> - Mindestens 20 Zeichen und einem aussagekräftigen, beschreibenden Namen des Rezeptes.</p>') : '';
		!this.excerpt(state.excerpt) ? errors.push('<p><strong>Kurzbeschreibung des Rezepts</strong> - Beschreibe mit mindestens 300 Zeichen (ca. 60 Wörtern) das Rezept mit einer guten Zusammenfassung, Besonderheiten, Geschmack, Besonderheiten in der Zubereitung.</p>') : '';
		!this.featuredImage(state.featured_image) ? errors.push('<p>Bitte lade ein <strong>Hauptbild</strong> hoch.</p>') : '';
		!this.genericArray(state.menu_type) ? errors.push('<p>Bitte wähle die <strong>die Art des Gerichts</strong>.</p>') : '';
		!this.genericArray(state.kitchen_style) ? errors.push('<p>Bitte wähle die <strong>Grillkategorie</strong>.</p>') : '';
		!this.genericInteger(state.preparation_time) ? errors.push('<p>Bitte gib die <strong>Vorbereitungszeit in Min.</strong> an.</p>') : '';
		!this.genericInteger(state.cooking_time) ? errors.push('<p>Bitte gib die <strong>Kochzeit in Min.</strong> an.</p>') : '';
		!this.ingredients(state.ingredients) ? errors.push('<p>Bitte füge min. zwei <strong>Zutaten</strong> mit Mengenangaben hinzu.</p>') : '';
		!this.steps(state.steps) ? errors.push('<p>Bitte füge min. zwei <strong>Schritte</strong> mit Foto und Beschreibung (Mindestlänge 10 Zeichen) hinzu.</p>') : '';
		!this.genericCheckbox(state.legal_rights) ? errors.push('<p>Bitte akzeptiere die <strong>Teilnahmebedingungen</strong> der Grillfürst GmbH.</p>') : '';
		
		return errors;
	}
	
	static title(s){
		return s.length >= 20;
	}
	
	static excerpt(s){
		return s.length >= 300;
	}
	
	static featuredImage(i){
		// @todo validate image + size
		return typeof i === 'object' && Object.keys(i).length > 0;
	}
	
	static genericArray(arr){
		return arr.length > 0;
	}
	
	static genericInteger(num){
		return parseInt(num) > 0;
	}
	
	static ingredients(arr){
		let check = true;
		
		arr.forEach((item) => {
			item.amount <= 0 ? check = false : '';
			// check custom items
			if(item.custom){
				item.label.length <= 0 ? check = false : '';
			}
		});
		
		return arr.length >= 2 && check;
	}
	
	static steps(arr){
		// check step length
		if(arr.length < 2) return false;
	
		// check if min. 2 steps have images
		let imagesNum = 0;
		arr.forEach((item) => {
			// if any step has no description, return false
			if(item.description.length < 10) return false;
			// count images for final check
			if(item.images.length > 0) imagesNum++;
		});
		
		return imagesNum === arr.length;
	}
	
	static genericCheckbox(bool){
		return parseInt(bool) === 1;
	}
}