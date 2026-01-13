export interface Theme {
    name: string
    mode: 'light' | 'dark'
    text: string
    background: string
    primary: string
    secondary: string
    accent: string
    pairedTheme?: Theme
}

// Dark Themes
export const plumDelight: Theme = {
    name: 'Plum Delight',
    mode: 'dark',
    text: '#ffffff',
    background: '#161616',
    primary: '#c2bbf0',
    secondary: '#5b2980',
    accent: '#b35dcb',
}

export const darkCherry: Theme = {
    name: 'Dark Cherry',
    mode: 'dark',
    text: '#ffffff',
    background: '#161616',
    primary: '#3d0202',
    secondary: '#7e2828',
    accent: '#541818',
}

export const whimsicalSky: Theme = {
    name: 'Whimsical Sky',
    mode: 'dark',
    text: '#ffffff',
    background: '#161616',
    primary: '#9aa1e2',
    secondary: '#262b7a',
    accent: '#595fd4',
}

//Light Themes
export const enchantedForest: Theme = {
    name: 'Enchanted Forest',
    mode: 'light',
    text: '#000000',
    background: '#fffff3',
    primary: '#588157',
    secondary: '#a9c4a8',
    accent: '#8fb78f',
}

export const pastelSkies: Theme = {
    name: 'Pastel Skies',
    mode: 'light',
    text: '#000000',
    background: '#fffff3',
    primary: '#5d71e7',
    secondary: '#919ee6',
    accent: '#6b7acf',
}

export const peachyCoral: Theme = {
    name: 'Peachy Coral',
    mode: 'light',
    text: '#000000',
    background: '#fffff3',
    primary: '#bf4c4f',
    secondary: '#e38383',
    accent: '#b87a7a',
}

plumDelight.pairedTheme = enchantedForest
enchantedForest.pairedTheme = plumDelight

darkCherry.pairedTheme = peachyCoral
peachyCoral.pairedTheme = darkCherry

whimsicalSky.pairedTheme = pastelSkies
pastelSkies.pairedTheme = whimsicalSky


export const allThemes: Theme[] = [
    plumDelight,
    darkCherry,
    whimsicalSky,
    enchantedForest,
    pastelSkies,
    peachyCoral
]