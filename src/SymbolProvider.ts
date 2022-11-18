import * as vscode from 'vscode'

export default class SymbolProvider implements vscode.DocumentSymbolProvider {

    public provideDocumentSymbols(document: vscode.TextDocument): vscode.SymbolInformation[] {

        const result: vscode.SymbolInformation[] = []

        for (let line = 0; line < document.lineCount; line++) {
            const { text } = document.lineAt(line)

            /* Keys --------------------------------------------------------------------- */
            // aaa :
            // aaa:
            let reg = new RegExp(/^(?!\.PHONY)(\S+)(?=( +)?:)/, 'g').exec(text)

            if (reg !== null) {
                let cmnd = reg[0]

                result.push(
                    new vscode.SymbolInformation(
                        cmnd,
                        vscode.SymbolKind.Key,
                        '',
                        new vscode.Location(
                            document.uri,
                            new vscode.Range(new vscode.Position(line,0),
                            new vscode.Position(line,text.length - 1))
                        )
                    )
                )
            }

            // /* Variables ---------------------------------------------------------------- */
            // // bbb :=
            // // bbb =
            // // bbb=
            reg = new RegExp(/^(\S+)(?=( +)?(:)?\=)/, 'g').exec(text)

            if (reg !== null) {
                let cmnd = reg[1]

                result.push(
                    new vscode.SymbolInformation(
                        cmnd,
                        vscode.SymbolKind.Variable,
                        '',
                        new vscode.Location(
                            document.uri,
                            new vscode.Range(new vscode.Position(line,0),
                            new vscode.Position(line,text.length - 1))
                        )
                    )
                )
            }

            // /* Phony ---------------------------------------------------------------- */
            // // .PHONY:aaa
            // // .PHONY : aaa
            reg = new RegExp(/(?<=^\.PHONY:( )?)(.*)?/, 'g').exec(text)

            if (reg !== null) {
                let cmnd = reg[0].trim()

                result.push(
                    new vscode.SymbolInformation(
                        cmnd,
                        vscode.SymbolKind.Struct,
                        'PHONY',
                        new vscode.Location(
                            document.uri,
                            new vscode.Range(new vscode.Position(line,0),
                            new vscode.Position(line,text.length - 1))
                        )
                    )
                )
            }
        }

        return result
    }
}
