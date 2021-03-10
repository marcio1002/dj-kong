import Discord from 'discord.js'
import fs from 'fs'
import path from 'path'

const collection = new Discord.Collection()
const pathAbsolute = path.resolve("./")


const commands = {
    async getCommands(dirName) {
        fs
            .readdirSync(`${pathAbsolute}${dirName}`, { encoding: 'utf8' })
            .filter(f => !f.startsWith("commands"))
            .forEach(file => {
                if (fs.statSync(`${pathAbsolute}${dirName}/${file}`).isDirectory() && !['.', '..'].includes(file))
                    this.getCommands(`${dirName}/${file}`)
                else {
                    import(`${pathAbsolute}${dirName}/${file}`)
                        .then( command  => {
                            command = command.default ?? command
                            if (Array(command).every(v => v.name && v.description && typeof v?.execute == "function"))
                                collection.set(command.name, command)
                        })
                        .catch(e => console.error(`ERROR: ${e}`))
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

export default commands