async function acFetch(url, body, selectedEntity) {
    if(selectedEntity === 'estudiante')
        selectedEntity = 'Students' ;
    if(selectedEntity === 'docente')
        selectedEntity = 'Teachers' ;
    if(selectedEntity === 'curso')
        selectedEntity = 'Courses' ;
    let response  ; 
    body.entity = selectedEntity ;
    console.log(body);
    if(url === '/read' && body.query !== undefined && body.query.length === 0) 
        url+='/all' ; 
    response = await (await fetch('/data'+url, {
        method: 'post',
        headers: new Headers({'Content-Type': 'application/json'}),
        body: JSON.stringify(body)
    })).json(); 
    return response.data;
}