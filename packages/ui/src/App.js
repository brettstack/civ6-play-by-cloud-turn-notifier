import React from 'react';
import {
  Container,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import GeneratePlayByCloudWebhook from './components/GeneratePlayByCloudWebhook';
import CopyPlayByCloudWebhookToClipboard from './components/CopyPlayByCloudWebhookToClipboard';

const useStyles = makeStyles({
  root: {
    height: '100vh',
    alignItems: 'center',
    display: 'flex'
  },
  inner: {
    flex: '1'
  }
});

function App() {
  const classes = useStyles()
  const [playByCloudWebhookUrl, setPlayByCloudWebhookUrl] = React.useState('');

  const onCreateGame = ({ game }) => {
    setPlayByCloudWebhookUrl(`https://api.civ.halfstack.software/webhook?gameId=${game.id}`)
  }

  return (
    <Container className={classes.root}>
      <div className={classes.inner}>
        {playByCloudWebhookUrl
          ? <CopyPlayByCloudWebhookToClipboard playByCloudWebhookUrl={playByCloudWebhookUrl} />
          : <GeneratePlayByCloudWebhook onCreateGame={onCreateGame} />
        }

        <h2>What is this?</h2>
        <p>Civilization 6 comes with a game mode called Play by Cloud that lets you play with friends without needing to be online at the same time. You simply take your turn when it suits you and the game state is saved to the cloud. This service notifies players who's turn it is via a Discord channel.</p>
        <h2>How does it work?</h2>
        <p>Civilization 6 comes with a Webhook setting. When you set this, the game will send a request to that Webhook with information on the Game Name, the Turn Number, and the name of the player whose turn it is. This service takes that data and transforms it into something Discord can understand, and then forwards the request to the Discord Webhook you provide.</p>

      </div>
    </Container>
  );
}

export default App;
