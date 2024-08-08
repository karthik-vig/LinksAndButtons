"use strict";
browser.runtime.onMessage
    .addListener((message, sender, sendResponse) => {
    const tabInfo = {
        linkList: Array(0),
        buttonList: Array(0)
    };
    if (message.command !== "getTabInfo") {
        sendResponse(tabInfo);
        return;
    }
    const allLinkTags = document.querySelectorAll("a");
    if (allLinkTags !== null) {
        allLinkTags.forEach((linkElement) => {
            const linkTitle = (linkElement.textContent !== null) ? linkElement.textContent : "";
            const linkHref = linkElement.getAttribute("href");
            tabInfo.linkList.push({
                title: linkTitle,
                link: linkHref !== null ? linkHref : "",
            });
        });
    }
    const allButtonTags = document.querySelectorAll(`input[type="button"]`);
    if (allButtonTags !== null) {
        allButtonTags.forEach((buttonElement) => {
            const buttonTitle = buttonElement.getAttribute("value");
            tabInfo.buttonList.push({
                title: (buttonTitle !== null) ? buttonTitle : "",
            });
        });
    }
    sendResponse(tabInfo);
});
