import fs from 'fs'

const readInputFile = (path) => {
    var lines = fs
        .readFileSync(path, 'utf-8')
        .split('\n')
        .filter(Boolean)
        .map((line) => line.split(' ').map((data) => parseInt(data, 10)))

    console.log('\n\nHo letto il file di input con queste lines: \n\n')
    console.log(lines)
    return lines
}

const writeSubmissionFile = (path, content) => {
    console.log('\n\nSto scrivendo il file di submission con il contenuto: \n\n' + content + '\n\n')
    fs.writeFileSync(path, content, { encoding: 'ascii' }) // Controllare l'encoding (default: 'utf-8')
}

export { readInputFile, writeSubmissionFile }
