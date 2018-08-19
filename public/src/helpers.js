async function acFetch(url, body, selectedEntity) {
    let base_url ; 
    if(selectedEntity === 'estudiante')
        base_url = '/students' ;
    if(selectedEntity === 'docente')
        base_url = '/teachers' ;
    if(selectedEntity === 'curso')
        base_url = '/courses' ;
    let response  ; 
    if(url === '/read' && body.query !== undefined && body.query.length === 0) 
        url+='/all' ; 
    response = await (await fetch('/v1'+base_url+url, {
        method: 'post',
        credentials: "same-origin",
        headers: new Headers({'Content-Type': 'application/json'}),
        body: JSON.stringify(body)
    })).json(); 
    if(response.checkGender)
        alert('Es posible que el género ingresado para el '+selectedEntity +' esté equivocado.') ;
    return response.data;
}