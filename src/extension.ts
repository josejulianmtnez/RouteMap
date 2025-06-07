import * as vscode from 'vscode';
import { exec } from 'child_process';

export function activate(context: vscode.ExtensionContext) {
    let disposable = vscode.commands.registerCommand('extension.showRoutes', () => {
        const workspaceFolders = vscode.workspace.workspaceFolders;
        if (!workspaceFolders) {
            vscode.window.showErrorMessage('Abre una carpeta de proyecto Laravel primero');
            return;
        }
        const projectPath = workspaceFolders[0].uri.fsPath;

        exec('php artisan route:list --json', { cwd: projectPath }, (error, stdout, stderr) => {
    if (error) {
        vscode.window.showErrorMessage('Error ejecutando artisan: ' + error.message);
        return;
    }
    if (stderr) {
        console.error(stderr);
    }

    try {
        const routes = JSON.parse(stdout);

        const panel = vscode.window.createWebviewPanel(
            'routeCoverage',
            'Laravel Routes',
            vscode.ViewColumn.One,
            {
                enableScripts: true,
                localResourceRoots: [
                    vscode.Uri.joinPath(context.extensionUri, 'media')
                ]
            }
        );

        const htmlContent = getHtmlForWebview(panel.webview, context, routes);
        panel.webview.html = htmlContent;

        panel.webview.onDidReceiveMessage(message => {
            if (message.command === 'ready') {
                panel.webview.postMessage({
                    command: 'loadData',
                    routes: routes
                });
            }
            else if (message.command === 'filterRoutes') {
                // Aquí puedes implementar filtrado en backend si lo deseas
                // Por ahora respondemos con todas las rutas
                panel.webview.postMessage({
                    command: 'loadData',
					routes: routes.filter((route: any) => route.uri.includes(message.filter))
                });
            }
        });
    } catch (e) {
        vscode.window.showErrorMessage('No se pudo parsear la salida de artisan');
    }
});
    });
    context.subscriptions.push(disposable);
}

function getHtmlForWebview(webview: vscode.Webview, context: vscode.ExtensionContext, routes: any[]): string {
    const scriptUri = webview.asWebviewUri(
        vscode.Uri.joinPath(context.extensionUri, 'media', 'graphView.js')
    );
    const cytoscapeCdn = 'https://unpkg.com/cytoscape@3.24.0/dist/cytoscape.min.js';

    return `
    <!DOCTYPE html>
	<html lang="es">
	<head>
		<meta charset="UTF-8" />
		<meta name="viewport" content="width=device-width, initial-scale=1" />
		<title>Laravel Route Graph</title>
		<style>
			html, body {
				margin: 0; padding: 0; height: 100%; width: 100%;
				background: #f9f9f9;
				font-family: 'Segoe UI', sans-serif;
				display: flex;
				flex-direction: column;
			}
			#toolbar {
				padding: 8px;
				background: #fff;
				border-bottom: 1px solid #ccc;
				display: flex;
				align-items: center;
				gap: 8px;
			}
			#filterInput {
				flex-grow: 1;
				padding: 6px 8px;
				font-size: 14px;
				border: 1px solid #ccc;
				border-radius: 4px;
			}
			#cy {
				flex-grow: 1;
				width: 100vw;
				height: 100%;
				min-height: 400px;
			}
		</style>
	</head>
	<body>
		<div id="toolbar">
			<input type="text" id="filterInput" placeholder="Filtrar rutas por URI..." />
			<button id="resetFilter">Mostrar todo</button>
		</div>
		<div id="cy"></div>

		<script src="https://unpkg.com/cytoscape@3.24.0/dist/cytoscape.min.js" defer></script>
		<script>
			const vscode = acquireVsCodeApi();
			let cy = null;
			let currentElements = [];
			let nodePositions = {}; // Para guardar posiciones y usar layout preset

			document.addEventListener('DOMContentLoaded', () => {
				const filterInput = document.getElementById('filterInput');
				const resetFilter = document.getElementById('resetFilter');

				filterInput.addEventListener('input', () => {
					const filterText = filterInput.value.trim();
					vscode.postMessage({ command: 'filterRoutes', filter: filterText });
				});

				resetFilter.addEventListener('click', () => {
					filterInput.value = '';
					vscode.postMessage({ command: 'filterRoutes', filter: '' });
				});
			});

			window.addEventListener('message', event => {
				const message = event.data;
				if (message.command === 'loadData') {
					const data = buildGraphFromRoutes(message.routes);
					currentElements = data;

					if (cy) {
						// Guardar posiciones actuales para preset
						cy.nodes().forEach(node => {
							nodePositions[node.id()] = node.position();
						});
						cy.destroy();
					}

					loadGraph(currentElements);
				}
			});

			vscode.postMessage({ command: 'ready' });

			function buildGraphFromRoutes(routes) {
				const elements = [];

				routes.forEach((route, i) => {
					const routeId = 'route_' + i;
					const ctrlId = routeId + '_ctrl';
					const midId = routeId + '_mid';

					elements.push({ data: { id: routeId, label: route.method + ' ' + route.uri } });

					if (route.action) {
						elements.push({ data: { id: ctrlId, label: route.action } });
						elements.push({ data: { source: routeId, target: ctrlId } });
					}

					if (route.middleware && route.middleware.length > 0) {
						route.middleware.forEach((mw, j) => {
							const mwId = midId + '_m' + j;
							elements.push({ data: { id: mwId, label: mw } });
							elements.push({ data: { source: ctrlId, target: mwId } });
						});
					}
				});

				return elements;
			}

			function loadGraph(elements) {
				cy = cytoscape({
					container: document.getElementById('cy'),
					elements: elements,
					style: [
						{
							selector: 'node',
							style: {
								'background-color': '#ffffff',
								'border-color': '#FF2D20',
								'border-width': 2,
								'label': 'data(label)',
								'color': '#333333',
								'font-size': '12px',
								'text-valign': 'center',
								'text-halign': 'center',
								'text-wrap': 'wrap',
								'width': 'label',
								'height': 'label',
								'padding': '8px',
								'shape': 'roundrectangle',
								'text-max-width': 160,
								'font-family': 'Segoe UI, sans-serif'
							}
						},
						{
							selector: 'edge',
							style: {
								'width': 1.5,
								'line-color': '#999999',
								'target-arrow-color': '#999999',
								'target-arrow-shape': 'triangle',
								'curve-style': 'bezier'
							}
						}
					],
					layout: {
						name: 'preset',
						positions: nodePositions,
						padding: 10
					}
				});
				if (Object.keys(nodePositions).length === 0) {
					const layout = cy.layout({
						name: 'breadthfirst',
						spacingFactor: 0.4,
						directed: true,
						padding: 10
					});
					layout.run();

					// Guardar posiciones para la próxima vez
					cy.nodes().forEach(node => {
						nodePositions[node.id()] = node.position();
					});
				}
			}
		</script>
		<script src="${scriptUri}" defer></script>
	</body>
	</html>
    `;
}

export function deactivate() {}
