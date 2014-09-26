
        var socket, nom, name, counter, textnode, br, e, window_focus = true,
            once = true,
            j,
            blink, innerblink, chatStatus;
        var users = new Array();
        var idleusers = new Array();

        var icon1 = "http://files.softicons.com/download/application-icons/ichat-emoticon-icons-by-taylor-carrigan/png/512x512/iChat%20Blank.png";
        var baseicon = "http://icons.iconarchive.com/icons/custom-icon-design/office/256/chat-icon.png";

        var linkelem = document.getElementsByTagName('link')[0];


        (function () {
            
           
           socket =io.connect ("http://josephchat.nodejitsu.com");
            counter = 0;



        }());

        socket.on('status', function (data) {

            users = data.activeusers;
            idleusers = data.idleusers;

            ulist = document.getElementById("userlist");
            var list = "<ul id='navlist'>";

            for (j = 0; j < users.length; j++)

                list += "<li id='" + users[j] + "'' style='list-style-image: url(http://im.xdanime.net/ijab/images/status/available.png)'>" + users[j] + "</li>";



            for (j = 0; j < idleusers.length; j++)

                list += "<li id='" + idleusers[j] + "'' style='list-style-image: url(http://im.xdanime.net/ijab/images/status/idle.png)'>" + idleusers[j] + "</li>";



            ulist.innerHTML = list + "</ul>";


        });

        function checkName(nm,array) {

            for (var i = 0; i < array.length; i++) {


                if (array[i] === nm) {

                    alert("User already exits. Choose another name");
                    return false;
                } 
            }

            return true;
        }

        function start() {
            counter++;
            if (counter === 1) {
                name = document.getElementById("name").value;
                if (name.trim() != '' && name.trim() != 'me' && checkName(name,users) &&checkName(name,idleusers)) {

                    namebox.innerHTML = "<font color='maroon'> Welcome " + name + "</font>" + "<br/><hr width='40%' align='left'/><br/>";
                } else {
                    counter--;
                    return;
                }
            }

            var text = document.getElementById("text").value;

            if (text != '' && name != '') {
                socket.emit('textmesg', {
                    "mesg": text,
                    "nom": name
                });
                document.getElementById("text").value = '';
            }

        }

        window.onblur = function () {
            window_focus = false;
            if (!window_focus && name != undefined) {

                chatStatus = setTimeout(function () {

                    socket.emit('idle', name);


                }, 15000);

            }
        }
        window.onfocus = function () {

            clearInterval(blink);
            clearTimeout(innerblink);
            clearTimeout(chatStatus);
            window_focus = true;
            document.title = "CHAT";
            linkelem.href = baseicon;

            if (name != undefined && name != '')
                socket.emit('available', name);


        }



        setInterval(function () {

            socket.emit('status', {})

        }, 200);




        socket.on('message', function (data) {



            if (name.trim() != '' && counter != 0) {

                if (!window_focus) {



                    linkelem.href = icon1;
                    document.title = data.name + " says ";

                    if (blink !== undefined) {

                        clearInterval(blink);
                        clearTimeout(innerblink);
                    }

                    blink = setInterval(function () {

                        innerblink = setTimeout(function () {
                            linkelem.href = icon1;
                            document.title = data.name + " says... ";;

                        }, 1000);

                        linkelem.href = baseicon;
                        document.title = "New Message";



                    }, 2000);


                } else {
                    document.title = "CHAT";

                }
                nom = (data.name === name) ? "me" : data.name;

                textnode = nom + " : " + data.txt;
                br = document.createElement("br");
                e = document.createElement('span');
                e.innerHTML = textnode;
                document.getElementById("box").appendChild(e);
                document.getElementById("box").appendChild(br);


            } else {

                if (once) {

                    var warn = "<font color='red'>Chat in progress, please sign in</font>";
                    var temp = document.createElement('span')
                    temp.innerHTML = warn;
                    document.getElementById("namebox").appendChild(temp);
                    document.getElementById("namebox").removeChild(document.getElementById('#02'));
                    once = false;
                }

            }
        });
    