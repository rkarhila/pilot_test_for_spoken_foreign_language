# Pilot test for spoken foreign language #

#### As intended for final examinations (leaving cert) in Finnish high schools, using the web browser, web cam and microphone for recording test answers ####

### Installation ###

You'll need:

1. Nodejs
2. Mongodb
3. FFMPEG with libvorbis audio and vp8 video codecs ( https://trac.ffmpeg.org/wiki/CompilationGuide/Centos might be helpful if you're on Red Hat derivatives.)

Pull the repo and install node supplementaries:

```
git clone  https://github.com/rkarhila/pilot_test_for_spoken_foreign_language $fancydirname

cd $fancydirname

npm install
```

Throw in a user with a role: 'global-admin' and some test questions.


### Server setup (Mostly as a note to myself) ###

In intended use, the data could be called sensitive, so https is a requirement.

Set up nginx to listen to port 443 and forward requests to nodejs server on some higher port:


```
# nginx conf, might be in /etc/nginx/conf.d/default.conf
# with calls to /pilot_test/* forwarded to port 5000

server {
    listen   443;
    server_name  our_host;
    client_max_body_size 30M;

    ssl    on;
    ssl_certificate    /etc/ssl/certs/our_host.crt;
    ssl_certificate_key    /etc/ssl/private/our_host.key;

    location /pilot_test/  {
      rewrite ^/pilot_test/?(.*) /$1 break;
      proxy_pass http://localhost:5000;
      proxy_set_header Host $host;
    }
	
    #
    # Handle html, php, errors...
    #	
} 
```

Then run the nodejs server with
```
env PORT=5000 BASE_URL=/pilot_test/ npm start
```
or better yet, make is a system service.


### Test excercises supported ###

1. Microphone test
2. Answering questions with possibility for re-recording (handy for asking names etc.)
3. Producing speech from stimulus (text, image, video)
4. Video "conversation" (ie. talking head or other bits of videos asking questions)
5. Pair excercise, where the test takers form pairs or groups of three and discuss a theme



### Sample excercise definitions ###

TBA.


### I am forever indebted to ###

- https://github.com/muaz-khan/WebRTC-Experiment/
- https://github.com/mattdiamond/Recorderjs
- http://github.com/chikamichi/jquery.pietimer
