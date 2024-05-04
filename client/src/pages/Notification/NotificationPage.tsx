import { Avatar, Button, IconButton, List, ListItem, ListItemAvatar, ListItemText } from "@mui/material";

import React from "react";
import FolderIcon from "@mui/icons-material/Folder";
import DeleteIcon from "@mui/icons-material/Delete";

import SubPage from "@/components/SubPage";
import LoginCheckContainer from "@/containers/LoginCheckContainer";

export default function NotificationPage() {
  // demo
  function generate(element: React.ReactElement) {
    return [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((value) =>
      React.cloneElement(element, {
        key: value,
      })
    );
  }

  return (
    <LoginCheckContainer shouldLogin={true}>
      <SubPage title="알림">
        <Button variant="outlined">전부 삭제하기</Button>
        <List>
          {generate(
            <ListItem
              secondaryAction={
                <IconButton edge="end" aria-label="delete">
                  <DeleteIcon />
                </IconButton>
              }
            >
              <ListItemAvatar>
                <Avatar>
                  <FolderIcon />
                </Avatar>
              </ListItemAvatar>
              <ListItemText primary="Single-line item" secondary={"Secondary text"} />
            </ListItem>
          )}
        </List>
      </SubPage>
    </LoginCheckContainer>
  );
}
