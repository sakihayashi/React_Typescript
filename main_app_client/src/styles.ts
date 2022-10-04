import { Box } from '@mui/material';
import { styled } from '@mui/material/styles';

export const MainBody = styled(Box)(({theme}) => ({
  paddingRight: 24,
  paddingLeft: 24,
  paddingTop: 24,
  backgroundColor: theme.palette.background.paper,
  marginTop: 16,
  minHeight: '100%',
  height: 'auto',
  [theme.breakpoints.up('md')]: {
    marginTop: 24,
  },
}));

// .oto-loading {
//   &__loader {
//     position: absolute;
//     top: 50%;
//     left: 50%;
//     -webkit-transform: translate(-50%, -50%);
//     transform: translate(-50%, -50%);
//     color: #fff;
//     text-indent: -9999em;

//     @include oto-respond-to("large") {
//       font-size: 34px;
//     }

//     &,
//     &::after,
//     &::before {
//       width: 1em;
//       height: 4em;
//       -webkit-animation: load1 1s infinite ease-in-out;
//       animation: load1 1s infinite ease-in-out;
//       background: #fff;
//     }

//     &::after,
//     &::before {
//       position: absolute;
//       top: 0;
//       content: "";
//     }

//     &::before {
//       left: -1.5em;
//       -webkit-animation-delay: -0.16s;
//       animation-delay: -0.16s;
//     }

//     &::after {
//       left: 1.5em;
//       -webkit-animation-delay: 0.16s;
//       animation-delay: 0.16s;
//     }

//     &--secondary {
//       color: $oto-color-primary;

//       &,
//       &::after,
//       &::before {
//         background: $oto-color-primary;
//       }
//     }
//   }

//   &__screen {
//     position: absolute;
//     top: 0;
//     left: 0;
//     width: 100%;
//     height: 100%;
//     background-color: black;
//     opacity: 45%;
//   }

//   &__component {
//     position: absolute;
//     left: 0;
//     width: 100%;
//     opacity: 35%;

//     .oto-loading__loader {
//       top: 3em;
//       -webkit-transform: translate(-50%, 0);
//       transform: translate(-50%, 0);
//     }
//   }
// }

// @keyframes load1 {
//   0%,
//   80%,
//   100% {
//     height: 4em;
//     box-shadow: 0 0;
//   }

//   40% {
//     height: 5em;
//     box-shadow: 0 -2em;
//   }
// }
