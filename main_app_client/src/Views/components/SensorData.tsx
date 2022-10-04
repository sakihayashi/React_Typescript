import React from 'react';

import FileDownloadIcon from '@mui/icons-material/FileDownload';
import PauseCircleIcon from '@mui/icons-material/PauseCircle';
import PlayCircleIcon from '@mui/icons-material/PlayCircle';
import SkipNextIcon from '@mui/icons-material/SkipNext';
import SkipPreviousIcon from '@mui/icons-material/SkipPrevious';
import { Box, Button, IconButton, Typography } from '@mui/material';
import { Box100, FlexBoxBaseline } from '@otosense/components';
import LocaleStore from '@otosense/locale';
import { AudioChannel, TimeChannel } from '@otosense/multi-time-vis';
import { observer } from 'mobx-react-lite';
import { ReviewSessionsStore } from '../ReviewSessions';

import { useRootContext } from '../../RootStore';
import { intArrayFromBase64 } from '../../Utility/functions';

import { PlaybackContainer, PlaybackRow } from '../ReviewSessions/styles';
import {IResultsData} from '../../api';

import { firstLetterStyle } from 'globalStyles/texts';

const SensorData = () => {
  const root = useRootContext();
  const reviewSessionsStore: ReviewSessionsStore = root.reviewSessionsStore;
  const appState = root.appState;
  const locale: LocaleStore = root.appState.locale;
  const playbackStore = root.playbackStore;
  const base64Data = playbackStore.base64Data;
  const downloadParametersBase64 = playbackStore.downloadParametersBase64;
  const nextPlayback = playbackStore.nextPlayback;
  const prevPlayback = playbackStore.prevPlayback;
  const togglePlayback = playbackStore.togglePlayback;

  const renderTimeChannel: (sensorDataBase64: string[]) => JSX.Element = (
    sensorDataBase64: string[]
  ) => {
    const playbackIndex = playbackStore.playbackIndex;
    const currentChartType = reviewSessionsStore.currentSessionChartType;
    const audioBuffer: Uint8Array = intArrayFromBase64(
      sensorDataBase64[playbackIndex]
    );
    // const audioBuffer: Uint8Array = undefined;

    const audioChannel: AudioChannel = {
      buffer: audioBuffer.buffer,
      chartType: currentChartType,
      normalize: true,
      type: 'audio',
    };
    const sampleRate: number = new Uint32Array(
      audioBuffer.slice(24, 28).buffer
    )[0];
    const sampleWidth: number =
      new Uint16Array(audioBuffer.slice(34, 36).buffer)[0] / 8;

    return (
      <TimeChannel
        channel={audioChannel}
        bt={0}
        tt={(audioBuffer.length / (sampleWidth * sampleRate)) * 1000}
        height={100}
        indicatorX={playbackStore.progressRatio}
        leftX={0}
      />
    );
  };
  if (!base64Data || !base64Data.length) {
    return <div />;
  }

  try {
    const downloadParams = downloadParametersBase64();
    const s: IResultsData = reviewSessionsStore.selectedSessionState;
    const chName: string = reviewSessionsStore.selectedSessionChannelNames[playbackStore.playbackIndex];
    downloadParams.download = `${s.rdy?.value || appState.formatSessionTime(s.bt)}_${chName}.wav`;
    return (
      <>
        <hr/>
        <PlaybackContainer>
          <PlaybackRow>
            {base64Data && base64Data.length > 1 && (
              <IconButton onClick={prevPlayback}>
                <SkipPreviousIcon />
              </IconButton>
            )}
            <IconButton onClick={togglePlayback}>
              {playbackStore.playing ? <PauseCircleIcon /> : <PlayCircleIcon />}
            </IconButton>
            {base64Data && base64Data.length > 1 && (
              <IconButton onClick={nextPlayback}>
                <SkipNextIcon />
              </IconButton>
            )}
            <a {...downloadParams}>
              <IconButton>
                <FileDownloadIcon />
              </IconButton>
            </a>
            <FlexBoxBaseline ml={0.5}>
              <Typography variant="body2" sx={firstLetterStyle} mr={0.25} component="span">
                {locale.getString('global.channel')}
              </Typography>
              :
              <Typography variant="h4" ml={0.5}>{chName}</Typography>
            </FlexBoxBaseline>
          </PlaybackRow>
          <div>
            <Button
              variant={
                reviewSessionsStore.currentSessionChartType === 'peaks'
                  ? 'contained'
                  : 'outlined'
              }
              onClick={() => reviewSessionsStore.setChartType('peaks')}
              sx={{height: 30}}
            >
              <Box sx={firstLetterStyle}>
                {locale.getString('reviewSessions.waveform')}
              </Box>
            </Button>
            <Button
              variant={
                reviewSessionsStore.currentSessionChartType === 'peaks'
                  ? 'outlined'
                  : 'contained'
              }
              sx={{height: 30}}
              onClick={() => reviewSessionsStore.setChartType('spectrogram')}
            >
              <Box sx={firstLetterStyle}>
                {locale.getString('reviewSessions.spectrogram')}
              </Box>
            </Button>
          </div>
        </PlaybackContainer>
        {!!base64Data?.length && renderTimeChannel(base64Data)}
      </>
    );
  } catch (e) {
    console.error('ERROR RENDERING SENSOR DATA');
    console.error(e);
    console.error('sensorDataBase64', base64Data);
    return <div />;
  }
};
export default observer(SensorData);
