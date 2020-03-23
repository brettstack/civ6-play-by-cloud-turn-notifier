import React from 'react';
import {
  Grid,
  TextField,
  Button,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles({
  root: {
    // height: '100vh'
  },
});

export default function GeneratePlayByCloudWebhook() {
  const classes = useStyles()
  return (
    <form
      noValidate
      autoComplete="off"
      className={`GeneratePlayByCloudWebhook ${classes.root}`}
    >
      <Grid
        container
        spacing={1}
        justify="center"
        align="center"
      >
        <Grid item xs={12}>
          <TextField
            label="Discord Webhook URL"
            name="discordWebhookUrl"
            required
            fullWidth
            InputLabelProps={{
              required: false,
              shrink: true,
            }}
            InputProps={{
              autoFocus: true,
            }}
          />
        </Grid>
        <Grid item xs={12} align="right">
          <Button variant="contained" color="primary">
            Generate Civ Play By Cloud Webhook
      </Button>
        </Grid>
      </Grid>
    </form>)
}