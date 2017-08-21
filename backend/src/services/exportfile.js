/// Service for export passwords
const passEntry = require('../models/passentry').PassEntry;
const json2csv = require('json2csv');
const log = require('../libs/log.js')(module);
const path = require('path');
const fse = require('fs-extra');
const PUBLICFS_PATH = path.resolve('./public');
const xmlbuilder = require('xmlbuilder');

async function ExportToCSV(user) {
    const fields = ['user', 'title', 'password'];
    const passEntryList = await passEntry.findAll({ attributes: fields, where: { userID: user.id } });
    const csv = json2csv({ data: passEntryList, fields: fields, del: ';' });
    const filestr = path.join(PUBLICFS_PATH, user.username + '.csv');
    log.debug(filestr);
    await ensureDirectoryExistence(filestr);
    await fse.writeFile(filestr, csv);
    return filestr;
}

async function ExportToXML(user) {
    const fields = ['user', 'title', 'password'];
    const passEntryList = await passEntry.findAll({ attributes: fields, where: { userID: user.id } });
    const filestr = path.join(PUBLICFS_PATH, user.username + '.xml');
    const root = xmlbuilder.create('root');
    for (const passentry of passEntryList) {
        log.debug(passentry.user);
        const item = root.ele('passentry');
        item.att('user', passentry.user);
        item.att('title', passentry.title);
        item.att('password', passentry.password);
    }
    log.debug(filestr);
    await ensureDirectoryExistence(filestr);
    await fse.writeFile(filestr, root.end());
    return filestr;
}

async function ensureDirectoryExistence(filePath) {
    log.debug("here we are");
    const dirname = path.dirname(filePath);
    let res = await fse.exists(dirname);
    log.debug('res', res, dirname);
    if (res) {
        return true;
    }
    await ensureDirectoryExistence(dirname);
    log.debug("creating dir", dirname);
    return fse.mkdir(dirname);
}

module.exports.ExportToCSV = ExportToCSV;
module.exports.ExportToXML = ExportToXML;
