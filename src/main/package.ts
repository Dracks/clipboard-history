import * as path from 'path';

const pac = require('../../package.json')


export const name = pac.name

export const icon = path.join(__dirname, '../..', 'icons/1024x1024.png')