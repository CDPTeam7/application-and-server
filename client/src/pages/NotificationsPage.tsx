import {
  Avatar,
  Button,
  Card,
  CardContent,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Typography,
} from "@mui/material";
import { PageContainer } from "../components/common/PageContainer";
import React from "react";
import FolderIcon from "@mui/icons-material/Folder";
import DeleteIcon from "@mui/icons-material/Delete";
import useAuthStore from "../store/AuthStore";
import { Navigate } from "react-router-dom";

export default function NotificationsPage() {
  // LOGIC START
  interface Notification {
    type: TRANSACTION_TYPE;
    arriveDate: Date;
  }

  enum TRANSACTION_TYPE {
    NOTI_TRANSACTION_COMPLETE,
    NOTI_TRANSACTION_FAILED,
    NOTI_TRANSACTION_RECOMMEND,
  }

  const notificationData = [{ type: "NOTI_TRANSACTION_COMPLETE" }];

  // demo
  function generate(element: React.ReactElement) {
    return [0, 1, 2,3,4,5,6,7,8,9,10,11,12,].map((value) =>
      React.cloneElement(element, {
        key: value,
      })
    );
  }
  const [dense, setDense] = React.useState(false);

  // LOGIC END

  const auth = useAuthStore((state) => state.isLoggedIn);

  if (!auth) return <Navigate to="/login" />;
  return (
    <PageContainer>
      <Card
        sx={{
          "& > :not(style)": {p:1}
        }}
        variant="elevation"
      >
        <CardContent>
          <Typography variant="h5" sx={{m:"16px"}}>알림</Typography>
          <List dense={dense}>
            <ListItem
              secondaryAction={
                  <Button sx={{p:0}}>
                    전부 삭제하기
                  </Button>
                }>
            </ListItem>
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
                <ListItemText
                  primary="Single-line item"
                  secondary={"Secondary text"}
                />
              </ListItem>
            )}
          </List>
        </CardContent>
      </Card>
    </PageContainer>
  );
}
