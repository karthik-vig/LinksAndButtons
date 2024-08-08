"use strict";
document.body.style.border = "5px solid purple";
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
            const buttonTitle = (buttonElement.textContent !== null) ? buttonElement.textContent : "";
            tabInfo.buttonList.push({
                title: buttonTitle,
            });
        });
    }
    /*
    tabInfo.linkList = [
        {
            title: "hey 1",
            link: "link 1"
        },
        {
            title: "hey 2",
            link: "link 2"
        }
    ];
    tabInfo.buttonList = [
        {
            title: "btn 1"
        },
        {
            title: "btn 2"
        }
    ];
    */
    sendResponse(tabInfo);
});
