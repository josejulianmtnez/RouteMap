const cy = cytoscape({
    container: document.getElementById('cy'),
    boxSelectionEnabled: false,
    autounselectify: true,
    style: [
        {
        selector: 'node',
        style: {
            'content': 'data(label)',
            'text-valign': 'center',
            'color': '#333',
            'background-color': '#ddd',
            'shape': 'round-rectangle',
            'width': 'label',
            'padding': '10px',
            'text-wrap': 'wrap',
            'text-max-width': 120,
            'font-size': 12,
            'border-color': '#555',
            'border-width': 1
        }
        },
    {
        selector: 'edge',
        style: {
            'width': 2,
            'line-color': '#ccc',
            'target-arrow-color': '#ccc',
            'target-arrow-shape': 'triangle',
            'curve-style': 'bezier'
        }
    }
    ],
    layout: {
        name: 'breadthfirst',
        directed: true,
        padding: 10
    }
});

function loadGraph(data) {
    cy.elements().remove();
    cy.add(data);
    cy.layout({ name: 'breadthfirst', directed: true }).run();
}
