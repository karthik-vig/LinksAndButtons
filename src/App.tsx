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
  linkList: LinkListType,
  buttonList: ButtonListType
};

function getTabInfo(
  setLinkList: unknown,
  setButtonList: unknown
) {
  browser.tabs
  .query({active: true, currentWindow: true})
  .then((tabs: unknown) => {
    if (Array.isArray(tabs) && 
        tabs !== null &&
        "id" in tabs[0]) {
          browser.tabs
          .sendMessage(tabs[0].id, {
            command: "getTabInfo"
          }).then(({ 
            linkList,
            buttonList
          } : TabInfoType) => {
            if (typeof setLinkList === "function") setLinkList(linkList);
            if (typeof setButtonList === "function") setButtonList(buttonList);
          })
        }
  })
}

function handleError(error: Error) {
  console.log(error.message);
}

function scriptSetup(
  setLinkList: unknown,
  setButtonList: unknown
) {
  browser.tabs
  .executeScript({ file: "../../scripts/recordTabInfo.js"})
  .then(() => getTabInfo(
    setLinkList,
    setButtonList
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
      return (
        <ListItem disablePadding>
        <ListItemButton
          onClick={() => openNewTab(value.link)}
        >
          <ListItemIcon>
            <OpenInNewOutlinedIcon />
          </ListItemIcon>
          <ListItemText primary={value.title} />
        </ListItemButton>
      </ListItem>
      );
    })}
    </List>
  );
}

function ListOfButtons(buttonList: ButtonListType) {

  return (
    <List>
      {buttonList.map((value: ButtonType) => {
              return (
                <ListItem disablePadding>
                <ListItemButton>
                  <ListItemIcon>
                    <HighlightAltOutlinedIcon />
                  </ListItemIcon>
                  <ListItemText primary={value.title} />
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
  const [linkList, setLinkList] = useImmer(Array<LinkType>(0));
  const [buttonList, setButtonList] = useImmer(Array<ButtonType>(0));

  useEffect(() => {
    scriptSetup(setLinkList, setButtonList);
  }, [
    setLinkList,
    setButtonList
  ]);
  
  let DisplayList: JSX.Element = (<List></List>);
  if (displayListToggle === "links") {
    DisplayList = ListOfLinks(linkList);
  } else if (displayListToggle === "buttons") {
    DisplayList = ListOfButtons(buttonList);
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