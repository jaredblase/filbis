import { createGlobalStyle } from 'styled-components';
import { device } from '../utils/device-sizes';
import { theme } from '../utils/theme';
import GoogleSansDisplay from '../fonts/Google Sans/GoogleSansDisplay.ttf';
import GoogleSansText from '../fonts/Google Sans/GoogleSansText.ttf';
import GoogleSans from '../fonts/Google Sans/GoogleSans.ttf';
import Shrikhand from '../fonts/Shrikhand/Shrikhand-Regular.ttf';
import Ultra from '../fonts/Ultra/Ultra-Regular.ttf';

export const GlobalStyle = createGlobalStyle`
    * {
        margin: 0px;
        padding: 0px;
        box-sizing: border-box;
    }

    h1, h2 {
        font-family: ${theme.fontStyles.Google.display};
        letter-spacing: 1%;
        line-height: 86%;
        color: ${theme.colors.white};
    }

    h1 {
        font-size: ${theme.fontSizes.desktop.h1};

        @media ${device.laptop} {
            font-size: ${theme.fontSizes.desktop.h1};
        }
    }

    h2 {
        font-size: ${theme.fontSizes.mobile.h2};

        @media ${device.laptop} {
            font-size: ${theme.fontSizes.desktop.h2};
        }
    }

    body {
        background-color: ${theme.colors.background};
        font-family: ${theme.fontStyles.Google.text};
        font-size: ${theme.fontSizes.mobile.body};
        color: ${theme.colors.white};
        line-height: 150%;

        @media ${device.laptop} {
            font-size: ${theme.fontSizes.desktop.body};
        }
    }

    button {
        font-family: ${theme.fontStyles.Google.text};
        font-size: ${theme.fontSizes.mobile.button};
        color: ${theme.colors.white};
        background-color: ${theme.colors.blue};
        border: none;
        border-radius: 5px;
        padding: 10px 20px;
        cursor: pointer;
    }

    a {
        text-decoration: none;
    }

    @font-face {
        font-family: 'Google Sans Display';
        src: url(${GoogleSansDisplay}) format('truetype');
        font-weight: 500;
        font-style: normal;
    }

    @font-face {
        font-family: 'Google Sans Text';
        src: url(${GoogleSansText}) format('truetype');
        font-weight: 400;
        font-style: normal;
    }

    @font-face {
        font-family: 'Google Sans';
        src: url(${GoogleSans}) format('truetype');
        font-weight: 300;
        font-style: normal;
    }

    @font-face {
        font-family: 'Shrikhand';
        src: url(${Shrikhand}) format('truetype');
        font-weight: 300;
        font-style: normal;
    }

    @font-face {
        font-family: 'Ultra';
        src: url(${Ultra}) format('truetype');
        font-weight: 300;
        font-style: normal;
    }
`;
