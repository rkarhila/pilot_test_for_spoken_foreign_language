
var test=[
    {
	"task_id": 0,
	"trial_id": 0,
	"evaluated":false,
	"stimulus_layout" : "<div class=main><div id=stimulus><div></div>",
	"stimulus" : "
<p>The test consists of the following parts:
<ul>
<li>
foo
</li>
<p><b> IMPORTANT!</b> Your audio and video data will be stored on Aalto University's server and it can be used for academic research purposes. Also, your results page can be accessed for the next 72 hourse with a simple 5-letter code that someone can guess or spy over your shoulder. <b>Therefore don't say to the application anything you wouldn't say in public.</b></p>
<p><b>WARNING!</b>The evaluation is calibrated to detect native Finnish high school students' phonetic strengths and weaknesses. Your pronunciation habits are probably very different, so the results might be very funny!</p>
",
	"controls" :  "only_accept"	
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
	"controls" :  "full_forced_listening"	
    },  

    {
	"task_id":    2 ,
	"trial_id" : 0,
	"evaluated": false,
	"instructions" : "<p>Du får se några bitar text av en dialog. Läs dem högt. Du har 15 sekunder att läsa varje text.</p> 
<p>You will see bits of text from a dialogue. Read them aloud. You have 15 seconds for each text.</p>",

	"stimulus_layout" : "<div class=main><p>Click the button and you will see a text and recording will start. Read the text aloud. You have up to 15 seconds.<div id=stimulus style=\"font-family: 'Arial Black', 'Arial';font-size: 52px;font-style: normal; font-variant: normal; font-weight: bold; line-height: 70.4px;\"></div>(Practise round, not evaluated!)</div>",
	"controls" :  "start_only",
	"stimulus" : "Det är kul att prova på något nytt som det här elektriska talprovet på dator."
    },
    {
	"task_id":    2 ,
	"trial_id" : 1,
	"stimulus" : ""
	"hypermedia" : "None",
	"response_time": "15"
    },
    
15.0 Det är kul att prova på något nytt som det här elektriska talprovet på dator. 
16.0 Hejsan, jag skulle vilja ha två biljetter till The Rasmuskonsert på Ullevi den tredje juni.
16.1 Vill du ha ståplatser eller sittplatser?
16.2 Sittplatserna kostar 420 kronor och ståplatserna kostar 320 kronor.
16.3 Då kommer man väl närmare scenen också?
16.4 Ja, men det kan bli ganska trångt längst framme.
16.5 Det lönar sig att komma i god tid till konserten.
16.6 Den börjar klockan nio, men dörrarna öppnas redan klockan sju.
16.7 Jag har inte pengar med mig just nu, kan jag lösa ut biljetterna senare?
16.8 Det går bra, men du måste hämta dem senast två dagar före konserten.


	    {
		"task_order":  0,
		"task_id": 0 ,
		"help": "Yes",    
		"trial_pools":  
		[
		    [0]   
		],
		"trial_counts": [1],
		"random_order": "No"
	    },
	    
	    
	    {
		"task_order":  1 ,
		"task_id": 1 ,
		"help": "No",    
		"trial_pools":  
		[
		    [0,1]   
		],
		"trial_counts": [2],
		"random_order": "No"
	    },
	    
	    {
		"task_order":  2 ,
		"task_id": 2 ,
		"help": "No",    
		"trial_pools":  
		[
		    [0,1,2,3,4,5,6,7,8,9,10]   
		],
		"trial_counts": [5],
		"random_order": "yes"
	    },
	    {
		"task_order":  3 ,
		"task_id": 3 ,
		"help": "No",    
		"trial_pools":  
		[
		    [0,1,2,3,4,5,6,7,8,9,10]   
		],
		"trial_counts": [5],
		"random_order": "yes"
	    },
	    {
		"task_order":  4 ,
		"task_id": 4 ,
		"help": "No",    
		"trial_pools":  
		[
		    [0,1,2,3,4,5,6]   
		],
		"trial_counts": [3],
		"random_order": "yes"
	    },
	    {
		"task_order":  5 ,
		"task_id": 5 ,
		"help": "No",    
		"trial_pools":  
		[
		    [0,1,2,3,4]   
		],
		"trial_counts": [5],
		"random_order": "no"
	    },
	    {
		"task_order":  6 ,
		"task_id": 6 ,
		"help": "No",    
		"trial_pools":  
		[
		    [0,1,2]   
		],
		"trial_counts": [2],
		"random_order": "no"
	    },
	    {
		"task_order":  7 ,
		"task_id": 7 ,
		"help": "No",    
		"trial_pools":  
		[
		    [0,1,2]   
		],
		"trial_counts": [2],
		"random_order": "no"
	    },
	    {
		"task_order":  8 ,
		"task_id": 8 ,
		"help": "No",    
		"trial_pools":  
		[
		    [0,1]
		],
		"trial_counts": [2],
		"random_order": "no"
	    }
	]				
    } )




db.tasks.insert(
    {
	"task_id":    0 ,
	"evaluated":false,
	"instructions" : "<p>Tervetuloa kokeilemaan varhaista kehitysprototyyppiä puhutun vieraan kielen ylioppilaskoejärjestelmästä! <p> Ensin testataan tekniikka ruudun ohjeiden mukaan.</p>",
	"stimulus_layout" : "<div class=main><div id=stimulus><div></div>",
	"controls" :  "full_forced_listening"
    }
)

db.trials.insert(
    [
	{ 
	    "task_id":    0 ,
            "trial_id" : 0,
	    "stimulus" : "<p>Paina nauhoitusnappia, puhu sitten jotain mikrofoniisi (vaikka tämä lause) ja kuuntele nauhoituksesi. Nauhoitus katkeaa 10 s jälkeen. Voit katkaista sen aiemminkin.",
	    "stimulus_2" :  "<p>Jos kuulosti hyvältä, voit jatkaa seuraavaan tehtävään. Jos huonolta, säädä systeemiäsi ja kokeile uudestaan. <h4><a href=\u0022#main\u0022 onclick='\$(\u0022#nosound\u0022).toggle(500);'>Ei ääntä tai kuvaa:</a></h4> <ul id='nosound' style='display: None;'><li>Annoitko luvan mikrofonin tai videokameran käyttöön? Etsi selaimen yläpalkista kameraikoni ja tarkista, että olet (a) antanut luvat ja (b) valinnut oikean mikrofonin ja kameran.<li> Onko mikrofoni päällä? Jos ei, sen voi laittaa päälle järjestelmäsi ääniasetuksista. </ul><h4><a href='#main' onclick='\$(\u0022#tooloud\u0022).toggle(500);'> Liian kovaa:</a></h4><ul id='tooloud' style='display: None;'><li> Säädää mikrofonin tasoa järjestelmäsi ääniasetuksista tai asettamalla mikrofoni hieman sivuun.<li> Voit myös koettaa puhua hiljempaa. </ul> <p>Jos ei toimi toisellakaan yrityksellä, niin pyydä henkilökunta avuksi.<ul>",
            "hypermedia" : "full_forced_listening",
	    "response_time": "10"
	}
    ]
)


db.tasks.insert(
    {
	"task_id":    1 ,
	"evaluated": false,
	"instructions" : "<p>Välkommen till den muntliga delen av provet i svenska. Berätta först vad du heter och vilken skola du går i.",
	"stimulus_layout" : "<div class=main><p>Paina nappia aloittaaksesi nauhoituksen. Vastaa sitten allaolevaan kysymykseen. Nauhoitusaikaa on 10 s. Voit keskeyttää nauhoituksen aiemminkin. Voit kuunnella vastauksesi ja nauhoittaa uudestaan tarvittaessa. <div id=stimulus style=\"font-size: 42px; font-weigth: bold;\" ><div></div>",
	"controls" :  "full"
    }
)
db.trials.insert (
    [
	{ 
	"task_id":    1 ,
	    "trial_id" : 0,
	    "stimulus" : "Vad heter du?",
	    "hypermedia" : "None",
	    "response_time": "10"
	},
	{
	"task_id":    1 ,
	    "trial_id" : 1,
	    "stimulus" : "Vilken skola går du i?",
	    "hypermedia" : "None",
	    "response_time": "10"
	}
    ]
)




db.tasks.insert(
    {
	"task_id":    2 ,
	"evaluated": true,
	"instructions" : "Du får se fem tidningsrubriker. Läs dem högt. Du har 15 sekunder att läsa varje rubrik.",
	"stimulus_layout" : "<div class=main><p>Paina nappia niin näet otsikkotekstin ja nauhoitus alkaa. Lue otsikko. Aikaa on korkeintaan 15 sekuntia.<div id=stimulus style=\"font-family: 'Arial Black', 'Arial';font-size: 52px;font-style: normal; font-variant: normal; font-weight: bold; line-height: 70.4px;\"></div></div>",
	"controls" :  "start_only",
    }
)


db.trials.insert (   
    [
	{ 
	"task_id":    2 ,
	    "trial_id" : 0,
	    "stimulus" : "Rekordmånga ålänningar gör frivillig värnplikt",
	    "hypermedia" : "None",
	    "response_time": "15"
	},
	{
	"task_id":    2 ,
	    "trial_id" : 1,
	    "stimulus" : "Allt fler högskolestudenter pluggar på distans i Sverige",
	    "hypermedia" : "None",
	    "response_time": "15"
	},
	{
	"task_id":    2 ,
	    "trial_id" : 2,
	    "stimulus" : "Välfärdsstaten klarar inte av den ökande arbetslösheten",
	    "hypermedia" : "None",
	    "response_time": "15"
	},
	{
	"task_id":    2 ,
	    "trial_id" : 3,
	    "stimulus" : "Dödsrisken 73 % mindre bland cyklister med skyddshjälm",
	    "hypermedia" : "None",
	    "response_time": "15"
	},
	{
	"task_id":    2 ,
	    "trial_id" : 4,
	    "stimulus" : "Bilreparatören fick en schock när han öppnade bagageluckan",
	    "hypermedia" : "None",
	    "response_time": "15"
	},
	{
	"task_id":    2 ,
	    "trial_id" : 5,
	    "stimulus" : "Kyligt väder försenade jordgubbsskörden",
	    "hypermedia" : "None",
	    "response_time": "15"
	},
	{
	"task_id":    2 ,
	    "trial_id" : 6,
	    "stimulus" : "Vi köper begagnade kläder i gott skick",
	    "hypermedia" : "None",
	    "response_time": "15"
	},
	{
	"task_id":    2 ,
	    "trial_id" : 7,
	    "stimulus" : "Bananer med droger i smugglades i tunnelbanan",
	    "hypermedia" : "None",
	    "response_time": "15"
	},
	{
	"task_id":    2 ,
	    "trial_id" : 8,
	    "stimulus" : "Skjut inte upp att skaffa reseförsäkring",
	    "hypermedia" : "None",
	    "response_time": "15"
	},
	{
	"task_id":    2 ,
	    "trial_id" : 9,
	    "stimulus" : "Den moderna mormodern tågluffar med barnbarnen",
	    "hypermedia" : "None",
	    "response_time": "15"
	},
	{
	"task_id":    2 ,
            "trial_id" : 10,
	    "stimulus" : "Ansökningstiden till juridiska fakulteten går ut 9.4.2015.",
            "hypermedia" : "None",
	    "response_time": "15"
	}
    ]
)





db.tasks.insert(
    {
	"task_id":    3 ,
    "evaluated": true,
	"instructions" : "Vad säger du på svenska i följande situationer? Börja tala när du ser beskrivningen av situationen. Du har 20 sekunder för varje replik.",
    "stimulus_layout" : "<div class=main><p>Paina nappia niin näet kuvauksen tilanteesta ja nauhoitus alkaa. Vastausaikaa on korkeintaan 20 sekuntia.<p>Miten sanot ruotsiksi, kun... <br><div id=stimulus style=\"font-size: 42px; font-weigth: bold;\"></div></div>",
    "controls" :  "start_only"
    } 
)

db.trials.insert (
    [
	{ 
 	"task_id":    3 ,
           "trial_id" : 0,
	    "stimulus" : "toivotat onnea syntymäpäiväsankarille",
            "hypermedia" : "None",
	    "response_time": "20"
	},
	{ 
 	"task_id":    3 ,
           "trial_id" : 1,
	    "stimulus" : "kiität kivoista juhlista viime kerralla",
            "hypermedia" : "None",
	    "response_time": "20"
	},
	{ 
 	"task_id":    3 ,
           "trial_id" : 2,
	    "stimulus" : "pyydät ruokalistaa ravintolassa",
            "hypermedia" : "None",
	    "response_time": "20"
	},
	{ 
 	"task_id":    3 ,
           "trial_id" : 3,
	    "stimulus" : "tiedustelet näytöksen alkamisaikaa",
            "hypermedia" : "None",
	    "response_time": "20"
	},
	{ 
  	"task_id":    3 ,
          "trial_id" : 4,
	    "stimulus" : "kysyt milloin asunto vapautuu",
            "hypermedia" : "None",
	    "response_time": "20"
	},
	{ 
 	"task_id":    3 ,
           "trial_id" : 5,
	    "stimulus" : "kysyt milloin asunto vapautuu",
            "hypermedia" : "None",
	    "response_time": "20"
	},
	{ 
 	"task_id":    3 ,
           "trial_id" : 6,
	    "stimulus" : "kiität opettajaa hyvästä tunnista",
            "hypermedia" : "None",
	    "response_time": "20"
	},
	{ 
  	"task_id":    3 ,
          "trial_id" : 7,
	    "stimulus" : "pyydät ruotsalaista tuttavaasi toistamaan sanomansa",
            "hypermedia" : "None",
	    "response_time": "20"
	},
	{ 
	"task_id":    3 ,
            "trial_id" : 8,
	    "stimulus" : "kehotat kaveriasi tarkistamaan viimeisin instagram-päivityksesi",
            "hypermedia" : "None",
	    "response_time": "20"
	},
	{ 
	"task_id":    3 ,
            "trial_id" : 9,
	    "stimulus" : "pahoittelet ettet voi tulla, koska olet sairastunut",
            "hypermedia" : "None",
	    "response_time": "20"
	},
	{ 
	"task_id":    3 ,
            "trial_id" : 10,
	    "stimulus" : "sanot odottavasi innokkaasti seuraavaa tapaamista",
            "hypermedia" : "None",
	    "response_time": "20"
	}
    ]
)




db.tasks.insert(
    {
	"task_id":    4 ,
	"evaluated": true,
	"instructions" : "Vad säger du på svenska i följande situationer? Nu får du se en bild eller en videosnutt av situationen. Efter den har du 30 sekunder tid att prata.",
	"stimulus_layout" : "<div class=main><p>Paina nappia niin näet kuvan ja tekstin tilanteesta, ja nauhoitus alkaa. Sinulla on 30 sekuntia aikaa. <p>Miten sanot ruotsiksi, kun...<div id=stimulusmedia></div><div id=stimulus style=\"font-size: 42px; font-weigth: bold;\"></div></div>",
	"controls" :  "start_only"
    } 
)

db.trials.insert(
    [
	{ 
	    "task_id":    4 ,
	    "trial_id" : 0,
	    "stimulus" : "neuvot tien apteekkiin",
	    "hypermedia" : "/test_media/openstreetmap_apoteket.png",
	    "mediatype" : "image",
	    "source" : "https://www.openstreetmap.org/directions?engine=mapquest_foot&route=63.6746%2C22.7009%3B63.6724%2C22.7122#map=16/63.6735/22.7065&layers=H",
	    "copyright" : "Humanitarian OpenStreetMap Team",
	    "license" : "Open Data Commons Open Database License (ODbL) http://opendatacommons.org/licenses/odbl/",
	    "response_time": "30"
	},
	{ 
	    "task_id":    4 ,
	    "trial_id" : 1,
	    "stimulus" : "kuvailet vartijalle näkemäsi henkilön",
	    "hypermedia" : "/test_media/Montesquiou_Robert_de_-_Boldini.jpg",
	    "source" : "??",
	    "license" : "??",
	    "copyright-owner" : "??",
	    "mediatype" : "image",
	    "response_time": "30"
	},
	{ 
	    "task_id":    4 ,
	    "trial_id" : 2,
	    "stimulus" : "soitat poliisille ja kerrot havaitsemastasi vaarasta",
	    "hypermedia" : "/test_media/Moose_crossing_a_road.jpg",
	    "mediatype" : "image",
	    "response_time": "30"
	},
	{ 
	    "task_id":    4 ,
	    "trial_id" : 3,
	    "stimulus" : "suostuttelet ystävääsi mukaan konserttiin",
	    "hypermedia" : "/test_media/concerts-836141_640.jpg",
	    "mediatype" : "image",
	    "source" : "https://pixabay.com/en/concerts-band-music-performance-836141/",
	    "license" : "CC0 Public Domain / Free for commercial use / No attribution required",
	    "copyright-owner" : "Someone over at Wikimedia Images",
	    "response_time": "30"
	},
	{ 
	    "task_id":    4 ,
	    "trial_id" : 4,
	    "stimulus" : "ihastelet saamaasi lahjaa",
	    "mediatype" : "image",
	    "hypermedia" : "/test_media/banana-slicer1.jpg",
	    "license" : "Unknown, probably too restrictive",
	    "copyright-owner" : "Hutzler Manufacturing Co.",
	    "source" : "http://removeandreplace.com/2013/05/28/ridiculous-products-stupid-strange-funny-and-weird-things-you-can-actually-buy/",
	    "response_time": "30"
	},
	{ 
	    "task_id":    4 ,
	    "trial_id" : 5,
	    "stimulus" : "kuvailet ja kommentoit retkipäivän säätä",
	    "mediatype" : "image",
	    "license" : "CC0 Public Domain",
	    "copyright-owner" : "https://pixabay.com/en/users/MeetWarrenMiller-170382/",
	    "hypermedia" : "/test_media/fog-290249_640.jpg",
	    "response_time": "30"
	},
	{ 
	    "task_id":    4 ,
	    "trial_id" : 6,
	    "stimulus" : "kuvailet tilaamaasi ruoka-annosta",
	    "mediatype" : "image",
	    "hypermedia" : "/test_media/800px-SnailsInTomatoFromCrete.JPG",
	    "license" : " Creative Commons Attribution-Share Alike",
	    "copyright-owner" : "https://commons.wikimedia.org/wiki/User:Helentr",
	    "source" : "https://fi.wikipedia.org/wiki/Tiedosto:SnailsInTomatoFromCrete.JPG",
	    "response_time": "30"
	},
	{ 
	    "task_id":    4 ,
	    "trial_id" : 7,
	    "stimulus" : "varoitat puhelimitse havaitsemastasi vaarasta",
	    "hypermedia" : "/test_media/Erinaceus_europaeus_in_Avesta_04.jpg",
	    "mediatype" : "image",
	    "copyright" : "",
	    "response_time": "30"
	}

    ]
)




db.tasks.insert(
    {
	"task_id":    5 ,
	"evaluated": true,
	"instructions" : "<p>Nu får du tala med en svensk gymnasist via Skype. Svara först på hans/hennes frågor. Du har 10 sekunder efter varje fråga.</p>  <p>Keskustelet Skypen välityksellä ruotsinkielisen ystävyyskoulun opiskelijan kanssa. Vastaa hänen kysymyksiinsä. Sinulla on 10 sekuntia vastausaikaa kunkin kysymyksen jälkeen.</p>",
	"stimulus_layout" : "<div class=main>Paina nappia niin keskustelu alkaa. Vastaa kysymyksiin. Vastauksesi jälkeen keskustelu jatkuu välittömästi. <div id=stimulusmedia></div><div id=stimulus></div></div>",
	"controls" :  "forced_play"
    } )

db.trials.insert(
    [
	{ 
            "task_id":    5 ,
	    "trial_id" : 0,
	    "stimulus" :"",
	    "stimulus-description" : "Hej, jag är Maria/Martin Eriksson. Vad kul att träffa dig! Hur har du det i dag?",
            "hypermedia" : "/test_media/joel_01.webm",
	    "mediatype" : "video",	    
	    "response_time": "10"
	},
	{ 
            "task_id":    5 ,
	    "trial_id" : 1,
	    "stimulus" :"",
	    "stimulus-description" : "Hur är vädret i Finland?",
            "hypermedia" : "/test_media/joel_02.webm",
	    "mediatype" : "video",
	    "response_time": "10"
	},
	{ 
            "task_id":    5 ,
	    "trial_id" : 2,
	    "stimulus" :"",
	    "stimulus-description" : "Vad har du gjort i dag?",
            "hypermedia" : "/test_media/joel_03.webm",
	    "mediatype" : "video",
	    "response_time": "10"
	},
	{ 
            "task_id":    5 ,
	    "trial_id" : 3,
	    "stimulus" :"",
	    "stimulus-description" : "Jag körde just hem från skolan. Har du körkort?",
            "hypermedia" : "/test_media/joel_04.webm",
	    "mediatype" : "video",
	    "response_time": "10"
	},
	{ 
            "task_id":    5 ,
	    "trial_id" : 4,
	    "stimulus" :"",
	    "stimulus-description" : "(Mjau!) Oj, min katt vill också prata med dig. Har du ett keldjur?",
            "hypermedia" : "/test_media/joel_05.webm",
	    "mediatype" : "video",
	    "response_time": "10"
	}
    ]
)



db.tasks.insert(
    {
	"task_id":    6 ,
	"evaluated": true,
	"instructions" : "<p>Samtalet fortsätter. Nu har du en minut på dig att svara på varje fråga.</p> <p> Nyt sinulla on 1 minuutti vastausaikaa kunkin kysymyksen jälkeen.</p>",
	"stimulus_layout" : "<div class=main>{{ hypermedia }}</div>",
	"controls" :  "start_only"
    }
)

db.trials.insert(
    [
	{ 
            "task_id":    6 ,
	    "trial_id" : 0,
	    "stimulus" : "Vi bor ju på landet och har många djur. Trivs du bättre i staden eller på landet? Varför?",
            "hypermedia" : "(video_1_0)",
	    "response_time": "60"
	},
	{ 
            "task_id":    6 ,
	    "trial_id" : 1,
	    "stimulus" : "Jag tänkte kolla en film i dag. Tittar du hellre på drama eller action? Varför?",
            "hypermedia" : "(video_1_1)",
	    "response_time": "60"
	},
	{ 
            "task_id":    6 ,
	    "trial_id" : 2,
	    "stimulus" : "Jag läser också gärna. Vad gillar du för litteratur: sakprosa eller skönlitteratur? Varför?",
            "hypermedia" : "(video_1_2)",
	    "response_time": "60"
	}
    ]
)



db.tasks.insert(
    {
	"task_id":    7 ,
	"evaluated": true,
	"instructions" : "<p> Nu vill du ännu fråga om ett par saker. Börja tala när du ser anvisningen. Du har 20 sekunder för varje fråga. </p>  <p>Haluat vielä tietää muutaman asian. Reagoi, kun näet aiheen. Sinulla on  20 sekuntia aikaa esittää kysymys..</p>",
	"stimulus_layout" : "<div class=main>{{ hypermedia }}</div>",
	"controls" :  "start_only"
    } 
)

db.trials.insert (   
    [
	{ 
            "task_id":    7 ,
	    "trial_id" : 0,
	    "stimulus" : "suunnitelmat lukion jälkeen",
            "hypermedia" : "(video_2_0)",
	    "response_time": "20"
	},
	{ 
            "task_id":    7 ,
	    "trial_id" : 1,
	    "stimulus" : "toisen kotipaikkakunta ja siellä viihtyminen", 
            "hypermedia" : "(video_2_1)",
	    "response_time": "20"
	},
	{ 
            "task_id":    7 ,
	    "trial_id" : 2,
	    "stimulus" : "mielipide Ruotsin kuninkaallisista",
            "hypermedia" : "(video_2_2)",
	    "response_time": "20"
	}
    ]
)




db.tasks.insert(
    {
	"task_id":    8 ,
	"evaluated": true,
	"instructions" : "<p>Nu får du prata med din kompis. Ställ er framför webkameran så att ni båda syns. Ni söker sommarjobb och  vill helst jobba på samma ställe. Ni har hittat två intressanta annonser. Bekanta er med dem.  Diskutera alternativen och fatta ett beslut. Ska ni söka till en fiskefabrik i Norge eller till parkarbete i Sverige? Ni har 7 minuter på er.</p> <p>Tämä on parikeskustelu. Asettukaa webkameran eteen niin, että molemmat näkyvät.</p> <p> Sinä ja kaverisi haluatte lukion päätyttyä hakea samaan kesätyöpaikkaan. Olette löytäneet kaksi kiinnostavaa ilmoitusta. Keskustelkaa vaihtoehdoista ja päättäkää, haetteko kalanperkaajiksi Norjaan vai puistotyöntekijöiksi Ruotsiin? </p><p>Aikaa on 7 minuuttia.</p>",
	"stimulus_layout" : "<div class=main>{{ stimulus }} {{  syncform }}</div>",
	"controls" :  "start_only"
    }
)

db.trials.insert(
    [
	{ 
	"task_id":    8 ,
	    "trial_id" : 0,
	    "stimulus" : "Etsi parisi ja asettukaa saman koneen ääreen, niin että olette molemmat kuvassa. Kirjoittakaa sitten alle sama koodi ja odottakaa lisäohjeita ruudulta",
	    "hypermedia" : "(None)",
	    "response_time": 0
	},
	{ 
	"task_id":    8 ,
	    "trial_id" : 1,
	    "stimulus" : ["Lue työpaikkojen kuvaukset ja valmistaudu keskustelemaan niistä parisi kanssa. Lukemiseen on 3 minuuttia aikaa, sen jälkeen keskusteluun on 4 minuuttia. <h1>Fiskefabrik i norra Norge</h1> <p><a href=http://www.cribsnorge.se/rensa-fisk-i-norge>www.cribsnorge.se/rensa-fisk-i-norge</a></p> <p> <br> + 2200 e/mån <br> + ca 15 e i timmen plus tillägg för övertid, kvällar/helger och skift. <br> + företagen föredrar personer som kan förstå och göra sig förstådda på det skandinaviska språket. annars inga höga kvalifikationskrav <br> + se efter ledigt boende hos websajten <br> <br> - handrensning smutsigt och enformigt jobb <br> - kallt även på sommaren <br> - svårt att komma med på en båt utan erfarenhet, i fabriken är lönen lägre <br> - ofta skiftjobb <br> - dyrt att leva i Norge</p> <h1>Parkarbetare i södra Sverige</h1><p><a href=http://www.kommunal.se/Kommunal/Mitt-yrke/Parkarbetare-eller-tradgardsarbetare/#.VbfHumOMt4k> /www.kommunal.se/Kommunal/Mitt-yrke/Parkarbetare...</a> <p> + ca 1600 e/ mån <br> + ca 10 e i timmen <br> + dagstid, lediga veckoslut  <br> + mest varmt på sommaren <br> + fritidsaktiviteter nära i städerna <br> + korta turer till utlandet möjliga  <br> <br> - vissa arbetsmoment kan vara fysiskt tunga.  <br> - en fördel att ha traktorkort eller B-körkort  <br> - buller från maskinerna  <br> - arbete utomhus  <br> - ledig bostad? </p>"], 
	    "hypermedia" : "None",
	    "preparation_time": 180,
	    "response_time": 240	
	}
    ]
)

db.tasks.insert(
    {
	"task_id":    9 ,
	"evaluated": true,
	"instructions" : "<h2>Det var det, tack ska du ha.</h2><p>Kun kaikki tiedostot ovat siirtyneet palvelimelle tai ne on muuten tallennettu, voit siirtyä palautelomakkeeseen, jota ei ole vielä tehty.",
	"stimulus_layout" : "<div class=main>Ha det bra! Jättekiva fiilis!</div>",
	"controls" :  "None"
    }
)

db.trials.insert(
    [
	{ 
	    "task_id":    9 ,
	    "trial_id" : 0,
	    "stimulus" : "",
	    "hypermedia" : "None",
	    "response_time": 0
	}
    ]
)
