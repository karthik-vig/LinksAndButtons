"use strict";
/* when the extension requests for the information,
    returieve and send it back
*/
browser.runtime.onMessage
    .addListener((message, sender, sendResponse) => {
    // the data structure to hold the anchor and button information
    const tabInfo = {
        tabID: null,
        linkList: Array(0),
        buttonList: Array(0)
    };
    const linkQuerySelector = `a`;
    const buttonQuerySelector = `button, input[type="button"], input[type="submit"], input[type="reset"]`;
    // get the current tab's ID
    /*
    browser.tabs
    .query({active: true, currentWindow: true})
    .then((tabs: unknown) => {

    });
    */
    // check for specific command from extension or return empty values
    if (message.command !== "getTabInfo") {
        sendResponse(tabInfo);
        return;
    }
    // set the tabID
    tabInfo.tabID = message.tabID;
    /* get all the anchor tag in the page and add the
        name of the achnor tag and link to the tabInfo
    */
    const addLinkInfoToTabInfo = (linkElement) => {
        const linkTitle = (linkElement.textContent !== null) ? linkElement.textContent : "";
        const linkHref = linkElement.getAttribute("href");
        tabInfo.linkList.push({
            title: linkTitle,
            link: linkHref !== null ? linkHref : "",
        });
    };
    const allLinkTags = document.querySelectorAll(linkQuerySelector);
    allLinkTags.forEach(addLinkInfoToTabInfo);
    // get all input of button type and append it to tabinfo for button
    const addButtonInfoToTabInfo = (buttonElement) => {
        const buttonTitle = buttonElement.getAttribute("value");
        tabInfo.buttonList.push({
            title: (buttonTitle !== null) ? buttonTitle : "",
        });
    };
    const allButtonInputTags = document.querySelectorAll(buttonQuerySelector);
    allButtonInputTags.forEach(addButtonInfoToTabInfo);
    console.log(`getTabInfo: The length of buttons element node list for light DOM: ${tabInfo.buttonList.length}`);
    // try to find shadow DOM and get link and button elements in them
    document.querySelectorAll(`*`).forEach((element) => {
        if (!element.shadowRoot)
            return;
        // query for link and button under shadow DOM
        const shadowDOMLinks = element.shadowRoot.querySelectorAll(linkQuerySelector);
        shadowDOMLinks.forEach(addLinkInfoToTabInfo);
        const shadowDOMButtons = element.shadowRoot.querySelectorAll(buttonQuerySelector);
        shadowDOMButtons.forEach(addButtonInfoToTabInfo);
    });
    console.log(`getTabInfo: The length of all button elements including the shadow dom: ${tabInfo.buttonList.length}`);
    // send the final response back to the extension
    sendResponse(tabInfo);
});
/*
    To handle command from the extension to focus on a
    particular button. This function adds a border around the
    button to be focused on and then focuses on the button.
*/
browser.runtime.onMessage.addListener((message) => {
    if (message.command !== "buttonFocus") {
        return;
    }
    const buttonQuerySelector = `button, input[type="button"], input[type="submit"], input[type="reset"]`;
    // get the button element
    const allLightDOMButtonInputTags = document.querySelectorAll(buttonQuerySelector);
    const allButtonInputTags = [...allLightDOMButtonInputTags];
    //get all the shadow DOM elements
    document.querySelectorAll(`*`).forEach((element) => {
        if (!element.shadowRoot)
            return;
        const allShadowDOMButtonInputTags = element.shadowRoot.querySelectorAll(buttonQuerySelector);
        allButtonInputTags.concat([...allShadowDOMButtonInputTags]);
    });
    console.log(`buttonFocus: The length of node list of light dom button elements: ${allButtonInputTags.length}`);
    // reset all borders we have added using the css class
    allButtonInputTags.forEach((buttonElement) => {
        buttonElement.classList.remove("LinkAndButtonExtensionfocusedButtonBorder");
    });
    // get the element to be modified
    const selectedButton = allButtonInputTags[message.index];
    // add border to the button we want to focus on by adding a css class
    selectedButton.classList.add("LinkAndButtonExtensionfocusedButtonBorder");
    // focus on the button element
    selectedButton.focus();
});
