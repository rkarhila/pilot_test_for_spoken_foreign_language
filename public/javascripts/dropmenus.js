function getDropMenu(type, default_val, taskid) {
    
    var menuitems = {"fluency" : [ {value: "C1.1", description : "Osaa viestiä sujuvasti, spontaanisti ja lähes vaivattomasti."},
				   {value: "B2.2", description : "Osaa viestiä spontaanisti, usein hyvinkin sujuvasti ja vaivattomasti satunnaisista epäröinneistä huolimatta."},
				   {value: "B2.1", description : "Pystyy tuottamaan puhejaksoja melko tasaiseen tahtiin, ja puheessa on vain harvoin pitempiä taukoja. <i>Lukion päättötodistuksen arvosanan 8 taso A-englannissa</i>"},
				   {value: "B1.2", description : "Osaa ilmaista itseään suhteellisen vaivattomasti. Vaikka taukoja ja katkoksia esiintyy, puhe jatkuu ja viesti välittyy. "},
				   {value: "B1.1", description : "Pitää yllä ymmärrettävää puhetta, vaikka pitemmissä puhejaksoissa esiintyy taukoja ja epäröintiä. <i>Lukion päättötodistuksen arvosanan 8 taso B-ruotsissa ja muissa A-kielissä paitsi englannissa</i>"},
				   {value: "A2.2", description : "Puhe on välillä sujuvaa, mutta erilaiset katkokset ovat hyvin ilmeisiä."},
				   {value: "A2.1", description : "Tuottaa sujuvasti joitakin tuttuja jaksoja, mutta puheessa on paljon hyvin ilmeisiä taukoja ja vääriä aloituksia."},
				   {value: "A1.3", description : "Kaikkein tutuimmat jaksot sujuvat, muualla tauot ja katkokset ovat hyvin ilmeisiä."},
				   {value: "A1.2", description : "Puheessa on taukoja ja muita katkoksia."},
				   {value: "A1.1", description : "Puheessa voi olla paljon pitkiä taukoja, toistoja ja katkoksia."}
				 ],
		     "phonetic" :[ {value: "C1.1", description : "Osaa vaihdella intonaatiota ja sijoittaa lausepainot oikein ilmaistakseen kaikkein hienoimpiakin merkitysvivahteita. "},
				   {value: "B2.2", description : "Ääntäminen ja intonaatio ovat hyvin selkeitä ja luontevia. "},
				   {value: "B2.1", description : "Ääntäminen ja intonaatio ovat selkeitä ja luontevia. <i>Lukion päättötodistuksen arvosanan 8 taso A-englannissa</i>"},
				   {value: "B1.2", description : "Ääntäminen on hyvin ymmärrettävää, vaikka intonaatio ja painotus eivät ole aivan kohdekielen mukaisia."},
				   {value: "B1.1", description : "Ääntäminen on selvästi ymmärrettävää, vaikka vieras korostus on joskus ilmeistä ja ääntämisvirheitä esiintyy jonkin verran. <i>Lukion päättötodistuksen arvosanan 8 taso B-ruotsissa ja muissa A-kielissä paitsi englannissa</i>"},
				   {value: "A2.2", description : "Ääntäminen on ymmärrettävää, vaikka vieras korostus on ilmeistä ja ääntämisvirheitä esiintyy."},
				   {value: "A2.1", description : "Ääntäminen on ymmärrettävää, vaikka vieras korostus on hyvin ilmeistä ja ääntämisvirheistä voi koitua satunnaisia ymmärtämisongelmia."},
				   {value: "A1.3", description : "Ääntäminen voi joskus tuottaa ymmärtämisongelmia."},
				   {value: "A1.2", description : "Ääntäminen voi aiheuttaa usein ymmärtämisongelmia."},
				   {value: "A1.1", description : "Ääntäminen voi aiheuttaa suuria ymmärtämisongelmia."}
				 ] };
    
    ret="<select id='"+type+"_dropdown"+taskid+"'>";

    if (default_val == "-") {
	ret+="<option default value='-'> please select... </option>";
    }


    $.each(menuitems[type], function() {
	def="";
	if (default_val == this.value) {
	    def=" selected";
	}
	    
	ret+="<option value="+this.value + def+">"+this.value+" "+this.description+"</option>";
    });
    ret+="</select>"

    

    return ret;

}


function sendScore (type, eval_user, taskid) {

    var score=$('#'+type+'_dropdown'+taskid).val();

    console.log("Sending score for task "+taskid+": "+ score + " from "+type +" for user "+eval_user);


    // Use AJAX to post the object to our adduser service
    $.ajax({
        type: 'POST',
        data: {'eval_user': eval_user, 'score':score, 'evaltype': type, 'task': taskid},
        url: '/evaluate/',
        dataType: 'JSON'
    }).done(function( response ) {

        // Check for successful (blank) response
        if (response.msg === '') {
	    populateTable();	   
        }
        else {
            // If something goes wrong, alert the error message that our service returned
            alert('Error: ' + response.msg);

        }
    });

}




