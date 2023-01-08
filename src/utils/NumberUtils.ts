export const parseIntIgnoreSep = (s: string): number => {
    return parseInt(s.replace('−', '-').replaceAll(/[^0-9+-]/g, ''))
}

export const parseFloatIgnoreSep = (s: string): number => {
    return parseInt(s.replace('−', '-').replaceAll(/[^0-9.+-]/g, ''))
}

export const randomInterval = (min: number, max: number): number =>
    Math.floor(Math.random() * (max - min + 1) + min)
