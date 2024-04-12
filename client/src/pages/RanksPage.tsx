import { Button, Card, CardActions, CardContent, Grid, Paper, Typography } from "@mui/material";
import BackgroundOverlay from "../components/NavBar";
import Icon from "../components/common/Icon";

export default function RankPage() {
  return <div>
      <Grid container spacing={2}>
    <Grid item xs={6} md={8}>
      <Paper>xs=6 md=8</Paper>
    </Grid>
    <Grid item xs={6} md={4}>
      <Paper>xs=6 md=4</Paper>
    </Grid>
    <Grid item xs={6} md={4}>
      <Paper>xs=6 md=4</Paper>
    </Grid>
    <Grid item xs={6} md={8}>
      <Paper>xs=6 md=8</Paper>
    </Grid>
  </Grid>
  </div>
}