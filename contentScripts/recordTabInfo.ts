
document.body.style.border = "5px solid purple";
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
    const allLinkTags: NodeListOf<Element> | null = document.querySelectorAll("a");
    if (allLinkTags !== null) {
        allLinkTags.forEach((linkElement) => {
            const linkTitle: string = (linkElement.textContent !== null)? linkElement.textContent: "";
            const linkHref: string | null = linkElement.getAttribute("href")
            tabInfo.linkList.push({
                title: linkTitle,
                link: linkHref !== null? linkHref : "",
            });
        }) 
    }
    const allButtonTags: NodeListOf<Element> | null = document.querySelectorAll(`input[type="button"]`);
    if (allButtonTags !== null) {
        allButtonTags.forEach((buttonElement) => {
            const buttonTitle: string = (buttonElement.textContent !== null)? buttonElement.textContent : "";
            tabInfo.buttonList.push({
                title: buttonTitle,
            });
        }) 
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
})