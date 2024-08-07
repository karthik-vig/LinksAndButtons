
document.body.style.border = "5px solid red";
type MessageType = {
    command: string;
};
type LinkType = {title: string, link: string};
type ButtonType = {title: string};
type LinkListType = Array<LinkType>;
type ButtonListType = Array<ButtonType>;
type TabInfoType = {
  linkList: LinkListType,
  buttonList: ButtonListType
};
browser.runtime.onMessage
.addListener((
    message: MessageType, 
    sender: unknown, 
    sendResponse: (value: TabInfoType) => void
) => {
    const tabInfo: TabInfoType = {
        linkList: Array<LinkType>(0),
        buttonList: Array<ButtonType>(0)
    }
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
})