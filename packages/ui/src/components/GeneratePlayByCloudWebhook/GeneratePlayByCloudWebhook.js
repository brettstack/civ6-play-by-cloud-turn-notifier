import React from 'react'
import axios from 'axios'
import {
  Grid,
  TextField,
  Button,
  CircularProgress,
} from '@material-ui/core'
import { green } from '@material-ui/core/colors'
import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles({
  root: {
  },
  buttonProgress: {
    color: green[500],
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -12,
    marginLeft: -12,
  },
})

async function createGame() {
  const discordWebhookUrl = document.querySelector('[name="discordWebhookUrl"]').value

  try {
    const response = await axios.post('/game', {
      discordWebhookUrl,
    })

    return {
      game: response.data,
    }
  } catch (error) {
    const { response } = error
    return {
      error: response.data,
      errorMessage: 'There was an error creating a webhook. Please confirm you entered a URL in the format https://discordapp.com/api/webhooks/123456789/123abc123abc123abc123abc123abc123abc',
    }
  }
}

export default function GeneratePlayByCloudWebhook({ onCreateGame }) {
  const classes = useStyles()
  const [errorMessage, setErrorMessage] = React.useState('')
  const [loading, setLoading] = React.useState(false)

  const handleButtonClick = async () => {
    if (!loading) {
      setLoading(true)
      setErrorMessage('')

      try {
        const { game, errorMessage: createGameErrorMessage } = await createGame()
        if (createGameErrorMessage) {
          setErrorMessage(createGameErrorMessage)
          setLoading(false)
        } else {
          onCreateGame({ game })
        }
      } catch (error) {
        setErrorMessage(error.message)
        setLoading(false)
      }
    }
  }

  return (
    <form
      noValidate
      autoComplete="off"
      className={`GeneratePlayByCloudWebhook ${classes.root}`}
    >
      <p>Generate a Discord Webhook for your channel and copy-paste the Webhook URL to the field below.</p>
      <Grid
        container
        spacing={1}
        justify="center"
        align="center"
      >
        <Grid item xs={12}>
          <TextField
            label="Discord Webhook URL"
            error={Boolean(errorMessage)}
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
              disabled={loading}
              onClick={handleButtonClick}
              type="submit"
            >
              {loading && <CircularProgress size={24} className={classes.buttonProgress} />}
              Generate Civ Play By Cloud Webhook
            </Button>

          </div>
        </Grid>
      </Grid>
    </form>
  )
}
