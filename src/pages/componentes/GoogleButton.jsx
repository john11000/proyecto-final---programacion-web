import { useEffect, useState } from 'react';
const googleClientId =  "598181744774-4cnk833rv82mtpe4bj12q3nkbgr8uoj1.apps.googleusercontent.com"// process.env.REACT_APP_GOOGLE_CLIENT_ID;
 
const loadGoogleScript = () => {
  
  //loads the Google JavaScript Library
  (function () {
      const id = 'google-js';
      const src = 'https://apis.google.com/js/platform.js';
      
      //we have at least one script (React)
      const firstJs = document.getElementsByTagName('script')[0];
      
      //prevent script from loading twice
      if (document.getElementById(id)) { return; }
      const js = document.createElement('script'); 
      js.id = id;
      js.src = src;
      js.onload = window.onGoogleScriptLoad; 
      firstJs.parentNode.insertBefore(js, firstJs);
  }());    
  
}


function GoogleButton() {
  
  const [gapi, setGapi] = useState();
  const [googleAuth, setGoogleAuth] = useState();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [imageUrl, setImageUrl] = useState();
  const onSuccess = (googleUser) => {
    
    setIsLoggedIn(true)
    const profile = googleUser.getBasicProfile();
    setName(profile.getName());
    setEmail(profile.getEmail());
    setImageUrl(profile.getImageUrl());
  
    // (async () => {
      
    //   const res = await PostUsuariosGoogle({nombre:  profile.getName(), email : profile.getEmail(), fotoUrl :profile.getImageUrl() , documento :  profile.getId(), role:"vendedor"})
    //  console.log(res)
    //  if(res.data.estado===0 ){
    //       if( !res.data.respuesta==="Los datos no fueron enviados correctamente!"){
    //         alert(res.data.respuesta)
    //         }
    //     }else{
    //   localStorage.setItem("session", res.data.respuesta);
    //   window.location.reload();
    //  }


    
    // })()



  };
  
  const onFailure = () => {
    setIsLoggedIn(false);
  }
  

  const signOut =() =>{
    if (window.gapi) {
       const auth2 = window.gapi.auth2.getAuthInstance()
       if (auth2 != null) {
         auth2.signOut().then(auth2.disconnect())
       }
    }
 }
  const logOut = () => {
    (async() => {
      await googleAuth.signOut();
      setIsLoggedIn(false);
      renderSigninButton(gapi);
    })();
  };
  
  const renderSigninButton = (_gapi) => {
    _gapi.signin2.render('google-signin', {
      'scope': 'profile email',
      'width' :425 ,
      'height': 50,
      'longtitle': true,
      'theme': 'dark',
      'onsuccess': onSuccess,
      'onfailure': onFailure 
    });
  }
  
  
  useEffect(() => {
    //window.gapi is available at this point
    window.onGoogleScriptLoad = () => {
     
      const _gapi = window.gapi;
      setGapi(_gapi);
      
      _gapi.load('auth2', () => {
        (async () => { 
          const _googleAuth = await _gapi.auth2.init({
           client_id: googleClientId
          });
          setGoogleAuth(_googleAuth);
          renderSigninButton(_gapi);
    signOut()

        })();
      });
    }
    
    //ensure everything is set before loading the script
    loadGoogleScript();
    
  },);

  
  
  
  return (
    <div className="">
    {imageUrl}
        {!isLoggedIn &&
          <div id="google-signin" className=" mx-auto text-center btn-google overflow-hidden"></div>
        }
        
        {isLoggedIn &&
          <div>
            <div>
            <p> Hola <strong>{name}</strong> su ESTADO esta en <hr/> <span className="text-danger h3"> verificación</span></p>
            </div>
            <div>{name}</div>
            <div>{email}</div>
            <button className='btn btn-primary' onClick={logOut}>Cerrar session</button>
          </div>
        }
    </div>
  );
}


export default GoogleButton;