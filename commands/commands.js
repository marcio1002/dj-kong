const Discord = require('discord.js')
const collection = new Discord.Collection()
const fs = require('fs')
const path = require("path").dirname(require('path').resolve(__dirname))


module.exports = {
    async getCommands(dirName) {
        fs
            .readdirSync(`${path}${dirName}`, { encoding: 'utf8' })
            .filter(f => !f.startsWith("commands"))
            .forEach(file => {
                if (fs.statSync(`${path}${dirName}/${file}`).isDirectory() && !['.', '..'].includes(file))
                    this.getCommands(`${dirName}/${file}`)
                else {
                    const command = require(`${path}${dirName}/${file}`)
                    if (Array(command).every(v => v.name && v.description && typeof v.execute == "function"))
                        collection.set(command.name, command)
                }

            });
    },

    set() {
        this.getCommands('/commands')
    },

    get: (command, args) => collection.get(command).execute(args),

    has: command => collection.has(command),

    listCommands: () => collection,
}