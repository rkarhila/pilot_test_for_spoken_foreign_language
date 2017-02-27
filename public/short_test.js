
var tasks_and_stimuli=[
    {
	"task_id": 0,
	"trial_id": 0,
	"evaluated":false,
	"stimulus_layout" : "<div class=main><div id=stimulus><div></div>",
	"stimulus" : "
<p>The test consists of the following parts:
<ul>
<li> Microphone test (30 s)
<li> Read 8 sentences from a dialogue (15 s each)
<li> Wait for computation to finish, then view results
</li>
<p><b> IMPORTANT!</b> Your audio and video data will be stored on Aalto University's server and it can be used for academic research purposes. Also, your results page can be accessed for the next 72 hourse with a simple 5-letter code that someone can guess or spy over your shoulder. <b>Therefore don't say to the application anything you wouldn't say in public.</b></p>
<p><b>WARNING!</b>The evaluation is calibrated to detect native Finnish high school students' phonetic strengths and weaknesses. Your pronunciation habits are probably very different, so the results might be very funny!</p>
",
	"controls" :  "only_accept",
	"next_task": 0,
	"next_trial": 1,
    },
    {
	"task_id": 0,
	"trial_id": 1,
	"evaluated":false,
	"instructions" : "<p>Tervetuloa kokeilemaan varhaista kehitysprototyyppiä puhutun vieraan kielen ylioppilaskoejärjestelmästä! <p> Ensin testataan tekniikka ruudun ohjeiden mukaan.</p>",
	"stimulus_layout" : "<div class=main><div id=stimulus><div></div>",
	"stimulus" : "<p>Press the record button and say something to the mic. Recording stops automatically after 10 seconds. You can also stop it earlier. Then listen to your utterance.",
	"stimulus_2" :  "<p>If there was sound and the level was ok, continue to the actual test.</p>
 <p>If you did not get sound or image, check the media permissions in your browser. If you did not get sound, check the microphone settings in your operating system's mixer or the microphone hardware. Then try again.",
        "hypermedia" : "full_forced_listening",
	"controls" :  "full_forced_listening",
	"next_task": 15,
	"next_trial": 0,	
    },  

    {
	"task_id":    15 ,
	"trial_id" : 0,
	"evaluated": false,
	"instructions" : "<p>Du får se några bitar text av en dialog. Läs dem högt. Du har 15 sekunder att läsa varje text.</p> 
<p>You will see bits of text from a dialogue. Read them aloud. You have 15 seconds for each text.</p>",

	"stimulus_layout" : "<div class=main><p>Click the button and you will see a text and recording will start. Read the text aloud. You have up to 15 seconds.<div id=stimulus style=\"font-family: 'Arial Black', 'Arial';font-size: 52px;font-style: normal; font-variant: normal; font-weight: bold; line-height: 70.4px;\"></div>(Practise round, not evaluated!)</div>",
	"controls" :  "start_only",
	"stimulus" : "Det är kul att prova på något nytt som det här elektriska talprovet på dator."
	"easy_stimulus" : "Det är kul <br> att prova <br>på något nytt<br> som det här<br> elektriska <br>talprovet <br>på dator.",
	"next_task": 16,
	"next_trial": 0,
    },
    {
	"task_id":    16 ,
	"trial_id" : 0,
	"stimulus" : "Hejsan, jag skulle vilja ha två biljetter till The Rasmuskonsert på Ullevi den tredje juni.",
	"easy_stimulus" : "Hejsan, <br>  jag skulle  <br> vilja ha  <br> två biljetter <br>  till <br>  The Rasmuskonsert  <br> på Ullevi  <br> den tredje  <br> juni.",
	"hypermedia" : "None",
	"response_time": "15",
	"next_task": 16,
	"next_trial": 1,
    },
    {
	"task_id":    16 ,
	"trial_id" : 1,
	"stimulus" : "Vill du ha ståplatser eller sittplatser?",
	"easy_stimulus" : "Vill du ha<br> ståplatser <br>eller<br> sittplatser?",
	"hypermedia" : "None",
	"response_time": "15",
	"next_task": 16,
	"next_trial": 2,
    },	
    {
	"task_id":    16 ,
	"trial_id" : 2,
	"stimulus" : "Sittplatserna kostar 420 (fyra hundra tjugo) kronor och ståplatserna kostar 320 kronor.",
	"easy_stimulus" : "Sittplatserna <br> kostar <br> fyra hundra <br> tjugo kronor <br> och ståplatserna <br> kostar <br> tre hundra  <br> tjugo kronor.",
	"hypermedia" : "None",
	"response_time": "15",
	"next_task": 16,
	"next_trial": 3,
    },	
    {
	"task_id":    16 ,
	"trial_id" : 3,
	"stimulus" : "Då kommer man väl närmare scenen också?",
	"easy_stimulus" : "Då kommer man <br> väl närmare  <br>scenen också?",
	"hypermedia" : "None",
	"response_time": "15",
	"next_task": 16,
	"next_trial": 4,
    },	
    {
	"task_id":    16 ,
	"trial_id" : 4,
	"stimulus" : "Ja, men det kan bli ganska trångt längst framme.",
	"esay_stimulus" : "Ja, men  <br>det kan bli <br> ganska trångt  <br>längst framme.",
	"hypermedia" : "None",
	"response_time": "15",
	"next_task": 16,
	"next_trial": 5,
    },	
    {
	"task_id":    16 ,
	"trial_id" : 5,
	"stimulus" : "Det lönar sig att komma i god tid till konserten.",
	"easy_stimulus" : "Det lönar sig <br> att komma  <br>i god tid  <br>till konserten.",
	"hypermedia" : "None",
	"response_time": "15",
	"next_task": 16,
	"next_trial": 6,
    },	
    {
	"task_id":    16 ,
	"trial_id" : 6,
	"stimulus" : "Den börjar klockan nio, men dörrarna öppnas redan klockan sju.",
	"easy_stimulus" : "Den börjar <br>klockan nio,<br> men dörrarna <br>öppnas redan <br>klockan sju.",
	"hypermedia" : "None",
	"response_time": "15",
	"next_task": 16,
	"next_trial": 7,
    },	
    {
	"task_id":    16 ,
	"trial_id" : 7,
	"stimulus" : "Jag har inte pengar med mig just nu, kan jag lösa ut biljetterna senare?",
	"easy_stimulus" : "Jag har <br>inte pengar <br>med mig just nu,<br> kan jag lösa ut <br>biljetterna senare?",
	"hypermedia" : "None",
	"response_time": "15",
	"next_task": 16,
	"next_trial": 8,
    },		
    {
	"task_id":    16 ,
	"trial_id" : 8,
	"stimulus" : "Det går bra, men du måste hämta dem senast två dagar före konserten.",
	"easy_stimulus" : "Det går bra,<br> men du måste <br>hämta dem <br>senast två dagar<br> före konserten.",
	"hypermedia" : "None",
	"response_time": "15",
	"next_task": 9,
	"next_trial": 0,
    },
    {
	"task_id":    9 ,
	"trial_id" : 0,
	"evaluated": true,
	"instructions" : "<h2>Det var det, tack ska du ha.</h2><p>That's it. Now let's wait for all the audio files to transfer and your restults to be computed. Let's hope it works!",
	"stimulus_layout" : "<div class=main>Ha det bra! Jättekiva fiilis!</div>",
	"controls" :  "wait_for_results"
    }
)
];
