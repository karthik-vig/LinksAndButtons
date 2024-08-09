
//document.body.style.border = "5px solid purple";
// define all the types that will be mainly used in this file
type MessageType = {
    tabID: number;
    command: "getTabInfo";
};
type FocusButtonMessageType = {
    tabID: number;
    command: "buttonFocus";
    index: number;
}
type LinkType = {
    title: string,
    link: string
};
type ButtonType = {
    title: string
};
type LinkListType = Array<LinkType>;
type ButtonListType = Array<ButtonType>;
type TabInfoType = {
  tabID: number | null,
  linkList: LinkListType,
  buttonList: ButtonListType
};
/* when the extension requests for the information,
    returieve and send it back
*/
browser.runtime.onMessage
.addListener((
    message: MessageType, 
    sender: unknown, 
    sendResponse: (value: TabInfoType) => void
) => {
    // the data structure to hold the anchor and button information
    const tabInfo: TabInfoType = {
        tabID: null,
        linkList: Array<LinkType>(0),
        buttonList: Array<ButtonType>(0)
    }
    const linkQuerySelector: string = `a`;
    const buttonQuerySelector: string = `button, input[type="button"], input[type="submit"], input[type="reset"]`;
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
    const addLinkInfoToTabInfo = (linkElement: Element) => {
        const linkTitle: string = (linkElement.textContent !== null)? linkElement.textContent: "";
        const linkHref: string | null = linkElement.getAttribute("href")
        tabInfo.linkList.push({
            title: linkTitle,
            link: linkHref !== null? linkHref : "",
        });
    }
    const allLinkTags: NodeListOf<HTMLElement> = document.querySelectorAll(linkQuerySelector) as NodeListOf<HTMLElement>;
    allLinkTags.forEach(addLinkInfoToTabInfo); 

    // get all input of button type and append it to tabinfo for button
    const addButtonInfoToTabInfo = (buttonElement: Element) => {
        const buttonTitle: string |null = buttonElement.getAttribute("value");
        tabInfo.buttonList.push({
            title: (buttonTitle !== null)? buttonTitle: "",
        });
    }
    const allButtonInputTags: NodeListOf<HTMLElement> = document.querySelectorAll(buttonQuerySelector) as NodeListOf<HTMLElement>;
    allButtonInputTags.forEach(addButtonInfoToTabInfo); 
    console.log(`getTabInfo: The length of buttons element node list for light DOM: ${tabInfo.buttonList.length}`)

    // try to find shadow DOM and get link and button elements in them
    document.querySelectorAll(`*`).forEach((element) => {
        if (!element.shadowRoot) return;
        // query for link and button under shadow DOM
        const shadowDOMLinks: NodeListOf<HTMLElement> = element.shadowRoot.querySelectorAll(linkQuerySelector) as NodeListOf<HTMLElement>;
        shadowDOMLinks.forEach(addLinkInfoToTabInfo);
        const shadowDOMButtons: NodeListOf<HTMLElement> = element.shadowRoot.querySelectorAll(buttonQuerySelector) as NodeListOf<HTMLElement>;
        shadowDOMButtons.forEach(addButtonInfoToTabInfo);
    });
    console.log(`getTabInfo: The length of all button elements including the shadow dom: ${tabInfo.buttonList.length}`)

    // send the final response back to the extension

    sendResponse(tabInfo);
});

/*
    To handle command from the extension to focus on a 
    particular button. This function adds a border around the
    button to be focused on and then focuses on the button.
*/
browser.runtime.onMessage.addListener( (
    message: FocusButtonMessageType,
) => {
    if (message.command !== "buttonFocus") {
        return;
    }
    const buttonQuerySelector: string = `button, input[type="button"], input[type="submit"], input[type="reset"]`;

    // get the button element
    const allLightDOMButtonInputTags: NodeListOf<HTMLElement> = document.querySelectorAll(buttonQuerySelector) as NodeListOf<HTMLElement>;
    const allButtonInputTags: HTMLElement[] = [...allLightDOMButtonInputTags];
    //get all the shadow DOM elements
    document.querySelectorAll(`*`).forEach((element) => {
        if (!element.shadowRoot) return;
        const allShadowDOMButtonInputTags: NodeListOf<HTMLElement> = element.shadowRoot.querySelectorAll(buttonQuerySelector) as NodeListOf<HTMLElement>;
        allButtonInputTags.concat([...allShadowDOMButtonInputTags]);
    });
    
    console.log(`buttonFocus: The length of node list of light dom button elements: ${allButtonInputTags.length}`);

    // reset all borders we have added using the css class
    allButtonInputTags.forEach((buttonElement) => {
        buttonElement.classList.remove("LinkAndButtonExtensionfocusedButtonBorder");
    });

    // get the element to be modified
    const selectedButton: HTMLElement = allButtonInputTags[message.index] as HTMLElement;
    
    // add border to the button we want to focus on by adding a css class
    selectedButton.classList.add("LinkAndButtonExtensionfocusedButtonBorder");
    
    // focus on the button element
    selectedButton.focus();                                                                                                                                                                                                                                                                                                                                 
}); 