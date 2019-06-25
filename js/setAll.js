

$(document).ready(function() { 
    document.getElementById("header_twitterLink").href = twitterLink;
    document.getElementById("header_facebookLink").href = facebookLink;
    document.getElementById("header_linkedinLink").href = linkedinLink;
    document.getElementById("header_instagramLink").href = instagramLink;
    document.getElementById("footer_twitterLink").href = twitterLink;
    document.getElementById("footer_facebookLink").href = facebookLink;
    document.getElementById("footer_instagramLink").href = instagramLink;
    document.getElementById("footer_linkedinLink").href = linkedinLink;
    
    document.getElementById("footer_tosLink").href = TOSLink;  
    document.getElementById("footer_ppLink").href = PPLink;

    document.getElementById('fotter_WebsiteTitle').innerText = websiteTitle;
    document.getElementById('fotter_WebsiteDesc').innerText = websiteDesc;
    document.getElementById('footer_address').innerHTML = address;


    document.getElementById('about_websiteTitle').innerText = websiteTitle;

});


$("#contactForm").submit(function(event) {         
    event.preventDefault();
    console.log("hel");
    var newMessageReq = $.post(baseUrl+"/apis/connectUs.php",{type:"newMessage",
                            name:document.getElementById("feedbackName").value,
                            email:document.getElementById("feedbackEmail").value,
                            subject:document.getElementById("feedbackSubject").value,
                            message:document.getElementById("feedbackMessgae").value
                        });

    newMessageReq.done(function(data){
        console.log(data);
        if(data=="200"){
            alert("Message Sent");
            document.getElementById('contactForm').reset();
        }
        else{
            alert("Failed to send message");
        }
    });
});