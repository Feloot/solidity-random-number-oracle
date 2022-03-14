const cmdArgs = process.argv.slice(2)

let parsedArgs : {[key: string] : string} = {}
for (let i = 0; i < cmdArgs.length; i++) {
  if (cmdArgs[i].startsWith('--'))
    parsedArgs[cmdArgs[i].substring(2)] = cmdArgs[i + 1]
}

export const args = parsedArgs