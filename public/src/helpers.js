async function acFetch(url, body, selectedEntity) {
    let entity ; 
    if(selectedEntity === 'estudiante')
        body.entity = 'Students' ;
    if(selectedEntity === 'docente')
        body.entity = 'Teachers' ;
    if(selectedEntity === 'curso')
        body.entity = 'Courses' ;
    let response  ; 
    if(url === '/read' && body.query !== undefined && body.query.length === 0) 
        url+='/all' ; 
    response = await (await fetch('/data'+url, {
        method: 'post',
        credentials: "same-origin",
        headers: new Headers({'Content-Type': 'application/json'}),
        body: JSON.stringify(body)
    })).json(); 
    if(response.checkGender)
        alert('Revisa el género ingresado para el '+selectedEntity)
    return response.data;
}