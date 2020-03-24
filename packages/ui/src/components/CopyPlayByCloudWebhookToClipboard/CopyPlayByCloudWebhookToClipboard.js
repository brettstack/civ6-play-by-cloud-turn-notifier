import React, { useRef, useState } from 'react';
import clsx from 'clsx'
import {
  Grid,
  TextField,
  Fab,
} from '@material-ui/core';
import { green } from '@material-ui/core/colors'
import { FileCopy as FileCopyIcon, Check as CheckIcon } from '@material-ui/icons';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles({
  root: {
  },
  buttonSuccess: {
    backgroundColor: green[500],
    '&:hover': {
      backgroundColor: green[700],
    },
  }
});
export default function CopyPlayByCloudWebhookToClipboard({ playByCloudWebhookUrl }) {
  const classes = useStyles();
  const [copied, setCopied] = useState(false);
  const timer = React.useRef();
  const textAreaRef = useRef(null);
  const buttonClassname = clsx({
    [classes.buttonSuccess]: copied,
  });

  React.useEffect(() => {
    return () => {
      clearTimeout(timer.current);
    };
  }, []);

  const copyToClipboard = (e) => {
    console.log(textAreaRef.current)
    textAreaRef.current.select();
    document.execCommand('copy');
    e.target.focus();
    setCopied(true);
    timer.current = setTimeout(() => {
      setCopied(false);
    }, 1000);
  };

  return (
    <Grid
      container
      spacing={1}
      justify="center"
      align="center"
    >
      <Grid item xs={11}>
        <TextField
          label="Play by Cloud Webhook URL"
          name="playByCloudWebhookUrl"
          fullWidth
          defaultValue={playByCloudWebhookUrl}
          disabled
          inputRef={textAreaRef}
        />
      </Grid>
      <Grid item xs={1}>
        {
          /* Logical shortcut for only displaying the 
             button if the copy command exists */
          document.queryCommandSupported('copy') &&
          <div>
            <Fab
              aria-label="save"
              color="primary"
              className={buttonClassname}
              onClick={copyToClipboard}
            >
              {copied ? <CheckIcon /> : <FileCopyIcon />}
            </Fab>
          </div>
        }
      </Grid>
    </Grid>
  );
}