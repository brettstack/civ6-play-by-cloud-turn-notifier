import React from 'react'
import clsx from 'clsx'
import axios from 'axios'
import {
  Grid,
  TextField,
  Button,
  CircularProgress,
} from '@material-ui/core';
import { green } from '@material-ui/core/colors'
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles({
  root: {
  },
  buttonSuccess: {
    backgroundColor: green[500],
    '&:hover': {
      backgroundColor: green[700],
    },
  },
  buttonProgress: {
    color: green[500],
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -12,
    marginLeft: -12,
  },
});

async function makeRequest() {
  const discordWebhookUrl = document.querySelector('[name="discordWebhookUrl"]').value
  const response = await axios.post('http://localhost:3000/game', {
    discordWebhookUrl
  })

  return response
}

export default function GeneratePlayByCloudWebhook() {
  const classes = useStyles()
  const [loading, setLoading] = React.useState(false);
  const [success, setSuccess] = React.useState(false);
  const buttonClassname = clsx({
    [classes.buttonSuccess]: success,
  });

  const handleButtonClick = async () => {
    if (!loading) {
      setSuccess(false);
      setLoading(true);

      try {
        await makeRequest()
        setSuccess(true);
      } catch (error) {
        console.log(error)
      } finally {
        setLoading(false);
      }
    }
  };

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
          <div>
            <Button
              variant="contained"
              color="primary"
              className={buttonClassname}
              disabled={loading}
              onClick={handleButtonClick}
            >
              {loading && <CircularProgress size={24} className={classes.buttonProgress} />}
              Generate Civ Play By Cloud Webhook
      </Button>

          </div>
        </Grid>
      </Grid>
    </form>)
}