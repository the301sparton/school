let user;
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
});
   
$("#newUserForm").submit(function(event) {         
    event.preventDefault();
    
    var newUserReq = $.post("../apis/User.php",{type:"newUser",
                             uid: user.uid,
                             displayName:document.getElementById("displayName").value,
                             eid:document.getElementById("eid").value,
                             mobileNumber:document.getElementById("mobileNumber").value
                        });
    newUserReq.done(function(newUserRes){
        console.log(newUserRes);
        if(newUserRes == "200"){
            window.location = "../home";
        }
        else{
            alert("Failed to register :(");
        }
    });
});
