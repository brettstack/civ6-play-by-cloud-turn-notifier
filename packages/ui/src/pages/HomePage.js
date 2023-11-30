import React from 'react'
import {
  Container, Divider, Link
} from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import { useHistory } from 'react-router-dom'
import GeneratePlayByCloudWebhook from '../components/GeneratePlayByCloudWebhook'

const useStyles = makeStyles({
  root: {
    // height: '100vh',
    alignItems: 'center',
    display: 'flex',
  },
  inner: {
    flex: '1',
  },
  divider: {
    marginTop: '1rem',
  },
})

function HomePage() {
  const classes = useStyles()
  const history = useHistory()

  const onCreateGame = ({ game }) => {
    history.push(`/game/${game.id}`)
  }

  return (
    <Container className={classes.root}>
      <div className={classes.inner}>
        <h1>Civ 6 Play By Cloud</h1>
        <div style={{ background: 'white', color: 'black', padding: '1rem' }}>
          <h2>Made with <a href="https://codegenie.codes">Code Genie</a></h2>
          <p>Starting a new software project? Check out Code Genie - a <a href="https://codegenie.codes">Full Stack App Generator</a> that generates source code based on your project's data model. Including:</p>
          <ol>
            <li>A React Next.js Web App hosted on Amplify Hosting</li>
            <li>Serverless Express REST API running on API Gateway and Lambda</li>
            <li>Cognito User Pools for Identity/Authentication</li>
            <li>DynamoDB Database</li>
            <li>Cloud Development Kit (CDK) for Infrastructure as Code (IAC)</li>
            <li>Continuous Integration/Delivery (CI/CD) with GitHub Actions</li>
            <li>And more!</li>
          </ol>
        </div>
        <p>
          <strong>Civilization 6 Play By Cloud</strong>
          {' '}
          is a new game mode that that lets you play
          {' '}
          <Link href="https://civilization.com/" target="_blank" rel="noopener noreferrer">Civ 6</Link>
          {' '}
          with friends without needing to be online at the same time.
          {' '}
          Simply take your turn when it suits you and the game state is saved to the cloud, ready for the next player.
          {' '}
          Use this service to send messages to your Discord channel to notify players of a new turn.
        </p>

        <GeneratePlayByCloudWebhook onCreateGame={onCreateGame} />

        <Divider className={classes.divider} />
        <h2>What is this?</h2>
        <p>
          The
          {' '}
          <strong>Civ 6 Play By Cloud Webhook URL</strong>
          {' '}
          setting allows you to receive
          {' '}
          <strong>notifications</strong>
          {' '}
          when it's the next player's turn in the
          {' '}
          <strong>Play by Cloud</strong>
          {' '}
          game, e.g. you can recieve notifications to your
          {' '}
          <Link href="https://discordapp.com/" target="_blank" rel="noopener noreferrer">Discord</Link>
          {' '}
          channel. However, setting this up requires significant technical knowledge.
        </p>
        <p>
          This service makes it easy to configure the
          {' '}
          <strong>Civ 6 Webhook</strong>
          {' '}
          to receive notifications to your Discord channel (additional notification methods coming soon).
        </p>

        <h2>Detailed instructions</h2>
        <ol>
          <li>
            Create a Discord Channel with your players and create a new
            {' '}
            <strong>Webhook</strong>
            {' '}
            via the
            {' '}
            <strong>Edit Channel</strong>
            {' '}
            gear icon.
          </li>
          <li>
            Copy-Paste the Discord
            {' '}
            <strong><abbr title="Example: https://discordapp.com/api/webhooks/720506520748507765/xOclopi_4LQN1aSajr_UrWpCxwo2_sYdVSYozn4Xg5nPDMSbms_Et6pRRMfYCeIAKeug">Webhook URL</abbr></strong>
            {' '}
            into the field below and click the
            {' '}
            <strong>Generate Civ Play By Cloud Webhook</strong>
            {' '}
            button.
          </li>
          <li>
            Copy-Paste the newly generated
            {' '}
            <strong><abbr title="Example: https://api.civ.halfstack.software/webhook?gameId=x9-cQ8tnu">Webhook URL</abbr></strong>
            {' '}
            into the
            {' '}
            <strong>Play By Cloud Webhook URL</strong>
            {' '}
            setting in
            {' '}
            <strong>Game Options</strong>
            {' '}
            and change the
            {' '}
            <strong>Frequency</strong>
            {' '}
            to
            {' '}
            <strong>Every Turn</strong>
            .
          </li>
        </ol>

        <h2>How is this different to Steam notifications?</h2>
        <p>
          Steam notifications only let you know when it's
          {' '}
          <em>your</em>
          {' '}
          turn, whereas Discord notifications let
          {' '}
          <em>everyone</em>
          {' '}
          know whose turn it is.
        </p>

        <h2>I'm not getting notifications after setting this up</h2>
        <p>
          Notifications usually only works for new games created
          {' '}
          <strong>after</strong>
          {' '}
          setting the Webhook setting, however, there have been people who say it worked for existing games after several turns.
          {' '}
          You can also save your game and create a new Play By Cloud game based on the save file,
          {' '}
          though it can be quite tricky ensuring all players get their original Civ leader (you need to have players join in the order of their turns).
        </p>
        <p>
          Additionally, Civ 6 on Mac OSX is known to have issues with Webhook, so you may have an even harder time there.
          {' '}
          There are simply certain things that are outside the control of this service.
        </p>

        <h2>How does it work?</h2>
        <p>
          When you configure the
          {' '}
          <strong>Civ 6 Play By Cloud Webhook</strong>
          {' '}
          setting, a request to that Webhook is sent with information on the Game Name, the Turn Number, and the name of the player whose turn it is.
          {' '}
          This service takes that data and transforms it into something Discord can understand, and then forwards the request to the Discord Webhook you provide.
          {' '}
          For a detailed technical writeup, check out this blog post on
          {' '}
          <Link href="https://www.halfstack.software/building-a-civilization-vi-play-by-cloud-webhook-turn-notifier-service/" target="_blank" rel="noopener noreferrer">
            Building a Civilization VI "Play by Cloud" Webhook Turn Notifier Service
          </Link>
        </p>

        <h2>Contact and Feedback</h2>
        <p>
          You can reach out to me on Twitter -
          {' '}
          <Link href="https://twitter.com/AWSbrett">Brett Andrews</Link>
          . Or create an Issue on the
          {' '}
          <Link href="https://github.com/brettstack/civ6-play-by-cloud-turn-notifier" target="_blank" rel="noopener noreferrer">civ6-play-by-cloud-turn-notifier GitHub repo</Link>
        </p>

        <h2>Open Source</h2>
        <p>
          The source code for this project is available on the
          {' '}
          <Link href="https://github.com/brettstack/civ6-play-by-cloud-turn-notifier" target="_blank" rel="noopener noreferrer">GitHub</Link>
        </p>
      </div>
    </Container>
  )
}

export default HomePage
