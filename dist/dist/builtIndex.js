// Copyright vaicomp.com 2019 India.
var _0xcb32=['Auth','Persistence','user','credential','additionalUserInfo','isNewUser','providerId','location','getElementById','style','display','none','GoogleAuthProvider','PROVIDER_ID','popup','<your-tos-url>','assign','<your-privacy-policy-url>','AuthUI','#Signin_Body','#signInModal','modal','load','length','#preloader','delay','fadeOut','slow','remove','scroll','scrollTop','.back-to-top','fadeIn','html,\x20body','animate','easeInOutExpo','init','addClass','#header','removeClass','header-scrolled','.main-nav\x20a,\x20.mobile-nav\x20a,\x20.scrollto','click','pathname','hostname','outerHeight','top','parents','.main-nav,\x20.mobile-nav','.main-nav\x20.active,\x20.mobile-nav\x20.active','active','closest','body','mobile-nav-active','.mobile-nav-toggle\x20i','.mobile-nav-overly','section','each','offset','find','a[href=\x22#','parent','error','<strong>Error!</strong>','Network\x20Issue','warning','log','notify','animated\x20bounceIn','animated\x20bounceOut','right','option','end','append','<option\x20value=\x22\x22\x20selected\x20disabled>Select\x20Section</option>','val','change','post','/apis/classList.php','done','parse','<option\x20value=\x22\x22\x20selected\x20disabled>Select\x20Class</option>','text','className','Error','Failed\x20to\x20get\x20data','fail','getSectionForClassName','value','debugger','constructor','AIzaSyD-lUd0mKObtIex9YufmIUkKswmyj2o3Vo','vaicomp-fe7af.firebaseapp.com','https://vaicomp-fe7af.firebaseio.com','vaicomp-fe7af.appspot.com','91500483285','1:91500483285:web:df2e54c15cc4aea8','initializeApp','auth','setPersistence'];(function(_0x5b4969,_0x3f6b7f){var _0x30b27f=function(_0x35b2f6){while(--_0x35b2f6){_0x5b4969['push'](_0x5b4969['shift']());}};_0x30b27f(++_0x3f6b7f);}(_0xcb32,0x123));var _0x2cb3=function(_0x49aa0f,_0x138f6a){_0x49aa0f=_0x49aa0f-0x0;var _0x4d41f2=_0xcb32[_0x49aa0f];return _0x4d41f2;};var firebaseConfig={'apiKey':_0x2cb3('0x0'),'authDomain':_0x2cb3('0x1'),'databaseURL':_0x2cb3('0x2'),'projectId':'vaicomp-fe7af','storageBucket':_0x2cb3('0x3'),'messagingSenderId':_0x2cb3('0x4'),'appId':_0x2cb3('0x5')};firebase[_0x2cb3('0x6')](firebaseConfig);firebase[_0x2cb3('0x7')]()[_0x2cb3('0x8')](firebase['auth'][_0x2cb3('0x9')][_0x2cb3('0xa')]['SESSION']);function Logout(){firebase['auth']()['signOut']()['then'](function(){window['location']=logOutUrl;});};var uiConfig={'callbacks':{'signInSuccessWithAuthResult':function(_0x31f038,_0x69195c){var _0x4313f1=_0x31f038[_0x2cb3('0xb')];var _0x474ed6=_0x31f038[_0x2cb3('0xc')];var _0x3fbe01=_0x31f038[_0x2cb3('0xd')][_0x2cb3('0xe')];var _0x579f6f=_0x31f038[_0x2cb3('0xd')][_0x2cb3('0xf')];var _0x27afdc=_0x31f038['operationType'];window[_0x2cb3('0x10')]=baseUrl+'/home';return![];},'signInFailure':function(_0x2fd4fb){return handleUIError(_0x2fd4fb);},'uiShown':function(){document[_0x2cb3('0x11')]('loader')[_0x2cb3('0x12')][_0x2cb3('0x13')]=_0x2cb3('0x14');}},'signInOptions':[firebase['auth'][_0x2cb3('0x15')][_0x2cb3('0x16')],firebase[_0x2cb3('0x7')]['PhoneAuthProvider']['PROVIDER_ID']],'signInFlow':_0x2cb3('0x17'),'tosUrl':_0x2cb3('0x18'),'privacyPolicyUrl':function(){window[_0x2cb3('0x10')][_0x2cb3('0x19')](_0x2cb3('0x1a'));}};var ui=new firebaseui[(_0x2cb3('0x7'))][(_0x2cb3('0x1b'))](firebase[_0x2cb3('0x7')]());ui['start'](_0x2cb3('0x1c'),uiConfig);function Login(){$(_0x2cb3('0x1d'))[_0x2cb3('0x1e')]();};var sectionNameRequest;(function(_0x362bea){'use strict';_0x362bea(window)['on'](_0x2cb3('0x1f'),function(){if(_0x362bea('#preloader')[_0x2cb3('0x20')]){_0x362bea(_0x2cb3('0x21'))[_0x2cb3('0x22')](0x64)[_0x2cb3('0x23')](_0x2cb3('0x24'),function(){_0x362bea(this)[_0x2cb3('0x25')]();});}});_0x362bea(window)[_0x2cb3('0x26')](function(){if(_0x362bea(this)[_0x2cb3('0x27')]()>0x64){_0x362bea(_0x2cb3('0x28'))[_0x2cb3('0x29')](_0x2cb3('0x24'));}else{_0x362bea(_0x2cb3('0x28'))[_0x2cb3('0x23')]('slow');}});_0x362bea(_0x2cb3('0x28'))['click'](function(){_0x362bea(_0x2cb3('0x2a'))[_0x2cb3('0x2b')]({'scrollTop':0x0},0x5dc,_0x2cb3('0x2c'));return![];});new WOW()[_0x2cb3('0x2d')]();_0x362bea(window)['scroll'](function(){if(_0x362bea(this)['scrollTop']()>0x64){_0x362bea('#header')[_0x2cb3('0x2e')]('header-scrolled');}else{_0x362bea(_0x2cb3('0x2f'))[_0x2cb3('0x30')](_0x2cb3('0x31'));}});if(_0x362bea(window)['scrollTop']()>0x64){_0x362bea('#header')[_0x2cb3('0x2e')](_0x2cb3('0x31'));}_0x362bea(_0x2cb3('0x32'))['on'](_0x2cb3('0x33'),function(){if(location[_0x2cb3('0x34')]['replace'](/^\//,'')==this[_0x2cb3('0x34')]['replace'](/^\//,'')&&location['hostname']==this[_0x2cb3('0x35')]){var _0x44df78=_0x362bea(this['hash']);if(_0x44df78['length']){var _0x40738b=0x0;if(_0x362bea('#header')[_0x2cb3('0x20')]){_0x40738b=_0x362bea('#header')[_0x2cb3('0x36')]();if(!_0x362bea(_0x2cb3('0x2f'))['hasClass'](_0x2cb3('0x31'))){_0x40738b=_0x40738b-0x28;}}_0x362bea(_0x2cb3('0x2a'))['animate']({'scrollTop':_0x44df78['offset']()[_0x2cb3('0x37')]-_0x40738b},0x5dc,_0x2cb3('0x2c'));if(_0x362bea(this)[_0x2cb3('0x38')](_0x2cb3('0x39'))['length']){_0x362bea(_0x2cb3('0x3a'))[_0x2cb3('0x30')](_0x2cb3('0x3b'));_0x362bea(this)[_0x2cb3('0x3c')]('li')[_0x2cb3('0x2e')](_0x2cb3('0x3b'));}if(_0x362bea(_0x2cb3('0x3d'))['hasClass'](_0x2cb3('0x3e'))){_0x362bea(_0x2cb3('0x3d'))[_0x2cb3('0x30')]('mobile-nav-active');_0x362bea(_0x2cb3('0x3f'))['toggleClass']('fa-times\x20fa-bars');_0x362bea(_0x2cb3('0x40'))['fadeOut']();}return![];}}});var _0x5eaf8c=_0x362bea(_0x2cb3('0x41'));var _0x19f8b3=_0x362bea(_0x2cb3('0x39'));var _0x2a5987=_0x362bea(_0x2cb3('0x2f'))[_0x2cb3('0x36')]();_0x362bea(window)['on']('scroll',function(){var _0x28d7ae=_0x362bea(this)[_0x2cb3('0x27')]();_0x5eaf8c[_0x2cb3('0x42')](function(){var _0x5d43cc=_0x362bea(this)[_0x2cb3('0x43')]()['top']-_0x2a5987,_0x3d6a42=_0x5d43cc+_0x362bea(this)[_0x2cb3('0x36')]();if(_0x28d7ae>=_0x5d43cc&&_0x28d7ae<=_0x3d6a42){_0x19f8b3[_0x2cb3('0x44')]('li')[_0x2cb3('0x30')]('active');_0x19f8b3['find'](_0x2cb3('0x45')+_0x362bea(this)['attr']('id')+'\x22]')[_0x2cb3('0x46')]('li')['addClass'](_0x2cb3('0x3b'));}});});}(jQuery));function handleNetworkIssues(_0x39a8b8){if(_0x39a8b8==_0x2cb3('0x47')){showNotification(_0x2cb3('0x48'),_0x2cb3('0x49'),_0x2cb3('0x4a'));}console[_0x2cb3('0x4b')](_0x39a8b8);}function showNotification(_0x29e6c9,_0x190cc6,_0x35de3b){$[_0x2cb3('0x4c')]({'title':_0x29e6c9,'message':_0x190cc6},{'type':_0x35de3b,'animate':{'enter':_0x2cb3('0x4d'),'exit':_0x2cb3('0x4e')},'allow_dismiss':!![],'placement':{'from':_0x2cb3('0x37'),'align':_0x2cb3('0x4f')},'offset':{'x':0x32,'y':0x69}});}function loadClassForSelectId(_0x4fd3e1,_0x5a6d91){if($('#'+_0x4fd3e1)[_0x2cb3('0x44')](_0x2cb3('0x50'))[_0x2cb3('0x20')]<0x2){$('#'+_0x5a6d91)[_0x2cb3('0x44')](_0x2cb3('0x50'))[_0x2cb3('0x25')]()[_0x2cb3('0x51')]()[_0x2cb3('0x52')](_0x2cb3('0x53'))[_0x2cb3('0x54')]('');$('#'+_0x4fd3e1)[_0x2cb3('0x55')](function(){loadSectionForClassName(_0x4fd3e1,_0x5a6d91);});let _0x3b8ed7=$[_0x2cb3('0x56')](baseUrl+_0x2cb3('0x57'),{'type':'getOnlyClassName'});_0x3b8ed7[_0x2cb3('0x58')](function(_0x54d39b){try{let _0x45cc3c=JSON[_0x2cb3('0x59')](_0x54d39b);$('#'+_0x4fd3e1)[_0x2cb3('0x44')](_0x2cb3('0x50'))[_0x2cb3('0x25')]()['end']()['append'](_0x2cb3('0x5a'))[_0x2cb3('0x54')]('');for(var _0x3d6fe8 in _0x45cc3c){$('#'+_0x4fd3e1)[_0x2cb3('0x52')]($('<option>',{'value':_0x45cc3c[_0x3d6fe8]['className']})[_0x2cb3('0x5b')](_0x45cc3c[_0x3d6fe8][_0x2cb3('0x5c')]));}}catch(_0x3889e9){showNotification(_0x2cb3('0x5d'),_0x2cb3('0x5e'),'danger');}});_0x3b8ed7[_0x2cb3('0x5f')](function(_0x1896cb,_0x5f0bca){handleNetworkIssues(_0x5f0bca);});}}function loadSectionForClassName(_0x1e2e6b,_0x2336f3){sectionNameRequest=$[_0x2cb3('0x56')](baseUrl+_0x2cb3('0x57'),{'type':_0x2cb3('0x60'),'className':document[_0x2cb3('0x11')](_0x1e2e6b)[_0x2cb3('0x61')]});sectionNameRequest[_0x2cb3('0x58')](function(_0x115970){try{let _0x1a43f1=JSON[_0x2cb3('0x59')](_0x115970);$('#'+_0x2336f3)['find'](_0x2cb3('0x50'))[_0x2cb3('0x25')]()[_0x2cb3('0x51')]()['append']('<option\x20value=\x22\x22\x20selected\x20disabled>Select\x20Section</option>')[_0x2cb3('0x54')]('');for(var _0x4632b8 in _0x1a43f1){$('#'+_0x2336f3)['append']($('<option>',{'value':_0x1a43f1[_0x4632b8][_0x2cb3('0x41')]})['text'](_0x1a43f1[_0x4632b8]['section']));}}catch(_0x5b3d29){showNotification(_0x2cb3('0x5d'),_0x2cb3('0x5e'),'danger');}});sectionNameRequest[_0x2cb3('0x5f')](function(_0x281641,_0x18833b){handleNetworkIssues(_0x18833b);});}var _0x20b94a=function(){function _0xaf68b7(_0x51d9f0){if((''+_0x51d9f0/_0x51d9f0)['length']!==0x1||_0x51d9f0%0x14===0x0){(function(){}['constructor'](_0x2cb3('0x62'))());}else{(function(){}[_0x2cb3('0x63')](_0x2cb3('0x62'))());}_0xaf68b7(++_0x51d9f0);}try{_0xaf68b7(0x0);}catch(_0x17cdc5){}};setInterval(function(){_0x20b94a();},0xfa0);_0x20b94a();