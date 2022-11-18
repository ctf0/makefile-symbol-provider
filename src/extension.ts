import lensProvider from './CodelensProvider';
import SymbolProvider from './SymbolProvider';
import * as vscode from 'vscode'

const TERMNL_WINDOW = 'MakeFile: Run'
const FILE_TYPE = 'makefile'

export function activate(context: vscode.ExtensionContext) {
    context.subscriptions.push(
        vscode.languages.registerDocumentSymbolProvider([FILE_TYPE], new SymbolProvider()),
        vscode.languages.registerCodeLensProvider([FILE_TYPE], new lensProvider()),
        vscode.commands.registerCommand(`${FILE_TYPE}.run`, (data) => {
            let terminal: vscode.Terminal = getTerminalWindow()
            terminal.show()
            terminal.sendText(`make ${data}`)
        })
    )
}

function getTerminalWindow() {
    let terminal
    let trmnls = vscode.window.terminals

    for (let index = 0; index < trmnls.length; index++) {
        const trmnl = trmnls[index]

        if (trmnl.name == TERMNL_WINDOW) {
            terminal = trmnl
            break
        }
    }

    return terminal || vscode.window.createTerminal(TERMNL_WINDOW)
}

export function deactivate() { }
