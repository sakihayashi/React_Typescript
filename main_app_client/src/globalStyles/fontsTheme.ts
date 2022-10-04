import { ThemeOptions } from '@mui/material';
import { createTheme } from '@mui/material/styles';
import IBMPlexSansBold from '../assets/IBMPlexSans-Bold.ttf';
import IBMPlexSansMedium from '../assets/IBMPlexSans-Medium.ttf';
import IBMPlexSansRegular from '../assets/IBMPlexSans-Regular.ttf';
import IBMPlexSansSemiBold from '../assets/IBMPlexSans-SemiBold.ttf';
import openSansRegular from '../assets/OpenSans-Regular.ttf';
// qualitycontrol/client/src/assets/IBMPlexSans-SemiBold.ttf

const fontsTheme: ThemeOptions = createTheme({
  components: {
    MuiCssBaseline: {
      styleOverrides: `
      @font-face {
        font-family: 'IBMPlexSans-Regular';
        font-style: normal;
        font-display: swap;
        font-weight: 400;
        src: local('IBMPlexSans-Regular'), local('IBMPlexSans-Regular'), url(${IBMPlexSansRegular}) format('truetype');
        unicodeRange: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF;
      },
      @font-face {
        font-family: 'IBMPlexSans-Medium';
        font-style: normal;
        font-display: swap;
        font-weight: 400;
        src: local('IBMPlexSans-Medium'), local('IBMPlexSans-Medium'), url(${IBMPlexSansMedium}) format('truetype');
        unicodeRange: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF;
      },
      @font-face {
        font-family: 'IBMPlexSans-SemiBold';
        font-style: normal;
        font-display: swap;
        font-weight: 400;
        src: local('IBMPlexSans-SemiBold'), local('IBMPlexSans-SemiBold'), url(${IBMPlexSansSemiBold}) format('truetype');
        unicodeRange: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF;
      },
      @font-face {
        font-family: 'IBMPlexSans-Bold';
        font-style: normal;
        font-display: swap;
        font-weight: 400;
        src: local('IBMPlexSans-SemiBold'), local('IBMPlexSans-SemiBold'), url(${IBMPlexSansBold}) format('truetype');
        unicodeRange: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF;
      },
      @font-face {
        font-family: 'OpenSans-Regular';
        font-style: normal;
        font-display: swap;
        font-weight: 400;
        src: local('OpenSans-Regular'), url(${openSansRegular}) format('truetype');
        unicodeRange: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF;
      }
    `,
    },
  },
});

export default fontsTheme;
