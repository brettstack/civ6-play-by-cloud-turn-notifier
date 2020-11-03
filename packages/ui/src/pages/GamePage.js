import React, { useEffect, useState } from 'react';
import {
  Container,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import CopyPlayByCloudWebhookToClipboard from '../components/CopyPlayByCloudWebhookToClipboard';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const useStyles = makeStyles({
  root: {
    // height: '100vh',
    alignItems: 'center',
    display: 'flex'
  },
  inner: {
    flex: '1'
  }
});

function GamePage() {
  const classes = useStyles()
  const { gameId } = useParams()
  const playByCloudWebhookUrl = `https://api.civ.halfstack.software/webhook?gameId=${gameId}`
  const [game, setGame] = useState({ hits: [] });

  useEffect(() => {
    const f = async () => {
      const { game: g, error } = await getGame({ gameId })

      if (g) {
        setGame(g)
      } else {
        // TODO: display error
        console.log(error)
      }
    }
    f()
  }, [gameId])


  return <Container className={classes.root}>
    <div className={classes.inner}>
      <h1>Civ 6 Play By Cloud</h1>
      <CopyPlayByCloudWebhookToClipboard
        playByCloudWebhookUrl={playByCloudWebhookUrl}
      />
    </div>
  </Container>
}

async function getGame({ gameId }) {
  try {
    const response = await axios.get(`/game/${gameId}`)

    return {
      game: response.data
    }
  } catch (error) {
    const { response } = error

    return {
      error: response.data,
      errorMessage: 'There was an error retreiving the Game. Please ensure the game ID is correct.'
    }
  }
}

export default GamePage