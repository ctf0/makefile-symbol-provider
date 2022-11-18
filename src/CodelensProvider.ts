import {
    CodeLens,
    CodeLensProvider,
    TextDocument,
    Range,
    Position
} from 'vscode'

export default class lensProvider implements CodeLensProvider {
    async provideCodeLenses(document: TextDocument): Promise<CodeLens[]> {
        let links = []

        for (let line = 0; line < document.lineCount; line++) {
            const { text } = document.lineAt(line)
            let reg = new RegExp(/^(?!\.PHONY)(\S+)(?=( +)?:)/, 'g').exec(text)

            if (reg !== null) {
                let cmnd = reg[0]
                let range = new Range(new Position(line,0), new Position(line,text.length - 1))

                links.push(
                    new CodeLens(range, {
                        command   : 'makefile.run',
                        title     : '$(play) Run',
                        arguments : [cmnd]
                    })
                )
            }
        }

        return links
    }
}
