"use strict";
/* when the extension requests for the information,
    returieve and send it back
*/
browser.runtime.onMessage
    .addListener((message, sender, sendResponse) => {
    // the data structure to hold the anchor and button information
    const tabInfo = {
        linkList: Array(0),
        buttonList: Array(0)
    };
    // check for specific command from extension or return empty values
    if (message.command !== "getTabInfo") {
        sendResponse(tabInfo);
        return;
    }
    /* get all the anchor tag in the page and add the
        name of the achnor tag and link to the tabInfo
    */
    const allLinkTags = document.querySelectorAll("a");
    if (allLinkTags !== null && allLinkTags.length !== 0) {
        allLinkTags.forEach((linkElement) => {
            const linkTitle = (linkElement.textContent !== null) ? linkElement.textContent : "";
            const linkHref = linkElement.getAttribute("href");
            tabInfo.linkList.push({
                title: linkTitle,
                link: linkHref !== null ? linkHref : "",
            });
        });
    }
    // get all input of button type and append it to tabinfo for button
    const allButtonInputTags = document.querySelectorAll(`input[type="button"], input[type="submit"], input[type="reset"]`);
    if (allButtonInputTags !== null && allButtonInputTags.length !== 0) {
        allButtonInputTags.forEach((buttonElement) => {
            const buttonTitle = buttonElement.getAttribute("value");
            tabInfo.buttonList.push({
                title: (buttonTitle !== null) ? buttonTitle : "",
            });
        });
    }
    // send the final response back to the extension
    sendResponse(tabInfo);
    document.body.focus();
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
    // get the button element
    const allButtonInputTags = document.querySelectorAll(`input[type="button"], input[type="submit"], input[type="reset"]`);
    if (allButtonInputTags === null || allButtonInputTags.length === 0)
        return;
    const selectedButton = allButtonInputTags[message.index];
    // reset all borders we have added using the css class
    allButtonInputTags.forEach((buttonElement) => {
        buttonElement.classList.remove("LinkAndButtonExtensionfocusedButtonBorder");
    });
    // add border to the button we want to focus on by adding a css class
    selectedButton.classList.add("LinkAndButtonExtensionfocusedButtonBorder");
    // focus on the button element
    if (selectedButton instanceof HTMLElement) {
        selectedButton.focus();
    }
});
