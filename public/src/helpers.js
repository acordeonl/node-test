async function acFetch(action, selectedEntity , req ) {
    let base_url ; 
    if(selectedEntity === 'estudiante')
        base_url = '/students' ;
    if(selectedEntity === 'docente')
        base_url = '/teachers' ;
    if(selectedEntity === 'curso')
        base_url = '/courses' ;

    if(action === 'create') {
        response = await (await fetch('/v1'+base_url, {
            method: 'post',
            credentials: "same-origin",
            headers: new Headers({'Content-Type': 'application/json'}),
            body: JSON.stringify(req.body)
        })).json(); 
        
        if(base_url !== '/courses')
            if(response.checkGender)
                alert('Es posible que el género ingresado para el '+selectedEntity +' esté equivocado.') ;
    }
    if(action === 'read') {
        let queryParams = '?' ; 
        if(req.query.length > 0)
            queryParams += 'query='+req.query+'&'; 
        if(req.page !== undefined)
            queryParams += 'page='+req.page ; 
        response = await (await fetch('/v1'+base_url+queryParams, {
            method: 'get',
            credentials: "same-origin",
        })).json(); 
    }
    if(action === 'update'){
        response = await fetch('/v1'+base_url+'/'+req.entityId, {
            method: 'put',
            credentials: "same-origin",
            headers: new Headers({'Content-Type': 'application/json'}),
            body: JSON.stringify(req.body)
        }) ;
    }
    if(action === 'delete'){
        response = await fetch('/v1'+base_url+'/'+req.entityId, {
            method: 'delete',
            credentials: "same-origin",
        }) ;
    }
    return response ; 
}