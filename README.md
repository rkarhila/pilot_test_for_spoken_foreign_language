# Pilot test for spoken foreign language #

## A brach for the interspeech 16 show and tell demonstration ##

#### The sourced work is intended for final examinations (leaving cert) in Finnish high schools, using the web browser, web cam and microphone for recording test answers ####

Modifications for the demo:

1. Simplified tasks, I'll probably hard-code these in the browser scripts to keep things really simple
2. Sample pronunciations that user can parrot ("to parrot" is not really a verb, is it?)
3. Record audio and video from mobile devices (better implemented in mobile browsers anyway!)
4. A result screen based on some crude classification results.

### Installation ###

You'll need:

1. Nodejs
2. ~~Mongodb~~ (No session management, no user registration, nothing complicated!)
3. FFMPEG with libvorbis audio and vp8 video codecs ( https://trac.ffmpeg.org/wiki/CompilationGuide/Centos might be helpful if you're on Red Hat derivatives.)
4. Kaldi and a bunch of Aku's scripts to do the validation bit
5. Keras or your favourite DNN implementation to run a phoneme classification LSTM over audio segments 

Pull the repo and install node supplementaries:

```
git clone  https://github.com/rkarhila/pilot_test_for_spoken_foreign_language $fancydirname

git checkout interspeech16

cd $fancydirname

npm install
```


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
2. Reading sentences from prompts (with or without sample reading)
2. ~~~Answering questions with possibility for re-recording (handy for asking names etc.)~~~
3. ~~~Proroducing speech from stimulus (text, image, video)~~~
4. ~~~Video "conversation" (ie. talking head or other bits of videos asking questions)~~~
5. ~~~Pair excercise, where the test takers form pairs or groups of three and discuss a theme~~~



### Sample excercise definitions ###

...are in the public/javascript/shor_test.js


### I am forever indebted to ###

- https://github.com/muaz-khan/WebRTC-Experiment/
- https://github.com/mattdiamond/Recorderjs
- http://github.com/chikamichi/jquery.pietimer
