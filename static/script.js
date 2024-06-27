document.getElementById('addField').addEventListener('click', function() {
    const fieldsDiv = document.getElementById('fields');
    const newFieldDiv = document.createElement('div');
    newFieldDiv.className = 'field';
    newFieldDiv.innerHTML = `
        <input type="text" placeholder="Nombre del campo" required>
        <select>
            <option value="INTEGER">INTEGER</option>
            <option value="TEXT">TEXT</option>
            <option value="REAL">REAL</option>
            <option value="BLOB">BLOB</option>
        </select>
        <button type="button" class="removeField">Eliminar</button>
    `;
    fieldsDiv.appendChild(newFieldDiv);

    newFieldDiv.querySelector('.removeField').addEventListener('click', function() {
        newFieldDiv.remove();
    });
});

document.getElementById('dbForm').addEventListener('submit', function(e) {
    e.preventDefault();

    const dbName = document.getElementById('dbName').value.trim();
    const tableName = document.getElementById('tableName').value.trim();
    const fields = Array.from(document.querySelectorAll('#fields .field')).map(fieldDiv => {
        return {
            name: fieldDiv.querySelector('input').value.trim(),
            type: fieldDiv.querySelector('select').value
        };
    });

    if (!dbName || !tableName || fields.some(field => !field.name)) {
        document.getElementById('result').textContent = 'Todos los campos son obligatorios.';
        return;
    }

    const fieldNames = fields.map(field => field.name);
    const uniqueFieldNames = new Set(fieldNames);
    if (fieldNames.length !== uniqueFieldNames.size) {
        document.getElementById('result').textContent = 'Los nombres de los campos deben ser únicos.';
        return;
    }

    fetch('/generate_db', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ db_name: dbName, table_name: tableName, fields: fields })
    })
    .then(response => response.json())
    .then(data => {
        document.getElementById('result').textContent = data.message;
    })
    .catch(error => {
        console.error('Error:', error);
        document.getElementById('result').textContent = 'Ocurrió un error al generar la base de datos.';
    });
});
