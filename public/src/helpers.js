async function acFetch(url, body, url_base) {
    if(url_base === 'estudiante')
        url_base = 'students' ;
    if(url_base === 'docente')
        url_base = 'teachers' ;
    if(url_base === 'curso')
        url_base = 'courses' ;
    let response  ; 
    if(url === '/query'){
        if(body.query.length === 0)
            url+='/all' ; 
        response = await (await fetch('/data/'+url_base + url, {
            method: 'post',
            headers: new Headers({'Content-Type': 'application/json'}),
            body: JSON.stringify(body)
        })).json(); 
    }
    return response.data;
}