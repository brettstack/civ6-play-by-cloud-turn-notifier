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
    setPlayByCloudWebhookUrl(`https://api.civ.halfstack.software/webhook/${game.id}`)
  }

  return (
    <Container className={classes.root}>
      <div className={classes.inner}>
        {playByCloudWebhookUrl
          ? <CopyPlayByCloudWebhookToClipboard playByCloudWebhookUrl={playByCloudWebhookUrl} />
          : <GeneratePlayByCloudWebhook onCreateGame={onCreateGame} />}
      </div>
    </Container>
  );
}

export default App;
