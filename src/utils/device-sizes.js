const size = {
    mobileS: '0px',
    mobileM: '375px',
    mobileL: '425px',
    tablet: '768px',
    tableL: '1024px',
    laptop: '1200px',
    laptopL: '1440px',
    desktop: '1440px',
    desktopM: '1920px',
    desktopL: '2560px'
}

export const device = {
    mobileS: `(min-width: ${size.mobileS})`,
    mobileM: `(min-width: ${size.mobileM})`,
    mobileL: `(min-width: ${size.mobileL})`,
    tablet: `(min-width: ${size.tablet})`,
    tableL: `(min-width: ${size.tableL})`,
    laptop: `(min-width: ${size.laptop})`,
    laptopL: `(min-width: ${size.laptopL})`,
    desktop: `(min-width: ${size.desktop})`,
    desktopM: `(min-width: ${size.desktopM})`,
    desktopL: `(min-width: ${size.desktopL})`,
}