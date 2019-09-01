import * as path from 'path';

const pac = require('../../package.json')


export const name = pac.name

export const icon = path.join(__dirname, '../..', 'icons/16x16.png')