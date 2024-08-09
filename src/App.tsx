import { useEffect, useState } from 'react';
import { useImmer } from 'use-immer';
import { 
  Box,
  Button, 
  Stack, 
  List, 
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import OpenInNewOutlinedIcon from '@mui/icons-material/OpenInNewOutlined';
import HighlightAltOutlinedIcon from '@mui/icons-material/HighlightAltOutlined';

type LinkType = {title: string, link: string};
type ButtonType = {title: string};
type LinkListType = Array<LinkType>;
type ButtonListType = Array<ButtonType>;
type TabInfoType = {
  tabID: number | null,
  linkList: LinkListType,
  buttonList: ButtonListType
};

function getTabInfo(
  setTabInfoList: unknown
) {
  browser.tabs
  .query({active: true, currentWindow: true})
  .then((tabs: unknown) => {
    if (Array.isArray(tabs) && 
        tabs !== null &&
        "id" in tabs[0]) {
          browser.tabs
          .sendMessage(tabs[0].id, {
            command: "getTabInfo",
            tabID: tabs[0].id
          }).then((tabInfoList : TabInfoType) => {
            if (typeof setTabInfoList !== "function") return;
            setTabInfoList(tabInfoList);
          })
        }
  })
}

function handleError(error: Error) {
  console.log(error.message);
}

function scriptSetup(
 setTabInfoList: unknown
) {
  browser.tabs
  .executeScript({ file: "../../scripts/recordTabInfo.js"})
  .then(() => getTabInfo(
    setTabInfoList
  ))
  .catch(handleError);
}

function ListOfLinks(linkList: LinkListType) {

  const openNewTab = (href: string) => {
    browser.tabs.create({url: href});
  };

  return (
    <List>
      {linkList.map((value: LinkType) => {
        let titleColor: string = "black";
        let title: string = value.title;
        if (value.title === "") {
          title = "<|NO TITLE|>";
          titleColor = "orange";
        }
      return (
        <ListItem disablePadding>
        <ListItemButton
          onClick={() => openNewTab(value.link)}
        >
          <ListItemIcon>
            <OpenInNewOutlinedIcon />
          </ListItemIcon>
          <ListItemText 
            primary={title} 
            sx={{
              color: titleColor,
            }}
          />
        </ListItemButton>
      </ListItem>
      );
    })}
    </List>
  );
}

function ListOfButtons(buttonList: ButtonListType, tabID: number | null) {

  // TODO: function to send the command to the script on tab page
  const focusOnButtonElement = (index: number) => {
    if (tabID === null) return;
    browser.tabs.sendMessage(tabID, {
      tabID: tabID,
      command: "buttonFocus",
      index: index
    });
  }; 
  return (
    <List>
      {buttonList.map((value: ButtonType, index: number) => {
              let titleColor: string = "black";
              let title: string = value.title;
              if (value.title === "") {
                title = "<|NO TITLE|>";
                titleColor = "orange";
              }
              return (
                <ListItem disablePadding>
                <ListItemButton
                  onClick={() => focusOnButtonElement(index)}
                >
                  <ListItemIcon>
                    <HighlightAltOutlinedIcon />
                  </ListItemIcon>
                  <ListItemText 
                    primary={title} 
                    sx={{
                      color: titleColor,
                    }}
                  />
                </ListItemButton>
              </ListItem>
              );
            })}
    </List>
  );
}

function ControlButtons(
  setDisplayListToggle: React.Dispatch<React.SetStateAction<string>>
) {
  return (
    <Box
        sx={{
          width: "100%"
        }}
      >
        <Stack spacing={2} direction="row">
          <Button
            variant="text"
            sx={{
              width: "50%",
            }}
            onClick={() => {setDisplayListToggle("links")}}
          >
            Links
          </Button>
          <Button 
            variant="text"
            sx={{
              width: "50%",
            }}
            onClick={() => {setDisplayListToggle("buttons")}}
          >
            Buttons
          </Button>
        </Stack>
      </Box>
  );
}

function ContentList(DisplayList: JSX.Element) {
  return (
    <Box
        sx={{
          width: "100%",
          overflox: "scroll"
        }}
      >
          {DisplayList}
      </Box>
  );
}

export default function App() {
  const [displayListToggle, setDisplayListToggle] = useState("links");
  const [tabInfoList, setTabInfoList] = useImmer<TabInfoType>({
    tabID: null,
    linkList: Array<LinkType>(),
    buttonList: Array<ButtonType>()
  });
  //const [linkList, setLinkList] = useImmer(Array<LinkType>(0));
  //const [buttonList, setButtonList] = useImmer(Array<ButtonType>(0));

  useEffect(() => {
    scriptSetup(setTabInfoList);
  }, [
    setTabInfoList,
  ]);
  
  let DisplayList: JSX.Element = (<List></List>);
  if (displayListToggle === "links") {
    DisplayList = ListOfLinks(tabInfoList.linkList);
  } else if (displayListToggle === "buttons") {
    DisplayList = ListOfButtons(tabInfoList.buttonList, tabInfoList.tabID);
  }

  return (
    <Box
      sx={{
        height: "100%",
        widht: "100%"
      }}
    >
      {ControlButtons(setDisplayListToggle)}
      {ContentList(DisplayList)}
    </Box>
  );
}