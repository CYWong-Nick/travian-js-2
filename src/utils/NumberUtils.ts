export const cleanParseInt = (s: string): number =>
    parseInt(s.replace('−', '-').replaceAll(/[^0-9+-]/g, ''))

export const cleanParseFloat = (s: string): number =>
    parseInt(s.replace('−', '-').replaceAll(/[^0-9.+-]/g, ''))

export const randomInteger = (min: number, max: number): number =>
    Math.floor(Math.random() * (max - min + 1) + min)

export const randomFloat = (min: number, max: number): number =>
    Math.random() * (max - min) + min
