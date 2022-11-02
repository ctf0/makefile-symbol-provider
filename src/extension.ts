import * as vscode from 'vscode'

export function activate(context: vscode.ExtensionContext) {
    context.subscriptions.push(
        vscode.languages.registerDocumentSymbolProvider(
            {language: "makefile"}, new DynamicSymbolProvider()
        )
    )
}

class DynamicSymbolProvider implements vscode.DocumentSymbolProvider {

    public provideDocumentSymbols(document: vscode.TextDocument): vscode.SymbolInformation[] {

        const result: vscode.SymbolInformation[] = []

        for (let line = 0; line < document.lineCount; line++) {
            const { text } = document.lineAt(line)

            let reg = new RegExp('^([a-zA-Z0-9]+):', 'g').exec(text)

            if (reg !== null) {
                let cmnd = reg[1]

                result.push(
                    new vscode.SymbolInformation(
                        cmnd,
                        vscode.SymbolKind.Key,
                        cmnd,
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

// this method is called when your extension is deactivated
export function deactivate() { }
