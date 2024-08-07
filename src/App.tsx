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
  ListItemText
} from '@mui/material';
import InboxIcon from '@mui/icons-material/Inbox';

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

export default function App() {
  const [firstListDisplay, setFirstListDisplay] = useState("block");
  const [secondListDisplay, setSecondListDisplay] = useState("hidden");
  const [linkList, setLinkList] = useImmer(Array<LinkType>(0));
  const [buttonList, setButtonList] = useImmer(Array<ButtonType>(0));

  useEffect(() => {
    scriptSetup(setLinkList, setButtonList);
  }, [
    setLinkList,
    setButtonList
  ]);
  /*
  const tempArr: string[] = Array(100).fill(0).map((value: number)=>{
    return "number " + value;
  });
  const tempArr2: string[] = Array(100).fill(1).map((value: number)=>{
    return "number " + value;
  });
  */
  return (
    <Box
      sx={{
        height: "100%",
        widht: "100%"
      }}
    >
      <Stack 
        spacing={2}
        direction="column"
      >
        <Stack spacing={2} direction="row">
          <Button 
            variant="text"
            sx={{
              width: "50%",
            }}
            onClick={() => {setFirstListDisplay("block"); setSecondListDisplay("hidden")}}
          >
            Links
          </Button>
          <Button 
            variant="text"
            sx={{
              width: "50%",
            }}
            onClick={() => {setFirstListDisplay("hidden"); setSecondListDisplay("block")}}
          >
            Buttons
          </Button>
        </Stack>
        <Stack 
          spacing={2} 
          direction="column" 
          overflow="scroll"
        >
          <List
            sx={{
              display: firstListDisplay,
            }}
          >
            {linkList.map((value: LinkType) => {
              return (
                <ListItem disablePadding>
                <ListItemButton>
                  <ListItemIcon>
                    <InboxIcon />
                  </ListItemIcon>
                  <ListItemText primary={value.title} />
                </ListItemButton>
              </ListItem>
              );
            })}
          </List>
          <List
            sx={{
              display: secondListDisplay,
            }}
          >
            {buttonList.map((value: ButtonType) => {
              return (
                <ListItem disablePadding>
                <ListItemButton>
                  <ListItemIcon>
                    <InboxIcon />
                  </ListItemIcon>
                  <ListItemText primary={value.title} />
                </ListItemButton>
              </ListItem>
              );
            })}
          </List>
        </Stack>
      </Stack>
    </Box>
  );
}