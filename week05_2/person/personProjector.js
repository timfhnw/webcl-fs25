import { T } from "../../kolibri-dist-0.9.10/kolibri/lambda/church.js";
import {VALUE, VALID, EDITABLE, LABEL} from "../../kolibri-dist-0.9.10/kolibri/presentationModel.js";

export { personListItemProjector, personFormProjector, personListItemTableProjector, personListItemDivRowProjector }

const bindTextInput = (textAttr, inputElement) => {
    inputElement.oninput = _ => textAttr.setConvertedValue(inputElement.value);

    textAttr.getObs(VALUE).onChange(text => inputElement.value = text);

    textAttr.getObs(VALID, true).onChange(
        valid => valid
          ? inputElement.classList.remove("invalid")
          : inputElement.classList.add("invalid")
    );

    textAttr.getObs(EDITABLE, true).onChange(
        isEditable => isEditable
        ? inputElement.removeAttribute("readonly")
        : inputElement.setAttribute("readonly", true));

    // todo: the label property should be shown as a pop-over on the text element.

};

const personTextProjector = textAttr => {

    const inputElement = document.createElement("INPUT");
    inputElement.type = "text";
    inputElement.size = 20;

    bindTextInput(textAttr, inputElement);

    return inputElement;
};

const personListItemTableProjector = (masterController, selectionController, rootElement, person) => {

    const deleteButton      = document.createElement("Button");
    deleteButton.setAttribute("class","delete");
    deleteButton.innerHTML  = "&times;";
    deleteButton.onclick    = _ => masterController.removePerson(person);

    const firstnameInputElement = personTextProjector(person.firstname);
    const lastnameInputElement = personTextProjector(person.lastname);
    const tr = document.createElement("TR");
    const th1 = document.createElement("TH");
    const th2 = document.createElement("TH");

    // todo: when a line in the master view is clicked, we have to set the selection

    selectionController.onPersonSelected(
        selected => selected === person
          ? deleteButton.classList.add("selected")
          : deleteButton.classList.remove("selected")
    );

    masterController.onPersonRemove( (removedPerson, removeMe) => {
        if (removedPerson !== person) return;
        rootElement.removeChild(tr);
        // todo: what to do with selection when person was removed?
        removeMe();
    } );

    const onFieldFocus = () => selectionController.setSelectedPerson(person);
    firstnameInputElement.addEventListener('focus', onFieldFocus);
    lastnameInputElement.addEventListener('focus', onFieldFocus);

    rootElement.appendChild(tr);
    tr.appendChild(deleteButton);
    tr.append(th1);
    th1.appendChild(firstnameInputElement);
    tr.append(th2);
    th2.appendChild(lastnameInputElement);
    // todo: what to do with selection when person was added?
    selectionController.setSelectedPerson(person);
};

const personListItemDivRowProjector = (masterController, selectionController, rootElement, person) => {

    const deleteButton      = document.createElement("Button");
    deleteButton.setAttribute("class","delete");
    deleteButton.innerHTML  = "&times;";
    deleteButton.onclick    = _ => masterController.removePerson(person);

    const firstnameInputElement = personTextProjector(person.firstname);
    const lastnameInputElement = personTextProjector(person.lastname);
    const row = document.createElement("DIV");
    const cell1 = document.createElement("DIV");
    const cell2 = document.createElement("DIV");

    row.className = "row"
    // todo: when a line in the master view is clicked, we have to set the selection

    selectionController.onPersonSelected(
        selected => selected === person
          ? deleteButton.classList.add("selected")
          : deleteButton.classList.remove("selected")
    );

    masterController.onPersonRemove( (removedPerson, removeMe) => {
        if (removedPerson !== person) return;
        rootElement.removeChild(row);
        // todo: what to do with selection when person was removed?
        removeMe();
    } );

    const onFieldFocus = () => selectionController.setSelectedPerson(person);
    firstnameInputElement.addEventListener('focus', onFieldFocus);
    lastnameInputElement.addEventListener('focus', onFieldFocus);

    rootElement.appendChild(row);
    row.appendChild(deleteButton);
    cell1.appendChild(firstnameInputElement);
    cell2.appendChild(lastnameInputElement);
    row.append(cell1);
    row.append(cell2);

    // todo: what to do with selection when person was added?
    selectionController.setSelectedPerson(person);
};

const personListItemProjector = (masterController, selectionController, rootElement, person) => {

    const deleteButton      = document.createElement("Button");
    deleteButton.setAttribute("class","delete");
    deleteButton.innerHTML  = "&times;";
    deleteButton.onclick    = _ => masterController.removePerson(person);

    const firstnameInputElement = personTextProjector(person.firstname); // todo create the input fields and bind to the attribute props
    const lastnameInputElement  = personTextProjector(person.lastname);

    // todo: when a line in the master view is clicked, we have to set the selection

    selectionController.onPersonSelected(
        selected => selected === person
          ? deleteButton.classList.add("selected")
          : deleteButton.classList.remove("selected")
    );

    masterController.onPersonRemove( (removedPerson, removeMe) => {
        if (removedPerson !== person) return;
        rootElement.removeChild(deleteButton);
        rootElement.removeChild(firstnameInputElement);
        rootElement.removeChild(lastnameInputElement);
        // todo: what to do with selection when person was removed?
        removeMe();
    } );

    rootElement.appendChild(deleteButton);
    rootElement.appendChild(firstnameInputElement);
    rootElement.appendChild(lastnameInputElement);
    // todo: what to do with selection when person was added?
};

const personFormProjector = (detailController, rootElement, person) => {

    const divElement = document.createElement("TABLE");
    divElement.innerHTML = `
    <FORM>
        <DIV class="detail-form">
            <LABEL for="firstname"></LABEL>
            <INPUT TYPE="text" size="20" id="firstname">   
            <LABEL for="lastname"></LABEL>
            <INPUT TYPE="text" size="20" id="lastname">   
        </DIV>
    </FORM>`;

    const firstnameInput = divElement.querySelector("#firstname");
    const lastnameInput  = divElement.querySelector("#lastname");
    const firstnameLabel = divElement.querySelector("label[for='firstname']");
    const lastnameLabel  = divElement.querySelector("label[for='lastname']");

    // todo: bind text values
    bindTextInput(person.firstname, firstnameInput);
    bindTextInput(person.lastname, lastnameInput);
    // todo: bind label values
    person.firstname.getObs(LABEL).onChange(label => firstnameLabel.textContent = label);
    person.lastname.getObs(LABEL).onChange(label => lastnameLabel.textContent = label);

    rootElement.firstChild.replaceWith(divElement); // react - style ;-)
};

