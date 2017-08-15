/// Service for export passwords
const passEntry = require('../models/passentry').PassEntry;
const json2csv = require('json2csv');
const log = require('../libs/log.js')(module);
const path = require('path');
const fs = require('fs');
const PUBLICFS_PATH = path.resolve('./public');
const xmlbuilder = require('xmlbuilder');

async function ExportToCSV(user) {
    let filestr = '';
    let fields = ['user', 'title', 'password'];
    let passEntryList;
    if (user.id === undefined) return filestr;
    try {
        passEntryList = await passEntry.findAll({ attributes: fields, where: { userID: user.id } });
    } catch (err) {
        log.error('Error on getting passentries list: %s', res.statusCode, err.message);
        return filestr;
    }
    let csv = json2csv({ data: passEntryList, fields: fields, del: ';' });
    filestr = path.join(PUBLICFS_PATH, user.username + '.csv');
    console.log(csv);
    fs.writeFile(filestr, csv, function(err) {
        if (err) throw err;
    });
    return filestr;
}

async function ExportToXML(user) {
    let filestr = '';
    let fields = ['user', 'title', 'password'];
    let passEntryList;
    if (user.id === undefined) return filestr;
    try {
        passEntryList = await passEntry.findAll({ attributes: fields, where: { userID: user.id } });
    } catch (err) {
        log.error('Error on getting passentries list: %s', res.statusCode, err.message);
        return filestr;
    }
    filestr = path.join(PUBLICFS_PATH, user.username + '.xml');
    let root = xmlbuilder.create('root');
    for (let passentry of passEntryList){
        console.log(passentry.user);
        let item = root.ele('passentry');
        item.att('user', passentry.user);
        item.att('title', passentry.title);
        item.att('password', passentry.password);
    }
    fs.writeFile(filestr, root.end(), function(err) {
        if (err) throw err;
    });
    return filestr;
}

module.exports.ExportToCSV = ExportToCSV;
module.exports.ExportToXML = ExportToXML;