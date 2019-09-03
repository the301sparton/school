let user; let imgBase = '';
$(document).ready(function() { 
     firebase.auth().onAuthStateChanged(function(usr) {
        if (usr) {

            user = usr;
            var getUserReq = $.post("../apis/User.php", { type: "getById", uid: user.uid });
            getUserReq.done(function (user_dat) {
                if(JSON.parse(user_dat).length != 0){
                    window.location = "../home";
                }
            });
            
            if(user.photoURL !=null){
                document.getElementById("profileImage").src = user.photoURL;
                var img = document.getElementById("profileImage");
                img.setAttribute('crossOrigin', 'anonymous');
                img.onload = function(){
                    var canvas = document.createElement("canvas");
                    var ctx = canvas.getContext("2d");
                    canvas.width = img.width;
                    canvas.height = img.height;
                    ctx.drawImage(img,0,0, img.width, img.height);     // source rectangle
                    var dataURL = canvas.toDataURL();
                    imgBase = dataURL;
                };
            }
            document.getElementById("displayName").value = user.displayName;
            document.getElementById("eid").value = user.email;
            if(user.phoneNumber != null){
                document.getElementById("mobileNumber").value = user.phoneNumber;
            }
            else{
                document.getElementById("mobileNumber").placeholder = "+91";
            }        
        }
        else{
            window.location = baseUrl;
        }

      });

      $("#img_picker").change(function () {
        readURL(this);
      });
});
   
$("#newUserForm").submit(function(event) {         
    event.preventDefault();
    
    var newUserReq = $.post("../apis/User.php",{type:"newUser",
                             uid: user.uid,
                             displayName:document.getElementById("displayName").value,
                             eid:document.getElementById("eid").value,
                             mobileNumber:document.getElementById("mobileNumber").value,
                             photo: imgBase
                        });
    newUserReq.done(function(newUserRes){
        console.log(newUserRes);
        if(newUserRes == 200){
            window.location = "../home";
        }
        else{
            alert("Failed to register :(");
        }
    });
});

function readURL(input) {
    if (input.files && input.files[0]) {
        var reader = new FileReader();
        reader.onload = function (e) {
            $('#myProfileImagePicker').attr('src', e.target.result);
             imgBase = e.target.result;
             document.getElementById('profileImage').src = imgBase;
        };
        reader.readAsDataURL(input.files[0]);
    }
  }
  
