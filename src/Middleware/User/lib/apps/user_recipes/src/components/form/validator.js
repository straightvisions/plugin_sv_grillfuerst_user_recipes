import React, {useEffect, useState, useContext} from "react";

export default class Validator{
	
	static validate(state){
		const errors = [];
		
		!this.title(state.title) ? errors.push('<p>Der <strong>Rezeptname</strong> muss mindestens 10 Zeichen lang sein.</p>') : '';
		!this.excerpt(state.excerpt) ? errors.push('<p>Die <strong>Kurzbeschreibung</strong> muss mindestens 2 Sätze enthalten und mehr als 10 Zeichen.</p>') : '';
		!this.featuredImage(state.featured_image) ? errors.push('<p>Bitte lade ein <strong>Hauptbild</strong> hoch.</p>') : '';
		!this.genericArray(state.menu_type) ? errors.push('<p>Bitte wähle die <strong>die Art des Gerichts</strong>.</p>') : '';
		!this.genericArray(state.kitchen_style) ? errors.push('<p>Bitte wähle die <strong>Grillkategorie</strong>.</p>') : '';
		!this.genericInteger(state.preparation_time) ? errors.push('<p>Bitte gib die <strong>Vorbereitungszeit in Min.</strong> an.</p>') : '';
		!this.genericInteger(state.cooking_time) ? errors.push('<p>Bitte gib die <strong>Kochzeit in Min.</strong> an.</p>') : '';
		!this.ingredients(state.ingredients) ? errors.push('<p>Bitte füge min. zwei <strong>Zutaten</strong> mit Mengenangaben hinzu.</p>') : '';
		!this.steps(state.steps) ? errors.push('<p>Bitte füge min. zwei <strong>Schritte</strong> mit Foto und Beschreibung (Mindestlänge 10 Zeichen) hinzu.</p>') : '';
		!this.genericCheckbox(state.legal_rights) ? errors.push('<p>Bitte akzeptiere die <strong>Teilnahmebedingungen</strong> der Grillfürst GmbH..</p>') : '';
		
		return errors;
	}
	
	static title(s){
		return s.length >= 10;
	}
	
	static excerpt(s){
		// Remove line breaks and trim whitespace
		s = s.trim().replace(/\s+/g, ' ');
		// Split the text into sentences using regular expressions
		const sentences = s.split(/(?<=[.!?])\s+/);
		// Count the number of sentences
		const sentenceCount = sentences.length;
		return sentenceCount >= 2 && s.length >= 10;
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
		let check = true;
		
		arr.forEach((item) => {
			item.description.length < 10 ? check = false : '';
			item.images.length <= 0 ? check = false : '';
		});
		
		return arr.length >= 2 && check;
	}
	
	static genericCheckbox(bool){
		return parseInt(bool) === 1;
	}
}