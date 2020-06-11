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
        <h1>Civ 6 Play By Cloud</h1>
        <p><strong>Civilization 6 Play By Cloud</strong> is a new game mode that allows you to play <strong>Civ 6</strong> games asynchronously with your friends -- you don't need to be online at the same time.</p>
        <p>The <strong>Civ 6 Play By Cloud Webhook URL</strong> setting allows you to receive <strong>notifications</strong> when it's the next player's turn in the <strong>Play by Cloud</strong> game, e.g. you can recieve notifications to your <a href="https://discordapp.com/" target="_blank" rel="noopener noreferrer">Discord</a> channel. However, setting this up requires significant technical knowledge.</p>
        <p>This service makes it easy to configure the <strong>Civ 6 Webhook</strong> to receive notifications to your Discord channel (additional notification methods coming soon) by following these steps:</p>

        <ol>
          <li>Create a Discord Channel with your players and create a new <strong>Webhook</strong> via the <strong>Edit Channel</strong> gear icon.</li>
          <li>Copy-Paste the Discord <strong>Webhook URL</strong> (it looks like <em>https://discordapp.com/api/webhooks/720506520748507765/xOclopi_4LQN1aSajr_UrWpCxwo2_sYdVSYozn4Xg5nPDMSbms_Et6pRRMfYCeIAKeug</em>) into the field below and click the <strong>Generate Civ Play By Cloud Webhook</strong> button.</li>
          <li>Copy-Paste the newly generated <strong>Webhook URL</strong> (it looks like <em>https://api.civ.halfstack.software/webhook?gameId=x9-cQ8tnu</em>) into the <strong>Play By Cloud Webhook URL</strong> setting in <strong>Game Options</strong> and change the <strong>Frequency</strong> to <strong>Every Turn</strong>.</li>
        </ol>
        {/* <strong>Civ 6 Play By Cloud Webhook</strong> */}
        {playByCloudWebhookUrl
          ? <CopyPlayByCloudWebhookToClipboard playByCloudWebhookUrl={playByCloudWebhookUrl} />
          : <GeneratePlayByCloudWebhook onCreateGame={onCreateGame} />
        }

        <h2>What is this?</h2>
        <p><a href="https://civilization.com/" target="_blank" rel="noopener noreferrer" >Civilization 6</a> comes with a game mode called Play by Cloud that lets you play with friends without needing to be online at the same time. You simply take your turn when it suits you and the game state is saved to the cloud. This service notifies players who's turn it is via a Discord channel.</p>
        <h2>How does it work?</h2>
        <p>Civilization 6 comes with a Webhook setting. When you set this, the game will send a request to that Webhook with information on the Game Name, the Turn Number, and the name of the player whose turn it is. This service takes that data and transforms it into something Discord can understand, and then forwards the request to the Discord Webhook you provide.</p>

      </div>
    </Container>
  );
}

export default App;
