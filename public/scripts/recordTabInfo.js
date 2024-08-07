"use strict";
document.body.style.border = "5px solid red";
browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
    const tabInfo = {
        linkList: Array(0),
        buttonList: Array(0)
    };
    if (message.command !== "getTabInfo") {
        sendResponse(tabInfo);
        return;
    }
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
    sendResponse(tabInfo);
});
