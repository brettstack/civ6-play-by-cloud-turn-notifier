import React, { useEffect, useState } from 'react'
import {
  Button,
  CircularProgress,
  Container, Grid, TextField,
} from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import { useParams } from 'react-router-dom'
import axios from 'axios'
import CopyPlayByCloudWebhookToClipboard from '../components/CopyPlayByCloudWebhookToClipboard'

const useStyles = makeStyles({
  root: {
    // height: '100vh',
    alignItems: 'center',
    display: 'flex',
  },
  inner: {
    flex: '1',
  },
})

function GamePage() {
  const classes = useStyles()
  const { gameId } = useParams()
  const playByCloudWebhookUrl = `https://api.civ.halfstack.software/webhook?gameId=${gameId}`
  const [game, setGame] = useState({})
  const [errorMessage, setErrorMessage] = React.useState('')
  const [loading, setLoading] = React.useState(false)

  useEffect(() => {
    const f = async () => {
      const { game: g, error } = await getGame({ gameId })

      if (g) {
        setGame(g)
      } else {
        // TODO: display error
        console.error(error)
      }
    }
    f()
  }, [gameId])

  const handleSaveButtonClick = async () => {
    if (!loading) {
      setLoading(true)
      setErrorMessage('')

      try {
        const { game: saveGameGame, errorMessage: saveGameErrorMessage } = await saveGame()
        if (saveGameErrorMessage) {
          setErrorMessage(saveGameErrorMessage)
          setLoading(false)
        } else {
          onSaveGame({ game: saveGameGame })
        }
      } catch (error) {
        setErrorMessage(error.message)
        setLoading(false)
      }
    }
  }
  const playerNameToDiscordIdMappings = Object.entries(game.players || {})
  // Create an array of length 10 for rendering 10 times
  while (playerNameToDiscordIdMappings.length < 10) {
    playerNameToDiscordIdMappings.push([null, {}])
  }

  return (
    <Container className={classes.root}>
      <div className={classes.inner}>
        <h1>Civ 6 Play By Cloud</h1>
        <h2>
          Game
          {' '}
          {gameId}
        </h2>
        <CopyPlayByCloudWebhookToClipboard
          playByCloudWebhookUrl={playByCloudWebhookUrl}
        />
        <h2>Player mappings</h2>
        <p>
          To @ mention a player when it's their turn, create a mapping below of the player's name in Civ to the player's Discord user id.
          {' '}
          You can get a player's discord user id by typing "\@their_username" into the Discord channel. For example, "\@Brett".
        </p>
        <Grid
          container
          spacing={1}
          justify="center"
          align="center"
        >
          {playerNameToDiscordIdMappings.map(([playerName, player], key) => (
            <PlayerNameToDiscordIdMapping
              key={key} // eslint-disable-line react/no-array-index-key
              playerName={playerName}
              player={player}
            />
          ))}
        </Grid>

        <Button
          variant="contained"
          color="primary"
          disabled={loading}
          onClick={handleSaveButtonClick}
          type="submit"
        >
          {loading && <CircularProgress size={24} className={classes.buttonProgress} />}
          Save
        </Button>
      </div>
    </Container>
  )
}

function PlayerNameToDiscordIdMapping({ playerName, player }) {
  return (
    <>
      <Grid item xs={6}>
        <TextField
          label="Player name"
          name="playerName"
          fullWidth
          defaultValue={playerName}
        />
      </Grid>
      <Grid item xs={6}>
        <TextField
          label="Discord user ID"
          name="discordUserId"
          fullWidth
          defaultValue={player.discordUserId}
        />
      </Grid>
    </>
  )
}

async function getGame({ gameId }) {
  try {
    const response = await axios.get(`/game/${gameId}`)

    return {
      game: response.data,
    }
  } catch (error) {
    const { response } = error

    return {
      error: response.data,
      errorMessage: 'There was an error retreiving the Game. Please ensure the game ID is correct.',
    }
  }
}

async function saveGame() {
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

function onSaveGame() {}

export default GamePage
