"use strict";

var Docxtemplater = require("../js/docxtemplater.js");
window.Docxtemplater = Docxtemplater;
var expressions = require("angular-expressions");
window.expressions = expressions;

var textAreaAdjust = function (o) {
	o.style.height = "1px";
	o.style.height = (25 + o.scrollHeight) + "px";
};

var loadFile = function (url, callback) {
	JSZipUtils.getBinaryContent(url, function (err, data) {
		callback(err, data);
	});
};

window.onload = function () {
	var i;
	var textAreaList = document.getElementsByTagName("textarea");

	for (i = textAreaList.length - 1; i >= 0; i--) {
		textAreaAdjust(textAreaList[i]);
		var executeButton = document.createElement("button");
		executeButton.className = "execute";
		executeButton.innerHTML = "Execute";
		textAreaList[i].parentNode.insertBefore(executeButton, textAreaList[i].nextSibling);

		var viewRawButton = document.createElement("button");
		viewRawButton.className = "raw";
		viewRawButton.innerHTML = "View Initial Document";
		textAreaList[i].parentNode.insertBefore(viewRawButton, textAreaList[i].nextSibling);
	}

	var executeButtonList = document.getElementsByClassName("execute");

	var executeFn = function () {
		var childs = (this.parentNode.childNodes);

		for (var j = 0; j < childs.length; j++) {
			if (childs[j].tagName === "TEXTAREA") {
				/* eslint-disable no-eval */
				eval(childs[j].value);
			}
		}
	};

	for (i = 0; i < executeButtonList.length; i++) {
		executeButtonList[i].onclick = executeFn;
	}

	var viewRawButtonList = document.getElementsByClassName("raw");

	var saveAsRaw = function (err, content) {
		if (err) {
			throw err;
		}
		var output = new Docxtemplater(content).getZip().generate({type: "blob"});
		saveAs(output, "raw.docx");
	};

	var viewRawFn = function () {
		var childs = (this.parentNode.childNodes);

		for (var j = 0; j < childs.length; j++) {
			if (childs[j].tagName === "TEXTAREA") {
				var raw = (childs[j].getAttribute("raw"));
				loadFile(raw, saveAsRaw);
			}
		}
	};

	for (i = 0; i < viewRawButtonList.length; i++) {
		viewRawButtonList[i].onclick = viewRawFn;
	}
};
