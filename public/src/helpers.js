async function acFetch(url, body, url_base) {
    // if(url_base === undefined)
    //     url_base = 'db' ; 
    // body.user = app_user;
    // body.ref = app_ref;
    // if(!body.query)
    //     body.query = '' ; 

    // console.log(url,body);
    // response = await fetch('/'+url_base + url, {
    //     method: 'post',
    //     headers: new Headers({'Content-Type': 'application/json'}),
    //     body: JSON.stringify(body)
    // }) ; 
    if(entityType === 'person'){
        response = {
            "data": [
                {
                "_id": "5b5f7b548ff0510e5ff99429",
                "givenName": "Camilo Andres",
                "familyName": "Barraza Urbina",
                "gender":"M",
                "personalId":"1121300667"
            },
            {
                "_id": "5b5f7b548ff0fdasf510e5ff99429",
                "givenName": "Gonzalo",
                "familyName": "Higuain",
                "gender":"M",
                "personalId":"113240667"
            },
            {
                "_id": "5b5f7b548ff0fdasf510e5ff99429",
                "givenName": "Gonzalo",
                "familyName": "Higuain",
                "gender":"M",
                "personalId":"113240667"
            },
            {
                "_id": "5b5f7b548ff0fdasf510e5ff99429",
                "givenName": "Gonzalo",
                "familyName": "Higuain",
                "gender":"M",
                "personalId":"113240667"
            },
            {
                "_id": "5b5f7b548ff0fdasf510e5ff99429",
                "givenName": "Gonzalo",
                "familyName": "Higuain",
                "gender":"M",
                "personalId":"113240667"
            },
            {
                "_id": "5b5f7b548ff0fdasf510e5ff99429",
                "givenName": "Gonzalo",
                "familyName": "Higuain",
                "gender":"M",
                "personalId":"113240667"
            },
            {
                "_id": "5b5f7b548ff0fdasf510e5ff99429",
                "givenName": "Gonzalo",
                "familyName": "Higuain",
                "gender":"M",
                "personalId":"113240667"
            },
            {
                "_id": "5b5f7b548ff0fdasf510e5ff99429",
                "givenName": "Gonzalo",
                "familyName": "Higuain",
                "gender":"M",
                "personalId":"113240667"
            },
            {
                "_id": "5b5f7b548ff0fdasf510e5ff99429",
                "givenName": "Gonzalo",
                "familyName": "Higuain",
                "gender":"M",
                "personalId":"113240667"
            },
            {
                "_id": "5b5f7b548ff0fdasf510e5ff99429",
                "givenName": "Gonzalo",
                "familyName": "Higuain",
                "gender":"M",
                "personalId":"113240667"
            }
        ],
            "ref": "f1svwhmfc"
        }
    }
    else{
        response = {
            "data": [{
                "_id": "5b5f7b548ff0fdasf510e5fdasfadsff99429",
                "courseId": "342j4fdasfas32jkl342",
                "name": "historia del arte",
                "observations":"Curso complementario",
            },{
                "_id": "5b5f7b548ff0fdasf510e5ff99429",
                "courseId": "342j432jkl342",
                "name": "Intro a la ing",
                "observations":"Curso de iniciación",
            }],
            "ref": "f1svwhmfc"
        }
    }
    await sleep(200);

    if (response.status === 200) {
        response = await response.json();
    } else {
        if (response.status === 500)
            throw 'serverInternalError';
        if (response.status > 500 && response.status < 600)
            throw 'serverIsDown';
    }

    return response.data;
}